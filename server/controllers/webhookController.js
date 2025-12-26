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
        console.log('Method:', req.method);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Query:', JSON.stringify(req.query, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));

        // Hỗ trợ cả POST (req.body) và GET (req.query)
        const data = Object.keys(req.body).length > 0 ? req.body : req.query;

        // Bảo mật: Kiểm tra Secret Key từ URL (Chặn fake request)
        // URL cấu hình: ...?secret=ShopGameBaoMat2025BaoMat2025Nsryon
        const webhookSecret = req.query.secret;
        if (webhookSecret !== 'ShopGameBaoMat2025BaoMat2025Nsryon') {
            console.log('⚠ Webhook sai Secret Key:', webhookSecret);
            return res.status(403).send('Forbidden: Invalid Secret Key');
        }

        console.log('✅ Secret Key hợp lệ');
        console.log('Data:', JSON.stringify(data, null, 2));

        const { status, amount, value, request_id, sign, message, declared_value } = data;
        const processedAmount = Number(amount || value || 0); // Số tiền thực tế sau chiết khấu từ đối tác
        const declaredAmount = Number(declared_value || 0); // Mệnh giá gốc gửi lên

        // 1. Tìm yêu cầu nạp tiền trong hệ thống
        const deposit = await DepositRequest.findOne({ transactionId: request_id }).populate('user');
        if (!deposit) {
            console.error('❌ Giao dịch không tồn tại trong hệ thống:', request_id);
            return res.status(200).send('Request not found');
        }

        // 2. Chỉ xử lý nếu yêu cầu đang chờ (pending)
        if (deposit.status !== 'pending') {
            console.log('ℹ️ Giao dịch đã được xử lý trước đó:', request_id, 'Trạng thái:', deposit.status);
            return res.status(200).send('Already processed');
        }

        // 3. Xử lý theo trạng thái từ đối tác (GachThe1s: 1 là thành công)
        if (String(status) === '1') {
            const user = await User.findById(deposit.user._id);
            if (user) {
                // ƯU TIÊN: Cộng đúng số tiền mà đối tác báo về (processedAmount)
                // Nếu processedAmount = 0 (do API không gửi), mới tính theo chiết khấu 20%
                let creditAmount = processedAmount;
                if (creditAmount <= 0) {
                    creditAmount = Math.floor(deposit.amount * 0.8);
                    console.log(`⚠️ Đối tác không gửi amount thực nhận, tự tính chiết khấu 20%: ${creditAmount}`);
                }

                user.balance += creditAmount;
                await user.save();

                deposit.status = 'approved';
                deposit.amount = declaredAmount || deposit.amount; // Cập nhật lại mệnh giá nếu có

                // Lưu vết log chi tiết
                if (!deposit.cardDetails) deposit.cardDetails = {};
                deposit.cardDetails.partnerStatus = status;
                deposit.cardDetails.partnerMessage = message;
                deposit.cardDetails.realReceived = creditAmount;

                await new Transaction({
                    userId: user._id,
                    type: 'deposit',
                    amount: creditAmount,
                    description: `Nạp thẻ ${deposit.cardDetails?.type || 'cào'} thành công. Thực nhận: ${creditAmount.toLocaleString()}đ (Mệnh giá: ${deposit.amount.toLocaleString()}đ)`
                }).save();

                // Gửi thông báo real-time
                try {
                    const { notifyDepositSuccess } = require('../utils/socket');
                    notifyDepositSuccess(user._id.toString(), {
                        amount: creditAmount,
                        newBalance: user.balance
                    });
                } catch (socketErr) {
                    console.error('⚠️ Lỗi gửi socket notification:', socketErr.message);
                }

                console.log(`✅ [TỰ ĐỘNG] Đã cộng ${creditAmount}đ cho người dùng ${user.username}`);
            }
        } else {
            // Thẻ lỗi (status khác 1)
            console.log(`❌ Thẻ bị từ chối bởi đối tác. Status: ${status}, Message: ${message}`);
            deposit.status = 'rejected';
            if (deposit.cardDetails) {
                deposit.cardDetails.partnerStatus = status;
                deposit.cardDetails.partnerMessage = message;
            }

            // GỬI THÔNG BÁO THẺ LỖI
            try {
                const { notifyDepositError } = require('../utils/socket');
                notifyDepositError(deposit.user._id.toString(), {
                    message: message || 'Thẻ không hợp lệ hoặc sai mệnh giá',
                    transactionId: request_id
                });
            } catch (socketErr) {
                console.error('⚠️ Lỗi gửi socket notification (Error):', socketErr.message);
            }
        }

        deposit.updatedAt = Date.now();
        await deposit.save();

        res.status(200).send('OK');

    } catch (err) {
        console.error('CARD WEBHOOK ERROR:', err);
        res.status(500).send('Internal Server Error');
    }
};
