const axios = require('axios');

const sendEmail = async (email, subject, html) => {
    try {
        console.log(`[Email] Đang gửi thư nhờ Vercel gửi hộ tới: ${email}`);

        // Gọi tới API chúng ta vừa tạo trên Vercel
        const response = await axios.post('https://shop-game-neon.vercel.app/api/send-email', {
            email,
            subject,
            html,
            secret: process.env.MAIL_SECRET // Mã bảo mật để không ai phá được
        }, {
            timeout: 15000
        });

        console.log(`[Email] Vercel đã gửi mail thành công!`);
        return response.data;
    } catch (error) {
        console.error("[Email] Lỗi khi nhờ Vercel gửi (có thể do thiếu env hoặc URL sai):");
        console.error(error.response?.data?.message || error.message);
        throw error;
    }
};

module.exports = sendEmail;
