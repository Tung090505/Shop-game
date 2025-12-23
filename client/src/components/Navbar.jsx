import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-primary/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition duration-300">
                            <span className="text-white font-black text-xl italic">S</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            SHOP<span className="text-accent">NICK</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-bold text-gray-300 hover:text-accent transition uppercase tracking-wider">Trang Chủ</Link>
                        <Link to="/topup" className="text-sm font-bold text-gray-300 hover:text-accent transition uppercase tracking-wider">Nạp Tiền</Link>
                        <Link to="/affiliate" className="text-sm font-bold text-gray-300 hover:text-accent transition uppercase tracking-wider">Cộng tác viên</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-black border border-accent/20 hover:bg-accent hover:text-white transition uppercase italic">Admin</Link>
                        )}
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Balance</span>
                                    <span className="text-white font-black italic">{user.balance?.toLocaleString('vi-VN')}đ</span>
                                </div>

                                <div className="relative group">
                                    <button className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 pr-4 rounded-2xl transition duration-300">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <span className="text-white text-xs font-bold">{user.username.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <div className="text-xs font-black text-white leading-none uppercase tracking-tighter">{user.username}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">Gamer Rank</div>
                                        </div>
                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>

                                    <div className="absolute right-0 mt-2 w-56 py-3 bg-[#1e293b] border border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                                        <div className="px-4 py-2 border-b border-white/5 mb-2">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Menu</div>
                                        </div>
                                        <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition font-bold">
                                            <span className="mr-3">👤</span> Profile
                                        </Link>
                                        <Link to="/transactions" className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition font-bold">
                                            <span className="mr-3">🕒</span> Transactions
                                        </Link>
                                        <Link to="/topup" className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition font-bold">
                                            <span className="mr-3">💰</span> Top-up Wallet
                                        </Link>
                                        <div className="pt-2 mt-2 border-t border-white/5">
                                            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition font-bold">
                                                <span className="mr-3">🚪</span> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-bold text-white hover:text-accent transition uppercase">Đăng Nhập</Link>
                                <Link to="/register" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-black text-sm transition shadow-lg shadow-accent/20 uppercase italic">Đăng Ký</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-secondary border-t border-white/5 p-4 space-y-4 animate-slide-down">
                    <Link to="/" className="block text-white font-bold py-2">Trang Chủ</Link>
                    <Link to="/topup" className="block text-white font-bold py-2">Nạp Tiền</Link>
                    <Link to="/affiliate" className="block text-white font-bold py-2">Cộng tác viên</Link>
                    {!user ? (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Link to="/login" className="text-center py-3 border border-white/10 rounded-xl text-white font-bold">Đăng Nhập</Link>
                            <Link to="/register" className="text-center py-3 bg-accent rounded-xl text-white font-bold">Đăng Ký</Link>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Số dư:</span>
                                <span className="text-accent font-black">{user.balance?.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <Link to="/profile" className="block text-white font-bold py-2">Trang cá nhân</Link>
                            <button onClick={handleLogout} className="block text-gaming-red font-bold py-2">Đăng xuất</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
