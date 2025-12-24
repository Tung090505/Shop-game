const { Resend } = require('resend');

const sendEmail = async (email, subject, html) => {
    try {
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            throw new Error("Thiếu RESEND_API_KEY trên Render. Hãy lấy key từ resend.com");
        }

        const resend = new Resend(resendApiKey);

        console.log(`[Email] Đang gửi thư qua API Resend tới: ${email}`);

        const { data, error } = await resend.emails.send({
            from: 'ShopNickTFT <onboarding@resend.dev>',
            to: email, // Lưu ý: Free tier chỉ gửi được cho chính email đăng ký Resend hoặc email đã verify
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("[Email] Lỗi Resend:", error);
            throw new Error(error.message);
        }

        console.log(`[Email] Gửi thành công! ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error("[Email] Lỗi gửi thư:");
        console.error(error.message);
        throw error;
    }
};

module.exports = sendEmail;
