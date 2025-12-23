const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"ShopNickTFT" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: html,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent!");
        console.log(error);
        return error;
    }
};

module.exports = sendEmail;
