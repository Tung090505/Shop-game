const router = require('express').Router();
const settingController = require('../controllers/settingController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public settings (Không cần login vẫn lấy được để hiển thị)
router.get('/public', settingController.getPublicSettings);

// Chỉ Admin mới được xem và sửa settings
router.get('/', verifyToken, isAdmin, settingController.getAllSettings);
router.post('/', verifyToken, isAdmin, settingController.updateSetting);

module.exports = router;
