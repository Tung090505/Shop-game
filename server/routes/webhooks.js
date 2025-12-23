const router = require('express').Router();
const webhookController = require('../controllers/webhookController');

// Route này sẽ được các bên như SePay/Casso gọi tới
router.post('/bank', webhookController.handleBankWebhook);

// Webhook cho bên gạch thẻ cào
router.post('/card', webhookController.handleCardWebhook);

module.exports = router;
