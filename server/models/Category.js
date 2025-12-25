const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    type: {
        type: String,
        enum: ['account', 'random', 'wheel', 'service'],
        default: 'account'
    },
    image: { type: String }, // Icon or cover image for the category
    description: { type: String },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', CategorySchema);
