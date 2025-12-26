module.exports = {
    PARTNER_ID: process.env.PARTNER_ID || '12757981513',
    PARTNER_KEY: process.env.PARTNER_KEY || '7bea6961386bb7f8b0d2820bea21424c',
    API_URL: 'https://gachthe1s.com/chargingws/v2',
    CALLBACK_URL: `https://shop-game-dy16.onrender.com/api/webhooks/card?secret=${process.env.CARD_WEBHOOK_SECRET || 'ShopGameBaoMat2025BaoMat2025Nsryon'}`
};
