const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Cho phép gọi từ bất cứ đâu (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, subject, html, secret } = req.body;

    // Kiểm tra mã bảo mật
    if (secret !== process.env.MAIL_SECRET) {
        return res.status(403).json({ message: 'Mã bảo thực không khớp' });
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

        return res.status(200).json({ message: 'Gửi mail thành công qua Vercel!' });
    } catch (error) {
        console.error('Vercel Email Error:', error);
        return res.status(500).json({ message: error.message });
    }
};
