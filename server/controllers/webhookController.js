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
        console.log('--- 🛡️ CARD WEBHOOK RECEIVED ---');

        // 1. Lấy dữ liệu từ mọi nguồn có thể (Body, Query)
        const data = { ...req.query, ...req.body };

        // Bảo mật log: Ẩn thông tin thẻ
        const safeData = { ...data };
        if (safeData.code) safeData.code = '***';
        if (safeData.serial) safeData.serial = safeData.serial.substring(0, 4) + '***';

        console.log('📦 Webhook Data Payload (Masked):', JSON.stringify(safeData, null, 2));

        // 2. Bảo mật: Kiểm tra Secret Key (Chấp nhận cả trong URL và Body)
        const webhookSecret = req.query.secret || req.body.secret;
        const EXPECTED_SECRET = process.env.CARD_WEBHOOK_SECRET;

        if (webhookSecret !== EXPECTED_SECRET) {
            console.error('❌ Webhook sai hoặc thiếu Secret Key:', webhookSecret);
            // Ghi log lỗi vào console để bạn copy cho tôi xem nếu cần
            return res.status(403).json({
                message: 'Forbidden: Invalid Secret Key',
                received: webhookSecret
            });
        }

        console.log('✅ Secret Key hợp lệ, bắt đầu xử lý...');

        const { status, amount, value, request_id, sign, message, declared_value } = data;
        const processedAmount = Number(amount || value || 0); // Số tiền thực tế sau chiết khấu từ đối tác
        const declaredAmount = Number(declared_value || 0); // Mệnh giá gốc gửi lên

        // 3. Tìm yêu cầu nạp tiền trong hệ thống
        if (!request_id) {
            console.error('❌ Webhook không gửi request_id');
            return res.status(200).send('Missing request_id');
        }

        const deposit = await DepositRequest.findOne({ transactionId: request_id }).populate('user');
        if (!deposit) {
            console.error('❌ Giao dịch không tồn tại trong DB của web:', request_id);
            return res.status(200).send('Request not found in local DB');
        }

        // 4. Chỉ xử lý nếu yêu cầu đang chờ (pending)
        if (deposit.status !== 'pending') {
            console.log('ℹ️ Giao dịch này đã được xử lý rồi:', request_id, 'Trạng thái hiện tại:', deposit.status);
            return res.status(200).send('Already processed');
        }

        // Ghi lại dữ liệu thô từ đối tác để sau này dễ debug
        if (!deposit.cardDetails) deposit.cardDetails = {};
        deposit.cardDetails.lastWebhookData = data;
        deposit.cardDetails.partnerStatus = status;

        // 5. Xử lý theo trạng thái từ đối tác (GachThe1s: 1 là thành công)
        // Dùng == 1 để chấp nhận cả số và chuỗi "1"
        if (status == 1) {
            const user = await User.findById(deposit.user._id);
            if (user) {
                // ƯU TIÊN: Cộng đúng số tiền mà đối tác báo về (processedAmount)
                let creditAmount = processedAmount;
                if (creditAmount <= 0) {
                    // Nếu đối tác không gửi tiền thực nhận, tính theo bảng giá mặc định (ví dụ 80%)
                    creditAmount = Math.floor(deposit.amount * 0.85); // Tăng lên 85% cho công bằng
                    console.log(`⚠️ Không có amount thực nhận, tính 85%: ${creditAmount}`);
                }

                user.balance += creditAmount;
                await user.save();

                deposit.status = 'approved';
                deposit.amount = declaredAmount || deposit.amount;
                deposit.cardDetails.realReceived = creditAmount;

                await new Transaction({
                    userId: user._id,
                    type: 'deposit',
                    amount: creditAmount,
                    description: `Nạp thẻ ${deposit.cardDetails?.type || 'cào'} tự động thành công. Nhận: ${creditAmount.toLocaleString()}đ`
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
            deposit.cardDetails.partnerMessage = message;

            // GỬI THÔNG BÁO THẺ LỖI
            try {
                const { notifyDepositError } = require('../utils/socket');
                notifyDepositError(deposit.user._id.toString(), {
                    message: message || 'Thẻ không hợp lệ hoặc sai mệnh giá',
                    transactionId: request_id
                });
            } catch (socketErr) {
                console.error('⚠️ Lỗi socket error:', socketErr.message);
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
