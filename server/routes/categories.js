const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/auth');

// Public route to get all categories
router.get('/', categoryController.getCategories);

// Admin only routes
router.post('/', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    next();
}, categoryController.createCategory);

router.put('/:id', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    next();
}, categoryController.updateCategory);

router.delete('/:id', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    next();
}, categoryController.deleteCategory);

module.exports = router;
