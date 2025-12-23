const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const luckyWheelController = require('../controllers/luckyWheelController');

router.get('/prizes', luckyWheelController.getPrizes);
router.post('/spin', verifyToken, luckyWheelController.spin);

// Admin Routes
router.post('/prizes', verifyToken, luckyWheelController.addPrize);
router.put('/prizes/:id', verifyToken, luckyWheelController.updatePrize);
router.delete('/prizes/:id', verifyToken, luckyWheelController.deletePrize);

module.exports = router;
