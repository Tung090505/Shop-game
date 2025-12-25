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

        // SECURITY: 2FA cho Admin
        if (user.role === 'admin') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.loginOtp = otp;
            user.loginOtpExpires = Date.now() + 5 * 60 * 1000; // 5 phút
            await user.save();

            // Gửi OTP qua Email
            const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>BẢO MẬT ĐĂNG NHẬP (2FA)</h2>
                    <p>Mã xác thực đăng nhập Admin của bạn là:</p>
                    <h1 style="color:red; letter-spacing: 5px;">${otp}</h1>
                    <p>Mã này hết hạn sau 5 phút. Không chia sẻ cho bất kỳ ai!</p>
                </div>
            `;
            await sendEmail(user.email, "Admin Login OTP - Shop Game", html);

            return res.json({
                requireOtp: true,
                userId: user._id,
                message: 'Vui lòng nhập mã OTP đã gửi về email'
            });
        }

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
        res.status(400).send(err.message);
    }
};

exports.verifyLoginOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(400).send('User not found');

        if (!user.loginOtp || user.loginOtp !== otp) {
            return res.status(400).send('Mã OTP không chính xác');
        }

        if (user.loginOtpExpires < Date.now()) {
            return res.status(400).send('Mã OTP đã hết hạn');
        }

        // OTP OK -> Clear OTP & Issue Token
        user.loginOtp = undefined;
        user.loginOtpExpires = undefined;
        await user.save();

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
        res.status(500).send(err.message);
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

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const validPass = await bcrypt.compare(currentPassword, user.password);
        if (!validPass) return res.status(400).send('Mật khẩu hiện tại không chính xác');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('Email không tồn tại trong hệ thống');

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'https://shop-game-neon.vercel.app';
        const resetUrl = `${frontendUrl}/reset-password/${token}`;

        console.log(`[DEV] Password reset link for ${user.username}: ${resetUrl}`);

        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #0f172a; color: white; border-radius: 20px;">
                <h2 style="color: #6366f1; text-align: center; font-size: 28px; font-style: italic; font-weight: 900;">RESET PASSWORD</h2>
                <p style="text-align: center; color: #94a3b8; font-size: 16px;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản ${user.username}.</p>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">ĐẶT LẠI MẬT KHẨU</a>
                </div>
                <p style="text-align: center; color: #64748b; font-size: 12px;">Link này sẽ hết hạn trong vòng 1 giờ.</p>
                <hr style="border: none; border-top: 1px solid #1e293b; margin: 30px 0;">
                <p style="font-size: 11px; color: #475569; text-align: center;">Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
            </div>
        `;

        try {
            await sendEmail(user.email, "Đặt lại mật khẩu - ShopNickTFT", html);
            res.send("Link đặt lại mật khẩu đã được gửi vào Email của bạn.");
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(500).send(`Lỗi gửi mail: ${emailError.message}`);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send("Mật khẩu đã được cập nhật thành công!");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

