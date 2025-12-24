const axios = require('axios');

const sendEmail = async (email, subject, html) => {
    try {
        console.log(`[Email] Đang gửi thư nhờ Vercel gửi hộ tới: ${email}`);

        const response = await axios.post('https://shop-game-neon.vercel.app/api/send-email', {
            email,
            subject,
            html,
            secret: process.env.MAIL_SECRET
        }, {
            timeout: 30000 // Tăng lên 30 giây cho chắc chắn
        });

        console.log(`[Email] Vercel đã gửi mail thành công!`);
        return response.data;
    } catch (error) {
        console.error("[Email] Lỗi khi nhờ Vercel gửi:");
        let errorMessage = "Không thể kết nối tới dịch vụ email (Timeout)";

        if (error.response) {
            errorMessage = error.response.data?.message || `Lỗi từ Vercel: ${error.response.status}`;
            console.error(errorMessage);
        } else if (error.code === 'ECONNABORTED') {
            console.error("Lỗi: Quá thời gian chờ (Timeout) khi gọi tới Vercel.");
        } else {
            errorMessage = error.message;
            console.error(errorMessage);
        }

        throw new Error(errorMessage);
    }
};

module.exports = sendEmail;
