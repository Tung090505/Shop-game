const mongoose = require('mongoose');
const path = require('path');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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

const fixAllImageUrls = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Đã kết nối MongoDB');

        // Fix Categories
        const categories = await Category.find({});
        let categoriesFixed = 0;

        for (const category of categories) {
            const oldImage = category.image;
            const newImage = fixImageUrl(oldImage);

            if (oldImage !== newImage) {
                category.image = newImage;
                await category.save();
                categoriesFixed++;
                console.log(`📝 Fixed category "${category.name}": ${oldImage} → ${newImage}`);
            }
        }

        // Fix Products
        const products = await Product.find({});
        let productsFixed = 0;

        for (const product of products) {
            const oldImage = product.image;
            const newImage = fixImageUrl(oldImage);

            if (oldImage !== newImage) {
                product.image = newImage;
                await product.save();
                productsFixed++;
                console.log(`📝 Fixed product "${product.name}": ${oldImage} → ${newImage}`);
            }
        }

        console.log(`\n✨ Hoàn thành!`);
        console.log(`   - Categories đã fix: ${categoriesFixed}`);
        console.log(`   - Products đã fix: ${productsFixed}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

fixAllImageUrls();
