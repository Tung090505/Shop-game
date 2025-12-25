const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const luckyWheelController = require('../controllers/luckyWheelController');

router.get('/prizes', luckyWheelController.getPrizes);
router.post('/spin', verifyToken, luckyWheelController.spin);

// Admin Routes
router.post('/prizes', verifyToken, isAdmin, luckyWheelController.addPrize);
router.put('/prizes/:id', verifyToken, isAdmin, luckyWheelController.updatePrize);
router.delete('/prizes/:id', verifyToken, isAdmin, luckyWheelController.deletePrize);

module.exports = router;
