const mongoose = require('mongoose');

const DepositRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['bank', 'card'], required: true },
    transactionId: { type: String, required: true, unique: true },
    cardDetails: {
        type: { type: String },
        serial: { type: String },
        pin: { type: String },
        declaredAmount: { type: Number },
        requestId: { type: String }, // Request ID gửi lên Gachthe1s
        partnerStatus: { type: mongoose.Schema.Types.Mixed }, // Status code từ Gachthe1s (1, 2, 3, 99, etc.)
        partnerMessage: { type: String }, // Message từ Gachthe1s
        apiError: { type: mongoose.Schema.Types.Mixed } // Lưu error nếu API call thất bại
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    bankTransactionId: { type: String }, // Lưu mã giao dịch từ phía Ngân hàng (SePay/Casso/PayOS)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DepositRequest', DepositRequestSchema);
