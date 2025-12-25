const router = require('express').Router();
const multer = require('multer');
const { verifyToken, isAdmin } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Config Storage Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'shop-game-assets', // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, margin: "auto", crop: "limit" }] // Tối ưu ảnh, resize nếu quá to
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload multiple images
router.post('/', verifyToken, isAdmin, upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file' });
    }

    // Với Cloudinary, đường dẫn ảnh nằm trong file.path
    const imageUrls = req.files.map(file => file.path);

    res.json({ imageUrls });
});

module.exports = router;
