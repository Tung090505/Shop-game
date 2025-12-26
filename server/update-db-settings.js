const mongoose = require('mongoose');
const Setting = require('./models/Setting');
require('dotenv').config();

async function fixSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-game');
        console.log('✅ Connected to MongoDB');

        const updates = [
            { key: 'GACHTHE1S_PARTNER_ID', value: process.env.PARTNER_ID },
            { key: 'GACHTHE1S_PARTNER_KEY', value: process.env.PARTNER_KEY },
            { key: 'ADMIN_BANK_ACCOUNT', value: '788386090505' }
        ];

        for (const up of updates) {
            const result = await Setting.findOneAndUpdate(
                { key: up.key },
                { value: up.value },
                { upsert: true, new: true }
            );
            console.log(`🚀 Updated ${up.key} to: ${result.value}`);
        }

        console.log('\n✨ All settings updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating settings:', error);
        process.exit(1);
    }
}

fixSettings();
