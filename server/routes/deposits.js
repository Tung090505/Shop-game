const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const depositController = require('../controllers/depositController');

router.post('/submit', verifyToken, depositController.submitDeposit);
router.get('/my-deposits', verifyToken, depositController.getMyDeposits);
router.get('/all', verifyToken, isAdmin, depositController.getAllDeposits);
router.put('/:id', verifyToken, isAdmin, depositController.updateDeposit);

module.exports = router;
