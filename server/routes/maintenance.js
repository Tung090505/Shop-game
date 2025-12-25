const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Hàm chuyển đổi URL localhost thành path tương đối
const fixImageUrl = (url) => {
    if (!url) return url;

    // Nếu URL chứa localhost hoặc 127.0.0.1, chuyển thành path tương đối
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        // Lấy phần /uploads/... từ URL
        const match = url.match(/\/uploads\/.+$/);
        if (match) {
            return match[0]; // Trả về /uploads/filename.jpg
        }
    }

    return url;
};

// API endpoint để fix tất cả image URLs (Admin Only)
router.post('/fix-image-urls', verifyToken, isAdmin, async (req, res) => {
    try {
        const results = {
            categoriesFixed: 0,
            productsFixed: 0,
            details: []
        };

        // Fix Categories
        const categories = await Category.find({});

        for (const category of categories) {
            const oldImage = category.image;
            const newImage = fixImageUrl(oldImage);

            if (oldImage !== newImage) {
                category.image = newImage;
                await category.save();
                results.categoriesFixed++;
                results.details.push({
                    type: 'category',
                    name: category.name,
                    oldUrl: oldImage,
                    newUrl: newImage
                });
            }
        }

        // Fix Products
        const products = await Product.find({});

        for (const product of products) {
            const oldImage = product.image;
            const newImage = fixImageUrl(oldImage);

            if (oldImage !== newImage) {
                product.image = newImage;
                await product.save();
                results.productsFixed++;
                results.details.push({
                    type: 'product',
                    name: product.name,
                    oldUrl: oldImage,
                    newUrl: newImage
                });
            }
        }

        res.json({
            success: true,
            message: 'Đã fix tất cả image URLs',
            results
        });
    } catch (error) {
        console.error('Error fixing image URLs:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi fix image URLs',
            error: error.message
        });
    }
});

module.exports = router;
