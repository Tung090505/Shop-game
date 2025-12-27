const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.createOrder = async (req, res) => {
    try {
        const { productId } = req.body;

        // BƯỚC 1: KHÓA SẢN PHẨM (ATOMIC)
        // Tìm sản phẩm còn 'available' và đổi ngay sang 'sold' trong 1 câu lệnh.
        // Nếu 10 người cùng mua, chỉ 1 người thành công đổi trạng thái này.
        const product = await Product.findOneAndUpdate(
            { _id: productId, status: 'available' },
            { $set: { status: 'sold' } },
            { new: true }
        );

        if (!product) {
            return res.status(400).json({ message: 'Sản phẩm đã bị người khác mua mất hoặc không tồn tại!' });
        }

        // BƯỚC 2: TRỪ TIỀN NGƯỜI DÙNG (ATOMIC)
        // Chỉ trừ tiền nếu balance >= giá sản phẩm.
        const user = await User.findOneAndUpdate(
            { _id: req.user._id, balance: { $gte: product.price } },
            { $inc: { balance: -product.price } },
            { new: true }
        );

        // BƯỚC 3: ROLLBACK NẾU THIẾU TIỀN
        if (!user) {
            // Nếu người dùng không đủ tiền, ta phải trả lại trạng thái 'available' cho sản phẩm
            await Product.findByIdAndUpdate(productId, { $set: { status: 'available' } });
            return res.status(400).json({ message: 'Số dư tài khoản không đủ để mua sản phẩm này!' });
        }

        // BƯỚC 4: GHI LOG GIAO DỊCH
        await new Transaction({
            userId: user._id,
            type: 'purchase',
            amount: -product.price,
            description: `Mua tài khoản: ${product.title} (#${product._id})`
        }).save();

        // Xử lý hoa hồng cộng tác viên (giữ nguyên logic cũ của bạn)
        if (user.referredBy) {
            const commission = Math.floor(product.price * 0.05);
            if (commission > 0) {
                const referrer = await User.findById(user.referredBy);
                if (referrer) {
                    referrer.commissionBalance = (referrer.commissionBalance || 0) + commission;
                    await referrer.save();
                    await new Transaction({
                        userId: referrer._id,
                        type: 'deposit',
                        amount: commission,
                        description: `Hoa hồng giới thiệu từ ${user.username} mua ${product.title}`
                    }).save();
                }
            }
        }

        const order = new Order({
            user: user._id,
            product: product._id,
            price: product.price,
        });
        await order.save();

        res.json({ message: 'Mua hàng thành công!', order });
    } catch (err) {
        console.error('Lỗi mua hàng:', err);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('product')
            .sort({ createdAt: -1 });

        const ordersWithCredentials = await Promise.all(orders.map(async (order) => {
            if (!order.product) return order.toObject();
            const product = await Product.findById(order.product._id).select('+credentials.username +credentials.password');
            return { ...order.toObject(), product };
        }));

        res.json(ordersWithCredentials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getRevenueStats = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Total Revenue
        const totalRevenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

        // 2. Revenue Today
        const todayRevenueResult = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const todayRevenue = todayRevenueResult[0]?.total || 0;

        // 3. Revenue This Month
        const monthRevenueResult = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const monthRevenue = monthRevenueResult[0]?.total || 0;

        // 4. Revenue Last 7 Days (for Chart)
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 6);
        last7Days.setHours(0, 0, 0, 0);

        const dailyRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: '$price' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalRevenue,
            todayRevenue,
            monthRevenue,
            dailyRevenue
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
