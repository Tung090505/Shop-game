import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const Affiliate = () => {
    const { user, fetchProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Đã sao chép link giới thiệu!');
    };

    const handleWithdraw = async () => {
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                    Tiếp thị <span className="text-indigo-500">Liên kết</span>
                </h1>
                <p className="text-slate-400 max-w-2xl font-medium">Chia sẻ liên kết của bạn và nhận ngay <span className="text-white font-bold">5% hoa hồng</span> cho mỗi đơn hàng mà người bạn giới thiệu mua thành công.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <span className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">Hoa hồng hiện có</span>
                        <div className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">{user?.commissionBalance?.toLocaleString('vi-VN')}đ</div>
                        <button
                            onClick={handleWithdraw}
                            disabled={loading || !user?.commissionBalance}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            {loading ? 'ĐANG XỬ LÝ...' : 'RÚT VỀ SỐ DƯ CHÍNH'}
                        </button>
                    </div>

                    <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-white/5">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Lợi ích Affiliate</h3>
                        <ul className="space-y-4">
                            {[
                                'Nhận 5% hoa hồng vĩnh viễn',
                                'Rút tiền không giới hạn',
                                'Hệ thống tracking tự động',
                                'Hỗ trợ banner marketing'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center text-sm text-slate-400 font-medium">
                                    <span className="w-5 h-5 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mr-3 text-[10px]">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Referral Link Area */}
                <div className="lg:col-span-2">
                    <div className="bg-secondary/30 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl h-full flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-white uppercase italic mb-8">Link Giới Thiệu Của Bạn</h2>

                        <div className="space-y-6">
                            <div className="bg-[#0f172a] border border-white/10 p-2 rounded-2xl flex items-center gap-2 group focus-within:border-indigo-500 transition-colors">
                                <input
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    className="bg-transparent flex-grow px-4 py-3 text-white font-bold outline-none text-sm lg:text-base"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black uppercase italic tracking-widest transition shadow-lg shadow-indigo-500/20 active:scale-95 shrink-0"
                                >
                                    COPY
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                                    <div className="text-3xl mb-2">🚀</div>
                                    <h4 className="text-white font-black uppercase italic mb-1">Bước 1</h4>
                                    <p className="text-slate-500 text-xs font-medium">Copy link giới thiệu cá nhân và chia sẻ cho bạn bè hoặc trên MXH.</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                                    <div className="text-3xl mb-2">💸</div>
                                    <h4 className="text-white font-black uppercase italic mb-1">Bước 2</h4>
                                    <p className="text-slate-500 text-xs font-medium">Khi họ mua tài khoản, bạn nhận ngay 5% hoa hồng vào ví Affiliate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Affiliate;
