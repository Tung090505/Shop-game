const axios = require('axios');

const sendEmail = async (email, subject, html) => {
    try {
        console.log(`[Email] Đang gửi thư nhờ Vercel gửi hộ tới: ${email}`);

        // Dùng mã bí mật mặc định nếu chưa có env
        const mailSecret = process.env.MAIL_SECRET || 'TungLoCoHot2025';

        const response = await axios.post('https://shop-game-neon.vercel.app/api/send-email', {
            email,
            subject,
            html,
            secret: mailSecret
        }, {
            timeout: 30000
        });

        console.log(`[Email] Vercel đã gửi mail thành công!`);
        return response.data;
    } catch (error) {
        console.error("[Email] Lỗi khi gửi qua Vercel:");
        let errorMessage = "Không thể kết nối dịch vụ email";

        if (error.response) {
            errorMessage = error.response.data?.message || `Lỗi Vercel: ${error.response.status}`;
        } else {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

module.exports = sendEmail;
