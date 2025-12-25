const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.createOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.status === 'sold') return res.status(400).json({ message: 'Product already sold' });

        const user = await User.findById(req.user._id);
        if (user.balance < product.price) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.balance -= product.price;
        await user.save();

        await new Transaction({
            userId: user._id,
            type: 'purchase',
            amount: -product.price,
            description: `Purchase: ${product.title}`
        }).save();

        product.status = 'sold';
        await product.save();

        if (user.referredBy) {
            const commission = Math.floor(product.price * 0.05);
            console.log(`[ORDER] Checking commission for User ${user.username}, Ref: ${user.referredBy}, Price: ${product.price}, Comm: ${commission}`);

            if (commission > 0) {
                const referrer = await User.findById(user.referredBy);
                if (referrer) {
                    console.log(`[ORDER] Found Referrer: ${referrer.username}, Old Balance: ${referrer.commissionBalance}`);

                    // Initialize if undefined to avoid NaN
                    if (!referrer.commissionBalance) referrer.commissionBalance = 0;

                    referrer.commissionBalance += commission;
                    await referrer.save();

                    console.log(`[ORDER] Commission added. New Balance: ${referrer.commissionBalance}`);

                    await new Transaction({
                        userId: referrer._id,
                        type: 'deposit',
                        amount: commission,
                        description: `Affiliate Commission from ${user.username} buying ${product.title}`
                    }).save();
                } else {
                    console.log(`[ORDER] Referrer not found for ID: ${user.referredBy}`);
                }
            } else {
                console.log(`[ORDER] Commission is 0, skipping.`);
            }
        }

        const order = new Order({
            user: user._id,
            product: product._id,
            price: product.price,
        });
        await order.save();

        res.json({ message: 'Purchase successful', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
