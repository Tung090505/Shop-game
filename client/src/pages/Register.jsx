import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await register(formData.username, formData.email, formData.password);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md text-center transform transition-all duration-500 scale-100 animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Check Your Email</h2>
                    <p className="text-slate-400 mb-8">We've sent a verification link to <span className="text-blue-400">{formData.email}</span>. Please verify your account to continue.</p>
                    <a href="/login" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Join Us</h2>
                    <p className="text-slate-400">Create an account to start trading</p>
                </div>

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
                        <label className="block text-slate-400 mb-2 text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm font-medium">Password</label>
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
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-400 font-semibold ml-1">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
