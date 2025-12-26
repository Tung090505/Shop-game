module.exports = {
    PARTNER_ID: process.env.PARTNER_ID,
    PARTNER_KEY: process.env.PARTNER_KEY,
    API_URL: 'https://gachthe1s.com/chargingws/v2',
    CALLBACK_URL: `https://shop-game-dy16.onrender.com/api/webhooks/card?secret=${process.env.CARD_WEBHOOK_SECRET}`
};
