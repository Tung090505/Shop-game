const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/create', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/all', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/stats', verifyToken, isAdmin, orderController.getRevenueStats);
router.put('/:id', verifyToken, isAdmin, orderController.updateOrder);

module.exports = router;
