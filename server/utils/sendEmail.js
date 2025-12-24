const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
    try {
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

        if (!smtpUser || !smtpPass) {
            throw new Error("Thiếu cấu hình SMTP_USER hoặc SMTP_PASS trên server.");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            // Thêm các cài đặt để cố gắng vượt qua giới hạn timeout của hosting
            connectionTimeout: 45000,
            greetingTimeout: 45000,
            socketTimeout: 45000,
        });

        console.log(`[Email] Đang gửi thư từ: ${smtpUser} tới: ${email}`);

        const info = await transporter.sendMail({
            from: `"ShopNickTFT" <${smtpUser}>`,
            to: email,
            subject: subject,
            html: html,
        });

        console.log(`[Email] Thư đã được gửi thành công. ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("[Email] Lỗi chi tiết:");
        console.error(error.message);
        throw error;
    }
};

module.exports = sendEmail;
