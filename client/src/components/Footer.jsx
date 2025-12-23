import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition duration-300">
                                <span className="text-white font-black text-xl italic">S</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                SHOP<span className="text-accent">NICK</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Hệ thống cung cấp tài khoản game uy tín, giá rẻ và bảo mật hàng đầu Việt Nam. Giao dịch tự động 24/7.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            {['FB', 'YT', 'TK', 'DC'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent transition duration-300 font-black text-xs">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-black uppercase italic tracking-widest mb-6">Dịch vụ</h4>
                        <ul className="space-y-4">
                            <li><Link to="/shop" className="text-gray-500 hover:text-accent transition text-sm font-bold">Mua tài khoản</Link></li>
                            <li><Link to="/topup" className="text-gray-500 hover:text-accent transition text-sm font-bold">Nạp tiền</Link></li>
                            <li><Link to="/" className="text-gray-500 hover:text-accent transition text-sm font-bold">Vòng quay may mắn</Link></li>
                            <li><Link to="/shop" className="text-gray-500 hover:text-accent transition text-sm font-bold">Flash Sale</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase italic tracking-widest mb-6">Chính sách</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-accent transition text-sm font-bold">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-accent transition text-sm font-bold">Chính sách bảo mật</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-accent transition text-sm font-bold">Chính sách bảo hành</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-accent transition text-sm font-bold">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-black uppercase italic tracking-widest mb-6">Liên hệ</h4>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-accent">📞</span>
                                <span className="text-gray-500 text-sm font-bold">Hotline: 1900 1234</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-accent">📧</span>
                                <span className="text-gray-500 text-sm font-bold">Email: support@shopnick.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-accent">📍</span>
                                <span className="text-gray-500 text-sm font-bold">Hà Nội, Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                        © 2025 SHOPNICK. ALL RIGHTS RESERVED. DESIGNED FOR GAMERS.
                    </p>
                    <div className="flex items-center space-x-6">
                        <img src="https://dummyimage.com/120x40/000/fff&text=VISA" className="h-6 opacity-20 grayscale" alt="" />
                        <img src="https://dummyimage.com/120x40/000/fff&text=MASTERCARD" className="h-6 opacity-20 grayscale" alt="" />
                        <img src="https://dummyimage.com/120x40/000/fff&text=MOMO" className="h-6 opacity-20 grayscale" alt="" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
