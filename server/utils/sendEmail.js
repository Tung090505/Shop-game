const axios = require('axios');

const sendEmail = async (email, subject, html) => {
    try {
        console.log(`[Email] Đang gửi thư nhờ Vercel gửi hộ tới: ${email}`);

        // Dùng mã bí mật từ biến môi trường
        const mailSecret = process.env.MAIL_SECRET;
        const frontendUrl = process.env.FRONTEND_URL || 'https://shop-game-neon.vercel.app';

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
        // Enhanced Logging
        console.error("[Email] Lỗi khi gửi qua Vercel:");
        if (error.response) {
            console.error(`[Email] Status: ${error.response.status}`);
            console.error(`[Email] Data:`, JSON.stringify(error.response.data));
        } else {
            console.error(`[Email] Message: ${error.message}`);
        }

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
