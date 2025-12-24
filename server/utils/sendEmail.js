const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        console.log(`[Email] Đang kiểm tra kết nối...`);
        await transporter.verify();
        console.log(`[Email] Đang gửi thư tới: ${email}`);

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
