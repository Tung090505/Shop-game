import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, subject, html, secret } = req.body;

    // Bảo mật: Kiểm tra mã bí mật
    if (!secret || secret !== process.env.MAIL_SECRET) {
        return res.status(403).json({ message: 'Truy cập bị từ chối: Mã bảo mật không hợp lệ' });
    }

    // Kiểm tra cấu hình Gmail
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ message: 'Lỗi cấu hình: Thiếu SMTP_USER hoặc SMTP_PASS trên Vercel' });
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

        return res.status(200).json({ message: 'Email đã được gửi thành công qua Vercel!' });
    } catch (error) {
        console.error('Vercel Email Error:', error);
        return res.status(500).json({ message: `Lỗi gửi mail từ Vercel: ${error.message}` });
    }
}
