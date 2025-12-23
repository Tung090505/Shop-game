import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#020617] pt-24 pb-12 relative overflow-hidden border-t border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-[150px] translate-y-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/20 group-hover:rotate-12 transition-all duration-500">
                                    <span className="text-white font-black text-2xl italic tracking-tighter">S</span>
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                    SHOP<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">NICK</span>
                                </span>
                            </Link>
                            <p className="text-slate-400 text-sm leading-loose font-bold uppercase tracking-wider max-w-sm">
                                Hệ thống cung cấp tài khoản game <span className="text-white font-black italic">UY TÍN</span>, <span className="text-white font-black italic">GIÁ RẺ</span> và <span className="text-white font-black italic">BẢO MẬT</span> hàng đầu Việt Nam. Giao dịch tự động 24/7.
                            </p>
                        </div>


                    </div>

                    {/* Quick Links Group */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h4 className="text-white font-black uppercase italic tracking-[0.2em] text-xs flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-accent rounded-full"></div>
                                Dịch vụ
                            </h4>
                            <ul className="space-y-4">
                                <li><Link to="/shop" className="text-slate-500 hover:text-accent transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span> Mua tài khoản</Link></li>
                                <li><Link to="/topup" className="text-slate-500 hover:text-accent transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span> Nạp tiền tự động</Link></li>
                                <li><Link to="/" className="text-slate-500 hover:text-accent transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span> Vòng quay may mắn</Link></li>
                                <li><Link to="/shop" className="text-slate-500 hover:text-accent transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent transition-all duration-300"></span> Flash Sale</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-white font-black uppercase italic tracking-[0.2em] text-xs flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-accent-secondary rounded-full"></div>
                                Chính sách
                            </h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-500 hover:text-accent-secondary transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent-secondary transition-all duration-300"></span> Điều khoản dịch vụ</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-accent-secondary transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent-secondary transition-all duration-300"></span> Chính sách bảo mật</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-accent-secondary transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent-secondary transition-all duration-300"></span> Bảo hành tài khoản</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-accent-secondary transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-accent-secondary transition-all duration-300"></span> Câu hỏi (FAQ)</a></li>
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-8">
                            <h4 className="text-white font-black uppercase italic tracking-[0.2em] text-xs flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-gaming-gold rounded-full"></div>
                                Liên hệ
                            </h4>
                            <div className="space-y-6">
                                <div className="group">
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Hotline CSKH</p>
                                    <p className="text-white font-black text-sm italic tracking-widest group-hover:text-gaming-gold transition-colors duration-300 cursor-pointer">0399.986.955</p>
                                </div>
                                <div className="group">
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Hỗ trợ Email</p>
                                    <p className="text-white font-black text-sm italic tracking-widest group-hover:text-gaming-gold transition-colors duration-300 cursor-pointer text-xs">tungark1@gmail.com</p>
                                </div>
                                <div className="group">
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Trụ sở chính</p>
                                    <p className="text-white font-black text-xs italic tracking-widest group-hover:text-gaming-gold transition-colors duration-300">Bình Dương, Việt Nam</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
                            © 2025 SHOPNICK. ALL RIGHTS RESERVED.
                        </p>
                        <p className="text-slate-800 text-[8px] font-black uppercase tracking-widest">
                            Hệ thống vận hành bởi GAMER • Thiết kế tối ưu cho trải nghiệm người dùng.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-help">
                        {['VISA', 'MASTERCARD', 'MOMO', 'NAPAS'].map(method => (
                            <span key={method} className="text-[9px] font-black text-slate-400 italic tracking-tighter uppercase">{method}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
