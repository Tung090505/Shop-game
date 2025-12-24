import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
    return (
        <div className="min-h-screen bg-primary py-24 pb-40">
            <SEO title="Điều khoản dịch vụ | ShopNickTFT" />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                        ĐIỀU KHOẢN <span className="text-accent">DỊCH VỤ</span>
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
                </div>

                <div className="bg-secondary/30 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] border border-white/5 space-y-12 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">01</span>
                            Chấp thuận điều khoản
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Bằng cách truy cập và sử dụng website ShopNickTFT, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">02</span>
                            Tài khoản người dùng
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Khi tạo tài khoản, bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. Mọi hoạt động xảy ra dưới tài khoản của bạn sẽ thuộc trách nhiệm pháp lý của cá nhân bạn. ShopNickTFT có quyền từ chối dịch vụ hoặc xóa tài khoản nếu phát hiện hành vi vi phạm.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">03</span>
                            Giao dịch và Thanh toán
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Tất cả các giao dịch trên hệ thống là tự động và không thể hoàn trả sau khi thông tin tài khoản đã được hiển thị. Bạn cần kiểm tra kỹ số dư và thông tin sản phẩm trước khi xác nhận mua hàng. Các hành vi gian lận trong nạp tiền sẽ bị khóa tài khoản vĩnh viễn.
                        </p>Section
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                            <span className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent text-sm not-italic">04</span>
                            Bản quyền và Nội dung
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Mọi nội dung, hình ảnh và mã nguồn trên website thuộc sở hữu của ShopNickTFT. Nghiêm cấm mọi hành vi sao chép, sử dụng trái phép khi chưa có sự đồng ý bằng văn bản từ chúng tôi.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
