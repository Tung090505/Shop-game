const User = require('../models/User');
const Transaction = require('../models/Transaction');
const DepositRequest = require('../models/DepositRequest');

// Đây là Controller xử lý tín hiệu từ SEPAY.VN
exports.handleBankWebhook = async (req, res) => {
    try {
        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        console.log(JSON.stringify(req.body, null, 2));

        // SePay gửi các trường: content, transferAmount, referenceCode, accountNumber...
        const { content, transferAmount, referenceCode, code, description } = req.body;

        // Lấy dữ liệu quan trọng
        const transferContent = content || description || "";
        const amount = Number(transferAmount || req.body.amount || 0);
        const bankTranId = referenceCode || code || `BANK_${Date.now()}`;

        if (!transferContent || amount <= 0) {
            console.log('Dữ liệu không hợp lệ:', { transferContent, amount });
            return res.status(200).send('Log: Missing content or amount');
        }

        // 1. Phân tích nội dung để lấy mã nạp (NAP123456)
        const regexNAP = /NAP(\d+)/i;
        const matchNAP = transferContent.match(regexNAP);

        // Hỗ trợ thêm SHOPNICK username
        const regexUser = /SHOPNICK\s+(\w+)/i;
        const matchUser = transferContent.match(regexUser);

        let deposit = null;
        let user = null;

        if (matchNAP) {
            const transactionId = matchNAP[0].toUpperCase();
            deposit = await DepositRequest.findOne({
                transactionId: transactionId,
                status: 'pending'
            }).populate('user');

            if (deposit) {
                user = deposit.user;
            }
        }

        if (!deposit && matchUser) {
            const username = matchUser[1].toLowerCase();
            user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        }

        if (!user) {
            console.log('Không tìm thấy User/Yêu cầu phù hợp cho nội dung:', transferContent);
            return res.status(200).send('Log: User not found');
        }

        // 2. Kiểm tra trùng mã giao dịch ngân hàng
        const existingTrans = await DepositRequest.findOne({ bankTransactionId: bankTranId });
        if (existingTrans && existingTrans.status === 'approved') {
            return res.status(200).send('Log: Already processed');
        }

        // 3. Cộng tiền
        user.balance += amount;
        await user.save();

        // 4. Cập nhật DepositRequest
        if (deposit) {
            deposit.status = 'approved';
            deposit.bankTransactionId = bankTranId;
            deposit.updatedAt = Date.now();
            await deposit.save();
        } else {
            await new DepositRequest({
                user: user._id,
                amount: amount,
                method: 'bank',
                transactionId: `AUTO_${Date.now()}`,
                bankTransactionId: bankTranId,
                status: 'approved'
            }).save();
        }

        // 5. Ghi Transaction Log
        await new Transaction({
            userId: user._id,
            type: 'deposit',
            amount: amount,
            description: `Nạp tiền tự động SePay (Nội dung: ${transferContent})`
        }).save();

        // 6. Gửi thông báo real-time cho người dùng
        const { notifyDepositSuccess } = require('../utils/socket');
        notifyDepositSuccess(user._id.toString(), {
            amount: amount,
            newBalance: user.balance
        });

        console.log(`[OK] Đã nạp ${amount}đ vào tài khoản ${user.username}`);
        res.status(200).send('OK');

    } catch (err) {
        console.error('SEPAY WEBHOOK ERROR:', err);
        res.status(200).send('Error but OK');
    }
};

exports.handleCardWebhook = async (req, res) => {
    try {
        console.log('--- CARD WEBHOOK RECEIVED ---');
        // Hỗ trợ cả POST (req.body) và GET (req.query)
        const data = Object.keys(req.body).length > 0 ? req.body : req.query;

        // Bảo mật: Kiểm tra Secret Key từ URL (Chặn fake request)
        // URL cấu hình: ...?secret=ShopGameBaoMat2025BaoMat2025Nsryon
        const webhookSecret = req.query.secret;
        if (webhookSecret !== 'ShopGameBaoMat2025BaoMat2025Nsryon') {
            console.log('⚠ Webhook sai Secret Key:', webhookSecret);
            return res.status(403).send('Forbidden: Invalid Secret Key');
        }

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

                // Gửi thông báo real-time
                const { notifyDepositSuccess } = require('../utils/socket');
                notifyDepositSuccess(user._id.toString(), {
                    amount: creditAmount,
                    newBalance: user.balance
                });

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
