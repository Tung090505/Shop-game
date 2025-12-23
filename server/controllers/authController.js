const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
    try {
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).send('Email already exists');

        const usernameExist = await User.findOne({ username: req.body.username });
        if (usernameExist) return res.status(400).send('Username already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        let referrer = null;
        if (req.body.ref) {
            referrer = await User.findOne({ referralCode: req.body.ref });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const myReferralCode = uuidv4().substring(0, 8).toUpperCase();

        // Create user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isVerified: true, // Auto-verify for testing
            verificationToken: verificationToken,
            referralCode: myReferralCode,
            referredBy: referrer ? referrer._id : undefined
        });

        const savedUser = await user.save();

        // Optional: Log the verification link to console instead of sending email
        const url = `${process.env.BASE_URL}/api/user/verify/${savedUser._id}/${verificationToken}`;
        console.log(`[DEV] Email verification link for ${savedUser.username}: ${url}`);

        /* 
        // Temporarily disabled for development convenience
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #6366f1; text-align: center;">Welcome to ShopNickTFT!</h2>
                <p>Thank you for registering. Please verify your email by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
                </div>
                <hr>
                <p style="font-size: 12px; color: #888; text-align: center;">If you did not create an account, please ignore this email.</p>
            </div>
        `;
        await sendEmail(savedUser.email, "Verify Your Email - ShopNickTFT", html);
        */

        res.send({ message: "Registration successful! You can login now." });
    } catch (err) {
        res.status(400).send(err.message || err);
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send('Username is not found');

        if (!user.isVerified) {
            return res.status(401).send('Please verify your email first');
        }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).send({
            token,
            user: {
                username: user.username,
                role: user.role,
                balance: user.balance,
                referralCode: user.referralCode,
                commissionBalance: user.commissionBalance
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        if (user.verificationToken !== req.params.token) {
            return res.status(400).send("Invalid link");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.topup = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user._id);
        user.balance += amount;
        await user.save();

        await new Transaction({
            userId: user._id,
            type: 'deposit',
            amount: amount,
            description: 'Manual wallet top-up'
        }).save();

        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.withdrawCommission = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.commissionBalance <= 0) return res.status(400).send('No commission to withdraw');

        const amount = user.commissionBalance;
        user.balance += amount;
        user.commissionBalance = 0;
        await user.save();

        await new Transaction({
            userId: user._id,
            type: 'withdraw',
            amount: amount,
            description: 'Commission withdrawal to main balance'
        }).save();

        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Access denied');
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Access denied');
        const transactions = await Transaction.find().populate('userId', 'username email').sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateUserBalance = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Access denied');
        const { amount } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        user.balance = amount;
        await user.save();

        await new Transaction({
            userId: user._id,
            type: 'deposit',
            amount: 0,
            description: `Admin updated balance to ${amount}đ`
        }).save();

        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Access denied');
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
};
