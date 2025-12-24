const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("Thiếu cấu hình SMTP_USER hoặc SMTP_PASS trên server.");
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Dùng SSL/TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 15000,
        });

        console.log(`[Email] Thử kết nối SMTP qua cổng 465...`);
        console.log(`[Email] Gửi tới: ${email}`);

        const info = await transporter.sendMail({
            from: `"ShopNickTFT" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: html,
        });


        console.log(`[Email] Thư đã được gửi tới: ${email}. ID: ${info.messageId}`);
    } catch (error) {
        console.error("[Email] Lỗi gửi thư:");
        console.error(error.message);
        throw error;
    }
};


module.exports = sendEmail;
