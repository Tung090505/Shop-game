const router = require('express').Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const verifyToken = require('../middleware/auth');

// GET ALL PRODUCTS (Public)
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            // Tìm category hiện tại
            const category = await Category.findOne({ name: req.query.category });
            if (category) {
                // Tìm tất cả các category con của nó
                const subCategories = await Category.find({
                    parent: category._id
                });

                if (subCategories.length > 0) {
                    // Nếu có con, tìm sản phẩm thuộc chính nó HOẶC các con
                    const names = [category.name, ...subCategories.map(c => c.name)];
                    query.category = { $in: names };
                } else {
                    // Nếu không có con, chỉ tìm theo tên nó
                    query.category = req.query.category;
                }
            } else {
                query.category = req.query.category;
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
router.get('/admin/all', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
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
router.post('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE PRODUCT (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

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
router.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
