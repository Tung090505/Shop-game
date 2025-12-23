import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const verified = query.get('verified');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to your account</p>
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
                            <a href="#" className="text-blue-500 hover:text-blue-400 text-xs font-semibold">Forgot password?</a>
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

                    <div className="pt-2">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                            Sign In
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
