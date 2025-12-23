const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/create', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/all', verifyToken, orderController.getAllOrders);
router.put('/:id', verifyToken, orderController.updateOrder);

module.exports = router;
