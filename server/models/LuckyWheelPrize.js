const mongoose = require('mongoose');

const LuckyWheelPrizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['balance', 'product', 'empty'], required: true },
    value: { type: mongoose.Schema.Types.Mixed }, // Amount for balance, Product ID for product
    chance: { type: Number, required: true }, // Probability (e.g., 0.1 for 10%)
    color: { type: String, default: '#00e676' } // For frontend display
});

module.exports = mongoose.model('LuckyWheelPrize', LuckyWheelPrizeSchema);
