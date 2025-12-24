import React from 'react';
import SEO from '../components/SEO';

const Warranty = () => {
    return (
        <div className="min-h-screen bg-primary py-24 pb-40">
            <SEO title="Chính sách bảo hành | ShopNickTFT" />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                        CHÍNH SÁCH <span className="text-accent">BẢO HÀNH</span>
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
                </div>

                <div className="bg-secondary/30 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] border border-white/5 space-y-12 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">01</span>
                            Thời gian bảo hành
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Mọi tài khoản mua tại ShopNickTFT đều được hưởng chính sách bảo hành **Vĩnh Viễn** đối với các trường hợp: Tài khoản bị sai mật khẩu ngay sau khi mua, tài khoản bị tranh chấp từ chủ cũ (nếu có).
                        </p>Section
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">02</span>
                            Điều kiện từ chối bảo hành
                        </h2>
                        <ul className="list-disc list-inside space-y-4 font-medium">
                            <li>Người mua tự ý thay đổi thông tin nhưng làm mất tài khoản.</li>
                            <li>Tài khoản bị khóa do sử dụng Tool/Hack sau khi mua thành công.</li>
                            <li>Tài khoản bị khóa do vi phạm các chính sách chung của nhà phát hành game.</li>
                            <li>Chia sẻ thông tin tài khoản cho bên thứ ba dẫn đến việc bị lấy mất.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">03</span>
                            Quy trình xử lý
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Khi gặp sự cố, khách hàng vui lòng liên hệ bộ phận CSKH qua Zalo hoặc Facebook kèm theo Mã đơn hàng. Chúng tôi sẽ kiểm tra và phản hồi trong vòng tối đa 24h làm việc. Nếu lỗi xác nhận từ phía shop, bạn sẽ được đổi tài khoản mới tương đương hoặc hoàn 100% tiền vào số dư website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Warranty;
