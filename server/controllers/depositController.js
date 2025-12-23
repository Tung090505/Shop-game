const DepositRequest = require('../models/DepositRequest');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const axios = require('axios');
const md5 = require('md5');
const cardConfig = require('../config/cardApi');

exports.submitDeposit = async (req, res) => {
    try {
        const { amount, method, transactionId, cardDetails } = req.body;

        const existing = await DepositRequest.findOne({ transactionId });
        if (existing) return res.status(400).json({ message: 'Transaction ID already submitted' });

        if (method === 'card') {
            const { type, serial, pin, declaredAmount } = cardDetails;
            const requestId = `CARD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

            // Tạo chữ ký theo yêu cầu đối tác: md5(partner_key + code + serial)
            // Lưu ý: Đối tác thường gọi mã thẻ là 'code' hoặc 'pin'
            const sign = md5(cardConfig.PARTNER_KEY + pin + serial);

            const apiData = {
                partner_id: cardConfig.PARTNER_ID,
                telco: type,
                code: pin,
                serial: serial,
                amount: declaredAmount,
                request_id: requestId,
                sign: sign,
                command: 'charging'
            };

            const response = await axios.post(cardConfig.API_URL, apiData);
            const status = response.data.status; // Giả định theo API phổ biến: 1, 2, 3, 99...

            const newRequest = new DepositRequest({
                user: req.user._id,
                amount: declaredAmount,
                method: 'card',
                transactionId: requestId,
                cardDetails: { ...cardDetails, requestId, partnerStatus: status }
            });

            // Nếu thẻ lỗi ngay lập tức (status 3 hoặc 100)
            if (status === 3 || status === 100) {
                newRequest.status = 'rejected';
                await newRequest.save();
                return res.status(400).json({ message: response.data.message || 'Thẻ lỗi hoặc không hợp lệ' });
            }

            // Nếu thẻ nạp thành công ngay lập tức (status 1 hoặc 2)
            if (status === 1 || status === 2) {
                // ... Xử lý cộng tiền ngay lập tức nếu cần (thường status 99 là phổ biến nhất)
            }

            await newRequest.save();
            return res.status(201).json({
                message: status === 99 ? 'Thẻ đã gửi lên hệ thống, đang chờ xử lý' : 'Gửi thẻ thành công',
                deposit: newRequest
            });
        }

        // Xử lý nạp Bank/Momo mặc định
        const newRequest = new DepositRequest({
            user: req.user._id,
            amount,
            method,
            transactionId,
            cardDetails: undefined
        });

        const saved = await newRequest.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyDeposits = async (req, res) => {
    try {
        const deposits = await DepositRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(deposits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllDeposits = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const deposits = await DepositRequest.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.json(deposits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateDeposit = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const { status } = req.body;
        const deposit = await DepositRequest.findById(req.params.id);

        if (!deposit) return res.status(404).json({ message: 'Deposit not found' });
        if (deposit.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

        if (status === 'approved') {
            const user = await User.findById(deposit.user);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Nếu nạp thẻ cào thì áp dụng chiết khấu 20% (khách nhận 80%)
            // Nếu nạp Bank/Momo thì nhận 100%
            const creditAmount = deposit.method === 'card' ? Math.floor(deposit.amount * 0.8) : deposit.amount;

            user.balance += creditAmount;
            await user.save();

            // Log Transaction
            await new Transaction({
                userId: user._id,
                type: 'deposit',
                amount: creditAmount,
                description: `Nạp tiền qua ${deposit.method.toUpperCase()} (${status === 'approved' ? 'Admin duyệt' : 'Tự động'})`
            }).save();
        }

        deposit.status = status;
        deposit.updatedAt = Date.now();
        await deposit.save();

        res.json({ message: `Deposit ${status}`, deposit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
