const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // Cho phép tải ảnh từ server khác
    contentSecurityPolicy: false      // Không chặn các script lạ
}));
app.use(cors({
    origin: '*', // Chấp nhận tất cả nguồn (điện thoại, web khác...)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Static Files
app.use('/uploads', express.static(uploadDir));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Tăng giới hạn lên 1000 requests để bạn thoải mái test
    message: 'Hệ thống phát hiện quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.'
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const authRoute = require('./routes/auth');
const productRoute = require('./routes/products');
const orderRoute = require('./routes/orders');
const luckyWheelRoute = require('./routes/luckyWheel');
const depositRoute = require('./routes/deposits');
const webhookRoute = require('./routes/webhooks');
const uploadRoute = require('./routes/upload');
const categoryRoute = require('./routes/categories');

app.use('/api/user', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/lucky-wheel', luckyWheelRoute);
app.use('/api/deposits', depositRoute);
app.use('/api/webhooks', webhookRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/categories', categoryRoute);

app.get('/', (req, res) => {
    res.send('Shop Game API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
