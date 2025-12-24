const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/auth');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!'));
    }
});

// Upload multiple images
router.post('/', verifyToken, upload.array('images', 5), (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.json({ imageUrls });
});

module.exports = router;
