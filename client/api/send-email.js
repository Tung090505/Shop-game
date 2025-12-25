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

    console.log(`[Vercel Email] Attempting to send to ${email}`);
    console.log(`[Vercel Email] SMTP_USER present: ${!!process.env.SMTP_USER}`);
    console.log(`[Vercel Email] SMTP_PASS length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0}`);

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.SMTP_USER,
                // SECURITY: Always load from Environment Variables
                pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '',
            },
        });

        await transporter.sendMail({
            from: `"Shop Game" <tungark1@gmail.com>`,
            to: email,
            subject: subject,
            html: html,
        });

        return res.status(200).json({ message: 'Email đã được gửi thành công qua Vercel!' });
    } catch (error) {
        console.error('Vercel Email Error:', error);
        // Debug: Show which user tried to login
        const usingUser = process.env.SMTP_USER || "Unknown";
        return res.status(500).json({ message: `Lỗi đăng nhập (${usingUser}): ${error.message}` });
    }
}
