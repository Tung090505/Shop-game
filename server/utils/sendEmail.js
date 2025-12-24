const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER, // Email của bạn (gmail)
                pass: process.env.SMTP_PASS, // Mật khẩu ứng dụng (16 ký tự)
            },
        });

        console.log(`[Email] Đang chuẩn bị gửi thư...`);
        console.log(`[Email] Từ: ${process.env.SMTP_USER}`);
        console.log(`[Email] Đến: ${email}`);

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
