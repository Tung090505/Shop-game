const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'TFT', 'LOL', 'Valorant'
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    images: [{ type: String }],
    description: { type: String },
    attributes: { type: Map, of: String }, // Flexible attributes like Rank, Skins count
    credentials: {
        username: { type: String, select: false }, // Hidden by default
        password: { type: String, select: false }, // Hidden by default
    },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    flashSale: { type: Boolean, default: false },
    discountPrice: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
