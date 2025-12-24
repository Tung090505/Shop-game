import React from 'react';
import SEO from '../components/SEO';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-primary py-24 pb-40">
            <SEO title="Chính sách bảo mật | ShopNickTFT" />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                        CHÍNH SÁCH <span className="text-accent">BẢO MẬT</span>
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
                </div>

                <div className="bg-secondary/30 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] border border-white/5 space-y-12 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">01</span>
                            Thông tin thu thập
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Chúng tôi chỉ thu thập thông tin cần thiết như tên đăng nhập, email để phục vụ việc quản lý tài khoản và hỗ trợ khách hàng. Mật khẩu của bạn được mã hóa một chiều (hashing) nên ngay cả quản trị viên cũng không thể đọc được.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">02</span>
                            Mục đích sử dụng
                        </h2>
                        <ul className="list-disc list-inside space-y-4 font-medium">
                            <li>Xác thực người dùng và thực hiện giao dịch mua bán.</li>
                            <li>Gửi thông báo về các thay đổi mật khẩu hoặc cập nhật hệ thống quan trọng.</li>
                            <li>Cải thiện chất lượng dịch vụ và bảo mật hệ thống.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">03</span>
                            Chia sẻ thông tin
                        </h2>
                        <p className="leading-relaxed font-medium">
                            ShopNickTFT cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của người dùng với bất kỳ bên thứ ba nào, trừ trường hợp có yêu cầu từ cơ quan chức năng theo quy định pháp luật.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">04</span>
                            Cookies
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Chúng tôi sử dụng cookies để duy trì trạng thái đăng nhập và ghi nhớ các tùy chọn cá nhân của bạn, giúp trải nghiệm mua sắm nhanh chóng và thuận tiện hơn.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
