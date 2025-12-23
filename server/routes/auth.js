const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:id/:token', authController.verifyEmail);
router.get('/profile', verifyToken, authController.getProfile);
router.get('/transactions', verifyToken, authController.getTransactions);
router.post('/topup', verifyToken, authController.topup);
router.post('/withdraw-commission', verifyToken, authController.withdrawCommission);
router.post('/change-password', verifyToken, authController.changePassword);

// Admin Routes
router.get('/all-users', verifyToken, authController.getAllUsers);
router.get('/all-transactions', verifyToken, authController.getAllTransactions);
router.put('/update-balance/:id', verifyToken, authController.updateUserBalance);
router.delete('/:id', verifyToken, authController.deleteUser);

module.exports = router;
