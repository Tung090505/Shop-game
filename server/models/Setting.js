const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    group: {
        type: String, // 'payment', 'general', 'security'
        default: 'general'
    },
    isPublic: {
        type: Boolean, // Nếu true thì API public có thể đọc (ví dụ: banner, thông báo), false thì chỉ nội bộ server biết
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
