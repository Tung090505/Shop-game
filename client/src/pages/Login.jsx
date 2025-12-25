import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';


const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login'); // 'login' | 'otp'
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const { login, verifyLoginOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const verified = query.get('verified');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (step === 'login') {
                const res = await login(formData.username, formData.password);
                if (res?.requireOtp) {
                    setStep('otp');
                    setUserId(res.userId);
                    // Không navigate
                } else {
                    navigate('/');
                }
            } else {
                // Verify OTP Step
                await verifyLoginOtp(userId, otp);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                        {step === 'otp' ? 'Xác thực OTP' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-400">
                        {step === 'otp'
                            ? 'Vui lòng nhập mã OTP đã gửi về Email của bạn'
                            : 'Sign in to your account'}
                    </p>
                </div>

                {verified && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Email verified successfully! You can now log in.
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-start">
                        <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {step === 'login' ? (
                        <>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm font-medium">Username</label>
                                <input
                                    type="text"
                                    placeholder="johndoe"
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-slate-400 text-sm font-medium">Password</label>
                                    <Link to="/forgot-password" title="Quên mật khẩu" className="text-blue-500 hover:text-blue-400 text-xs font-semibold">Forgot password?</Link>
                                </div>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm font-medium">Nhập mã OTP (6 số)</label>
                            <input
                                type="text"
                                placeholder="123456"
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 text-white text-center text-2xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                required
                                autoFocus
                            />
                            <p className="text-slate-500 text-xs mt-2 text-center">Kiểm tra Email (cả mục Spam) để lấy mã.</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Processing...' : (step === 'login' ? 'Sign In' : 'Xác thực OTP')}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-400 font-semibold ml-1">Create one</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
