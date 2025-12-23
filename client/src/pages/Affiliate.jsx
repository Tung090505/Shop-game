import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Affiliate = () => {
    const { user, fetchProfile, loading: authLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const referralLink = user ? `${window.location.origin}/register?ref=${user.referralCode}` : 'Vui lòng đăng nhập để lấy link';

    const handleCopy = () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để sao chép link!');
            return;
        }
        navigator.clipboard.writeText(referralLink);
        toast.success('Đã sao chép link giới thiệu!');
    };

    const handleWithdraw = async () => {
        if (!user) return;
        if (!user.commissionBalance || user.commissionBalance <= 0) {
            toast.error('Bạn không có hoa hồng để rút');
            return;
        }

        setLoading(true);
        try {
            await api.withdrawCommission();
            toast.success('Đã chuyển hoa hồng vào số dư chính!');
            fetchProfile();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Rút tiền thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-primary py-24 pb-40 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-6 backdrop-blur-md">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Affiliate Program</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
                        KIẾM TIỀN <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">LIÊN KẾT</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-wider text-sm leading-relaxed">
                        Chia sẻ đam mê - Nhận ngay <span className="text-white font-black italic">5% HOA HỒNG</span> trọn đời cho mọi đơn hàng thành công.
                    </p>
                </div>

                {!user ? (
                    /* Guest View */
                    <div className="bg-secondary/40 backdrop-blur-2xl p-16 rounded-[4rem] border border-white/5 shadow-2xl text-center max-w-4xl mx-auto">
                        <div className="text-7xl mb-8 grayscale opacity-20">🤝</div>
                        <h2 className="text-3xl font-black text-white uppercase italic mb-6">Bạn chưa đăng nhập?</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-10 leading-loose">
                            Hãy đăng nhập để sở hữu Link giới thiệu cá nhân<br />và bắt đầu xây dựng hệ thống thu nhập thụ động của bạn.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/login" className="px-12 py-5 bg-accent hover:bg-accent-hover text-white rounded-3xl font-black uppercase italic tracking-widest transition-all shadow-xl shadow-accent/20 active:scale-95 w-full sm:w-auto">Đăng nhập ngay</Link>
                            <Link to="/register" className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl border border-white/10 font-black uppercase italic tracking-widest transition-all w-full sm:w-auto">Tạo tài khoản</Link>
                        </div>
                    </div>
                ) : (
                    /* User View */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Stats Card */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-secondary/60 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-all duration-700"></div>

                                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Hoa hồng tích lũy</p>
                                <div className="text-6xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-end gap-2">
                                    {user.commissionBalance?.toLocaleString('vi-VN')}
                                    <span className="text-2xl text-accent mb-2">đ</span>
                                </div>

                                <button
                                    onClick={handleWithdraw}
                                    disabled={loading || !user.commissionBalance}
                                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:grayscale text-white py-6 rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-xs transition-all shadow-xl shadow-accent/20 active:scale-95 mb-4"
                                >
                                    {loading ? 'ĐANG XỬ LÝ...' : 'RÚT VỀ SỐ DƯ CHÍNH'}
                                </button>
                                <p className="text-[10px] text-slate-600 text-center font-bold uppercase tracking-widest leading-loose">
                                    Tiền sẽ được cộng trực tiếp vào ví<br />để bạn có thể mua sắm ngay lập tức.
                                </p>
                            </div>

                            <div className="bg-[#0f172a]/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5">
                                <h3 className="text-xs font-black text-white uppercase italic tracking-[0.3em] mb-8 flex items-center gap-3">
                                    <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
                                    ƯU ĐÃI PARTNER
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        '5% Hoa hồng trọn đời',
                                        'Rút tiền không giới hạn',
                                        'Thống kê minh bạch 24/7',
                                        'Hỗ trợ tài liệu Marketing'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-[11px] text-slate-400 font-black uppercase tracking-widest">
                                            <div className="w-6 h-6 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mr-4 shadow-inner">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Link Generator */}
                        <div className="lg:col-span-8">
                            <div className="bg-secondary/40 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/5 shadow-2xl h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-10 flex items-center gap-4">
                                        LINK GIỚI THIỆU
                                        <div className="flex-grow h-[1px] bg-white/5"></div>
                                    </h2>

                                    <div className="space-y-10">
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                            <div className="relative bg-[#0f172a] border border-white/10 p-4 rounded-[2.2rem] flex flex-col md:flex-row items-center gap-4 group-focus-within:border-accent transition-all duration-500">
                                                <div className="flex-grow px-4 overflow-hidden w-full">
                                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 ml-1">Your Personal URL</p>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={referralLink}
                                                        className="bg-transparent w-full text-white font-black outline-none text-sm lg:text-lg tracking-tight truncate"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleCopy}
                                                    className="bg-accent hover:bg-accent-hover text-white px-12 py-5 rounded-[1.8rem] font-black uppercase italic tracking-widest transition-all shadow-xl shadow-accent/20 active:scale-95 shrink-0 w-full md:w-auto"
                                                >
                                                    COPY URL
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="group p-8 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all duration-500">
                                                <div className="w-14 h-14 bg-[#1a2333] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-2xl group-hover:scale-110 transition duration-500">🚀</div>
                                                <h4 className="text-white font-black uppercase italic mb-2 tracking-widest text-sm">BƯỚC 1: CHIA SẺ</h4>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-loose">Gửi link cho bạn bè hoặc đăng lên các hội nhóm Gaming trên Facebook, Tiktok.</p>
                                            </div>
                                            <div className="group p-8 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all duration-500">
                                                <div className="w-14 h-14 bg-[#1a2333] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-2xl group-hover:scale-110 transition duration-500">💰</div>
                                                <h4 className="text-white font-black uppercase italic mb-2 tracking-widest text-sm">BƯỚC 2: NHẬN TIỀN</h4>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-loose">Khi người bạn giới thiệu mua tài khoản thành công, hoa hồng tự động nhảy vào ví bạn.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Affiliate;
