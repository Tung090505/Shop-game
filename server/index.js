const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
}));
app.disable('x-powered-by'); // Ẩn thông tin Server (Express)

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' }));

// Fix lỗi "Cannot set property" của mongoSanitize trên Express 5 / Render
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', { value: { ...req.query }, writable: true, configurable: true });
    Object.defineProperty(req, 'body', { value: { ...req.body }, writable: true, configurable: true });
    Object.defineProperty(req, 'params', { value: { ...req.params }, writable: true, configurable: true });
    next();
});
app.use(mongoSanitize()); // Chống NoSQL Injection

// Trust proxy
app.set('trust proxy', 1);

// Limiters cho từng loại endpoint
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Quá nhiều yêu cầu từ IP này.'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 20, // Chỉ cho phép 20 lần thử login/register mỗi giờ từ 1 IP
    message: 'Bạn đã thử quá nhiều lần, vui lòng đợi sau 1 giờ.'
});

app.use('/api/', apiLimiter);
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/user/verify-login-otp', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Bạn đã nhập sai mã OTP quá nhiều lần. Vui lòng đợi 15 phút.'
}));
app.use('/api/user/forgot-password', rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Bạn chỉ được yêu cầu đổi mật khẩu 3 lần mỗi giờ.'
}));
app.use('/api/user/reset-password', rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Quá nhiều lần thử đặt lại mật khẩu.'
}));
app.use('/api/deposits/submit', rateLimit({ windowMs: 1 * 60 * 1000, max: 2 })); // 1 phút chỉ được nạp 2 thẻ

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        initSettings();
        startAutoCleanup();
    })
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
const maintenanceRoute = require('./routes/maintenance');
const settingRoute = require('./routes/settings');
const { initSettings } = require('./controllers/settingController');
const { startAutoCleanup } = require('./controllers/depositController');

app.use('/api/user', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/lucky-wheel', luckyWheelRoute);
app.use('/api/deposits', depositRoute);
app.use('/api/webhooks', webhookRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/maintenance', maintenanceRoute);
app.use('/api/settings', settingRoute);

app.get('/', (req, res) => {
    res.send('Shop Game API is running');
});

// Start Server with Socket.IO
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.IO
const { initSocket } = require('./utils/socket');
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO initialized`);
});
