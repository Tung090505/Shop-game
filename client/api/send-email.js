const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, subject, html, secret } = req.body;

    // Bảo mật: Chỉ cho phép server của bạn được gọi API này
    if (secret !== process.env.MAIL_SECRET) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
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

        return res.status(200).json({ message: 'Email sent successfully via Vercel' });
    } catch (error) {
        console.error('Vercel Email Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
