const DepositRequest = require('../models/DepositRequest');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const axios = require('axios');
const md5 = require('md5');
const cardConfig = require('../config/cardApi');
const { getConfig } = require('./settingController'); // Helper để lấy config động

exports.submitDeposit = async (req, res) => {
    try {
        const { amount, method, transactionId, cardDetails } = req.body;

        const existing = await DepositRequest.findOne({ transactionId });
        if (existing) return res.status(400).json({ message: 'Transaction ID already submitted' });

        if (method === 'card') {
            const { type, serial, pin, declaredAmount } = cardDetails;
            const requestId = `CARD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

            // Lấy config động từ DB
            const partnerId = await getConfig('GACHTHE1S_PARTNER_ID');
            const partnerKey = await getConfig('GACHTHE1S_PARTNER_KEY');

            if (!partnerId || !partnerKey) {
                console.error('❌ Gachthe1s config missing:', { partnerId, partnerKey });
                return res.status(500).json({ message: 'Hệ thống nạp thẻ chưa được cấu hình. Vui lòng liên hệ Admin.' });
            }

            // Tạo chữ ký: md5(partner_key + code + serial)
            const sign = md5(partnerKey + pin + serial);

            const apiData = {
                partner_id: partnerId,
                telco: type,
                code: pin,
                serial: serial,
                amount: declaredAmount,
                request_id: requestId,
                sign: sign,
                command: 'charging'
            };

            console.log('🔄 Sending card to Gachthe1s:', {
                url: cardConfig.API_URL,
                requestId,
                telco: type,
                amount: declaredAmount,
                serial: serial.substring(0, 4) + '***', // Ẩn một phần serial
                pin: '***' // Ẩn hoàn toàn PIN
            });

            let apiResponse = null;
            let apiError = null;

            // Gửi request lên Gachthe1s với error handling
            try {
                apiResponse = await axios.post(cardConfig.API_URL, apiData, {
                    timeout: 30000, // 30 seconds timeout
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const safeResponse = apiResponse?.data ? { ...apiResponse.data } : {};
                if (safeResponse.code) safeResponse.code = '***';
                if (safeResponse.serial) safeResponse.serial = safeResponse.serial.substring(0, 4) + '***';
                console.log('✅ Gachthe1s Response (Masked):', safeResponse);
            } catch (error) {
                apiError = error;
                const safeErrResponse = error.response?.data ? { ...error.response.data } : {};
                if (safeErrResponse.code) safeErrResponse.code = '***';
                if (safeErrResponse.serial) safeErrResponse.serial = safeErrResponse.serial.substring(0, 4) + '***';

                console.error('❌ Gachthe1s API Error:', {
                    message: error.message,
                    response: safeErrResponse,
                    status: error.response?.status,
                    code: error.code
                });
            }

            // Tạo deposit request trong DB (dù API có lỗi hay không)
            const newRequest = new DepositRequest({
                user: req.user._id,
                amount: declaredAmount,
                method: 'card',
                transactionId: requestId,
                cardDetails: {
                    ...cardDetails,
                    requestId,
                    partnerStatus: apiResponse?.data?.status || 'error',
                    partnerMessage: apiResponse?.data?.message || apiError?.message || 'Unknown error',
                    apiError: apiError ? {
                        message: apiError.message,
                        code: apiError.code,
                        response: apiError.response?.data
                    } : null
                }
            });

            // PHÂN TÍCH KẾT QUẢ TỪ API
            const status = apiResponse?.data?.status;
            const message = apiResponse?.data?.message || apiError?.message || 'Unknown error';

            // Lưu dữ liệu Gachthe1s trả về
            newRequest.cardDetails.partnerStatus = status;
            newRequest.cardDetails.partnerMessage = message;

            // TRƯỜNG HỢP 1: Thẻ được duyệt ngay lập tức (Status 1 hoặc 99 tùy API, Gachthe1s thường là 1)
            if (status == 1 || status == 99) {
                console.log('✨ [INSTANT APPROVAL] Thẻ được duyệt ngay lập tức!');

                const user = await User.findById(req.user._id);
                if (user) {
                    // Lấy số tiền thực nhận từ API hoặc tính mặc định 85%
                    const processedAmount = Number(apiResponse.data.amount || apiResponse.data.value || 0);
                    let creditAmount = processedAmount;
                    if (creditAmount <= 0) {
                        creditAmount = Math.floor(declaredAmount * 0.85);
                    }

                    user.balance += creditAmount;
                    await user.save();

                    newRequest.status = 'approved';
                    newRequest.amount = declaredAmount;
                    newRequest.cardDetails.realReceived = creditAmount;

                    await new Transaction({
                        userId: user._id,
                        type: 'deposit',
                        amount: creditAmount,
                        description: `Nạp thẻ ${type} thành công (Duyệt nhanh). Nhận: ${creditAmount.toLocaleString()}đ`
                    }).save();

                    // Gửi thông báo real-time qua socket
                    try {
                        const { notifyDepositSuccess } = require('../utils/socket');
                        notifyDepositSuccess(user._id.toString(), {
                            amount: creditAmount,
                            newBalance: user.balance
                        });
                    } catch (sErr) {
                        console.error('Socket notification error:', sErr.message);
                    }

                    await newRequest.save();

                    return res.status(200).json({
                        message: 'Nạp thẻ thành công! Tiền đã được cộng vào tài khoản.',
                        status: 'success',
                        deposit: newRequest
                    });
                }
            }

            // TRƯỜNG HỢP 2: Thẻ đang chờ xử lý (Status 99 hoặc khác)
            if (status == 99 || !apiError) {
                newRequest.status = 'pending';
                await newRequest.save();
                return res.status(200).json({
                    message: 'Gửi thẻ thành công! Vui lòng đợi hệ thống duyệt trong vài phút.',
                    status: 'pending',
                    deposit: newRequest
                });
            }

            // TRƯỜNG HỢP 3: Thẻ bị lỗi ngay lập tức
            newRequest.status = 'rejected';
            await newRequest.save();
            return res.status(400).json({
                message: `Thẻ bị từ chối: ${message}`,
                status: 'error',
                deposit: newRequest
            });
        }

        // Xử lý nạp Bank mặc định
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

        // Allow retry/approve if rejected, but block if already approved
        if (deposit.status === 'approved') return res.status(400).json({ message: 'Request already processed successfully' });

        if (status === 'approved') {
            const user = await User.findById(deposit.user);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Nếu nạp thẻ cào thì áp dụng chiết khấu 20% (khách nhận 80%)
            // Nếu nạp Bank thì nhận 100%
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

// AUTO TASK: Hủy các giao dịch treo quá 3 phút (theo yêu cầu chống spam)
exports.startAutoCleanup = () => {
    console.log('🔄 Starting Deposit Auto-Cleanup Task...');
    setInterval(async () => {
        try {
            const expireTime = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago

            // Tìm và hủy các đơn pending quá 3 phút
            const result = await DepositRequest.updateMany(
                { status: 'pending', createdAt: { $lt: expireTime } },
                { $set: { status: 'rejected', updatedAt: Date.now() } }
            );

            if (result.modifiedCount > 0) {
                console.log(`🧹 Auto-cancelled ${result.modifiedCount} expired deposit requests.`);
            }
        } catch (error) {
            console.error('❌ Auto-cleanup failed:', error);
        }
    }, 60000); // Run every 60 seconds
};
