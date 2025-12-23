const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const depositController = require('../controllers/depositController');

router.post('/submit', verifyToken, depositController.submitDeposit);
router.get('/my-deposits', verifyToken, depositController.getMyDeposits);
router.get('/all', verifyToken, depositController.getAllDeposits);
router.put('/:id', verifyToken, depositController.updateDeposit);

module.exports = router;
