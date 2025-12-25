const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public route to get all categories
router.get('/', categoryController.getCategories);

// Admin only routes
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);

router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
