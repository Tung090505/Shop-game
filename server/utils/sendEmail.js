const { Resend } = require('resend');

const sendEmail = async (email, subject, html) => {
    try {
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            throw new Error("Chưa cấu hình RESEND_API_KEY trên Render.");
        }

        const resend = new Resend(resendApiKey);

        console.log(`[Email] Đang gửi qua Resend API tới: ${email}`);

        const { data, error } = await resend.emails.send({
            from: 'ShopNickTFT <onboarding@resend.dev>',
            to: email,
            subject: subject,
            html: html,
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log(`[Email] Gửi thành công qua Resend! ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error("[Email] Lỗi gửi thư (Resend):", error.message);
        throw error;
    }
};

module.exports = sendEmail;
