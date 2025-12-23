const User = require('../models/User');
const Transaction = require('../models/Transaction');
const DepositRequest = require('../models/DepositRequest');

// Đây là Controller xử lý tín hiệu từ các bên như SePay, Casso hoặc PayOS
exports.handleBankWebhook = async (req, res) => {
    try {
        // Log dữ liệu nhận được để dễ dàng debug
        console.log('--- BANK WEBHOOK RECEIVED ---');
        console.log(JSON.stringify(req.body, null, 2));

        // Tùy theo bên bạn dùng, cấu trúc req.body sẽ khác nhau. 
        // Ở đây mình làm ví dụ theo cấu trúc phổ biến của SePay/Casso:
        // { content: "SHOPNICK ADMIN", amount: 50000, reference: "TH8273" }

        const { content, amount, reference, code } = req.body;
        const transactionCode = reference || code; // Mã giao dịch từ ngân hàng

        if (!content || !amount) {
            return res.status(400).send('Invalid data');
        }

        // 1. Phân tích nội dung chuyển khoản để lấy Username
        // Định dạng mình đã cài ở FE là: "SHOPNICK USERNAME"
        const regex = /SHOPNICK\s+(\w+)/i;
        const match = content.match(regex);

        if (!match) {
            console.log('Nội dung không hợp lệ hoặc không phải của shop:', content);
            return res.status(200).send('Log: Content not related to Shop');
        }

        const username = match[1].toLowerCase();
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });

        if (!user) {
            console.log('Không tìm thấy người dùng cho username:', username);
            return res.status(200).send('Log: User not found');
        }

        // 2. Kiểm tra xem mã giao dịch này đã được cộng tiền chưa (trùng lặp)
        const existingDeposit = await DepositRequest.findOne({ transactionId: transactionCode });
        if (existingDeposit && existingDeposit.status === 'approved') {
            return res.status(200).send('Log: Transaction already processed');
        }

        // 3. Thực hiện cộng tiền và tạo lịch sử
        user.balance += Number(amount);
        await user.save();

        // Tạo hoặc cập nhật yêu cầu nạp tiền
        if (existingDeposit) {
            existingDeposit.status = 'approved';
            existingDeposit.updatedAt = Date.now();
            await existingDeposit.save();
        } else {
            await new DepositRequest({
                user: user._id,
                amount: Number(amount),
                method: 'bank',
                transactionId: transactionCode,
                status: 'approved'
            }).save();
        }

        // Ghi log Transaction chính thức
        await new Transaction({
            userId: user._id,
            type: 'deposit',
            amount: Number(amount),
            description: `Nạp tiền tự động qua Ngân hàng (Nội dung: ${content})`
        }).save();

        console.log(`[SUCCESS] Đã cộng ${amount}đ cho user ${user.username}`);
        res.status(200).send('OK');

    } catch (err) {
        console.error('WEBHOOK ERROR:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.handleCardWebhook = async (req, res) => {
    try {
        console.log('--- CARD WEBHOOK RECEIVED ---');
        // Hỗ trợ cả POST (req.body) và GET (req.query)
        const data = Object.keys(req.body).length > 0 ? req.body : req.query;
        console.log(JSON.stringify(data, null, 2));

        const { status, amount, value, request_id, sign, message } = data;
        const realAmount = Number(amount || value); // Lấy số tiền thực nhận

        // 1. Tìm yêu cầu nạp tiền trong hệ thống
        const deposit = await DepositRequest.findOne({ transactionId: request_id }).populate('user');
        if (!deposit) {
            console.log('Không tìm thấy giao dịch:', request_id);
            return res.status(200).send('Request not found');
        }

        // 2. Chỉ xử lý nếu yêu cầu đang chờ (pending)
        if (deposit.status !== 'pending') {
            return res.status(200).send('Already processed');
        }

        // 3. Xử lý theo trạng thái từ đối tác (GachThe1s: 1 là thành công)
        if (String(status) === '1') {
            const user = await User.findById(deposit.user._id);
            if (user) {
                // Giả định chiết khấu nạp thẻ là 20% (khách nhận 80%)
                const creditAmount = Math.floor(realAmount * 0.8);

                user.balance += creditAmount;
                await user.save();

                deposit.status = 'approved';
                deposit.amount = realAmount;

                await new Transaction({
                    userId: user._id,
                    type: 'deposit',
                    amount: creditAmount,
                    description: `Nạp thẻ cào thành công (${deposit.cardDetails?.type} ${realAmount.toLocaleString()}đ)`
                }).save();

                console.log(`[TỰ ĐỘNG] Đã cộng ${creditAmount}đ cho ${user.username}`);
            }
        } else {
            // Thẻ lỗi (status khác 1)
            deposit.status = 'rejected';
        }

        deposit.updatedAt = Date.now();
        await deposit.save();

        res.status(200).send('OK');

    } catch (err) {
        console.error('CARD WEBHOOK ERROR:', err);
        res.status(500).send('Internal Server Error');
    }
};
