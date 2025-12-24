import React, { useState } from 'react';
import { forgotPassword } from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await forgotPassword(email);
            toast.success(res.data || 'Link đặt lại mật khẩu đã được gửi!');
        } catch (err) {
            toast.error(err.response?.data || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative bg-secondary/40 backdrop-blur-2xl p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-2xl">🔑</div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Quên mật khẩu?</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-loose">
                        Nhập email của bạn để nhận link đặt lại mật khẩu.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent transition-all duration-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-white font-black py-5 rounded-2xl shadow-xl shadow-accent/20 transition-all duration-300 uppercase italic tracking-[0.2em] text-xs disabled:opacity-50"
                    >
                        {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Nhớ ra mật khẩu? <Link to="/login" className="text-accent hover:underline ml-2">Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
