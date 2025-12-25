const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');
console.log('--- Auth Routes Loaded ---');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:id/:token', authController.verifyEmail);
router.get('/profile', verifyToken, authController.getProfile);
router.get('/transactions', verifyToken, authController.getTransactions);
router.post('/topup', verifyToken, authController.topup);
router.post('/withdraw-commission', verifyToken, authController.withdrawCommission);
router.post('/change-password', verifyToken, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


// Admin Routes
router.get('/all-users', verifyToken, isAdmin, authController.getAllUsers);
router.get('/all-transactions', verifyToken, isAdmin, authController.getAllTransactions);
router.put('/update-balance/:id', verifyToken, isAdmin, authController.updateUserBalance);
router.delete('/:id', verifyToken, isAdmin, authController.deleteUser);

// 2FA Verify
router.post('/verify-login-otp', authController.verifyLoginOtp);

// EMERGENCY ROUTE (Sẽ xóa sau khi dùng)
router.get('/fix-email-emergency', authController.emergencyUpdateAdminEmail);

module.exports = router;
