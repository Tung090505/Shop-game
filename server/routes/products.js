const router = require('express').Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET ALL PRODUCTS (Public)
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            // Helper to escape special regex characters
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Tìm category hiện tại (case-insensitive, allow whitespace)
            const category = await Category.findOne({
                name: { $regex: new RegExp(`^\\s*${escapeRegex(req.query.category.trim())}\\s*$`, 'i') }
            });
            if (category) {
                // Tìm tất cả các category con của nó
                const subCategories = await Category.find({
                    parent: category._id
                });

                if (subCategories.length > 0) {
                    // Nếu có con, tìm sản phẩm thuộc chính nó HOẶC các con (case-insensitive)
                    const names = [category.name, ...subCategories.map(c => c.name)];
                    // Sử dụng $or thay vì $in để hỗ trợ regex
                    query.$or = names.map(name => ({
                        category: { $regex: new RegExp(`^\\s*${escapeRegex(name.trim())}\\s*$`, 'i') }
                    }));
                } else {
                    // Nếu không có con, chỉ tìm theo tên nó (case-insensitive)
                    query.category = { $regex: new RegExp(`^\\s*${escapeRegex(category.name.trim())}\\s*$`, 'i') };
                }
            } else {
                // Không tìm thấy category, vẫn thử tìm sản phẩm
                query.category = { $regex: new RegExp(`^\\s*${escapeRegex(req.query.category.trim())}\\s*$`, 'i') };
            }
        }
        if (req.query.flashSale === 'true') {
            query.flashSale = true;
        }
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET ALL PRODUCTS (Admin - including credentials)
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const products = await Product.find()
            .select('+credentials.username +credentials.password')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE PRODUCT (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE PRODUCT (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE PRODUCT (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
