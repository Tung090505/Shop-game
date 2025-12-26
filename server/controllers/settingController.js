const Setting = require('../models/Setting');

// Helper function để lấy config từ DB hoặc ENV (Sử dụng nội bộ server)
exports.getConfig = async (key) => {
    try {
        const setting = await Setting.findOne({ key });
        if (setting && setting.value) {
            return setting.value;
        }
    } catch (error) {
        console.error(`Error fetching setting ${key}:`, error);
    }
    // Fallback về environment variable
    return process.env[key];
};

// API: Lấy toàn bộ settings (Chỉ dành cho Admin)
exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.find({});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Lấy settings công khai (Cho frontend)
exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await Setting.find({ isPublic: true });
        // Chuyển về dạng object { key: value } cho frontend dễ dùng
        const config = {};
        settings.forEach(s => {
            config[s.key] = s.value;
        });
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Cập nhật hoặc tạo mới setting
exports.updateSetting = async (req, res) => {
    const { key, value, description, group, isPublic } = req.body;

    try {
        let setting = await Setting.findOne({ key });
        if (setting) {
            setting.value = value;
            if (description) setting.description = description;
            if (group) setting.group = group;
            if (isPublic !== undefined) setting.isPublic = isPublic;
            await setting.save();
        } else {
            setting = new Setting({
                key,
                value,
                description,
                group,
                isPublic
            });
            await setting.save();
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Initialize Default Settings (Chạy 1 lần để seed data nếu chưa có)
exports.initSettings = async () => {
    const defaults = [
        { key: 'GACHTHE1S_PARTNER_ID', value: process.env.PARTNER_ID, group: 'payment', description: 'Partner ID từ Gachthe1s.com' },
        { key: 'GACHTHE1S_PARTNER_KEY', value: process.env.PARTNER_KEY, group: 'payment', description: 'Partner Key từ Gachthe1s.com (KHÔNG phải mã ví điện tử!)' },
        { key: 'ADMIN_BANK_NAME', value: 'MB', group: 'banking', description: 'Tên ngân hàng (ShortName: MB, VCB...)', isPublic: true },
        { key: 'ADMIN_BANK_ACCOUNT', value: '788386090505', group: 'banking', description: 'Số tài khoản nhận tiền', isPublic: true },
        { key: 'ADMIN_BANK_ACCOUNT_NAME', value: 'PHAM THANH TUNG', group: 'banking', description: 'Tên chủ tài khoản', isPublic: true }
    ];

    for (const def of defaults) {
        const exists = await Setting.findOne({ key: def.key });
        if (!exists && def.value) {
            await Setting.create(def);
            console.log(`Initialized setting: ${def.key}`);
        }
    }
};
