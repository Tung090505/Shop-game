import React, { useState, useEffect } from 'react';
import { fetchProducts, adminFetchAllOrders, adminFetchAllUsers, adminFetchAllDeposits, fetchPrizes, fetchCategories } from '../api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, deposits: 0, prizes: 0, categories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [prodRes, orderRes, userRes, depositRes, prizesRes, catRes] = await Promise.all([
                    fetchProducts(),
                    adminFetchAllOrders(),
                    adminFetchAllUsers(),
                    adminFetchAllDeposits(),
                    fetchPrizes(),
                    fetchCategories()
                ]);

                setStats({
                    products: prodRes.data.length,
                    orders: orderRes.data.length,
                    users: userRes.data.length,
                    deposits: depositRes.data.filter(d => d.status === 'pending').length,
                    prizes: prizesRes.data.length,
                    categories: catRes.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // ... (rest of loading state)

    // Modification inside main grid
    // ... stats mapping ...
    //   { label: 'Yêu cầu nạp chờ duyệt', value: stats.deposits, to: '/admin/deposits', color: 'border-yellow-500/10 hover:border-yellow-500/40', text: 'text-yellow-500', icon: '💰' },
    //   { label: 'Thư mục game', value: stats.categories, to: '/admin/categories', color: 'border-purple-500/10 hover:border-purple-500/40', text: 'text-purple-500', icon: '📁' }

    // Modification inside center boxes

    return (
        <div className="container mx-auto px-4 py-12 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 px-4">
                <div>
                    <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter">
                        Admin <span className="text-accent">Console</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Hệ thống đang hoạt động ổn định</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link to="/" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest text-slate-500 hover:text-white flex items-center">
                        <span className="mr-2">🏠</span> Về trang chủ
                    </Link>
                </div>
            </div>

            {/* Main Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16 px-4">
                {[
                    { label: 'Sản phẩm', value: stats.products, to: '/admin/products', color: 'border-accent/10 hover:border-accent/40', text: 'text-accent', icon: '📦' },
                    { label: 'Đơn hàng', value: stats.orders, to: '/admin/orders', color: 'border-blue-500/10 hover:border-blue-500/40', text: 'text-blue-500', icon: '📜' },
                    { label: 'User', value: stats.users, to: '/admin/users', color: 'border-green-500/10 hover:border-green-500/40', text: 'text-green-500', icon: '👥' },
                    { label: 'Nạp tiền', value: stats.deposits, to: '/admin/deposits', color: 'border-yellow-500/10 hover:border-yellow-500/40', text: 'text-yellow-500', icon: '💰' },
                    { label: 'Thư mục', value: stats.categories, to: '/admin/categories', color: 'border-purple-500/10 hover:border-purple-500/40', text: 'text-purple-500', icon: '📁' }
                ].map((s) => (
                    <Link key={s.label} to={s.to} className={`bg-secondary/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-700 group relative overflow-hidden ${s.color}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-3xl">{s.icon}</span>
                            <span className="text-slate-600 font-black uppercase text-[8px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">GO &rarr;</span>
                        </div>
                        <div className={`text-5xl font-black text-white mb-2 italic tracking-tighter group-hover:${s.text} transition-colors duration-500`}>{s.value}</div>
                        <div className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">{s.label}</div>
                    </Link>
                ))}
            </div>

            {/* Management Sections */}
            <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] mb-12 flex items-center justify-center gap-6">
                <div className="h-px w-24 bg-slate-800"></div>
                Trung tâm điều hành
                <div className="h-px w-24 bg-slate-800"></div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {/* Category Management */}
                <Link to="/admin/categories" className="bg-secondary/30 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-[2rem] flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform duration-500">📁</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Thư mục Game</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Tạo & quản lý các dòng game <br /> như Liên Quân, Free Fire...</p>
                </Link>

                {/* Product Management */}
                <Link to="/admin/products" className="bg-secondary/30 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 hover:border-accent/30 transition-all duration-500 group flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform duration-500">🎮</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Quản lý Kho</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Đăng Acc mới, sửa thông tin và <br /> cập nhật trạng thái kho hàng.</p>
                </Link>

                {/* User/Finacial Management */}
                <Link to="/admin/users" className="bg-secondary/30 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 hover:border-green-500/30 transition-all duration-500 group flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform duration-500">🏦</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Tài chính & User</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Cộng tiền cho khách, xóa tài khoản <br /> và quản lý số dư hệ thống.</p>
                </Link>

                {/* System Settings */}
                <Link to="/admin/settings" className="bg-secondary/30 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 hover:border-pink-500/30 transition-all duration-500 group flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-pink-500/10 rounded-[2rem] flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform duration-500">⚙️</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Cấu hình Hệ thống</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Kết nối Gạch thẻ, Ngân hàng <br /> và cài đặt API Key.</p>
                </Link>

                {/* Lucky Wheel Management */}
                <Link to="/admin/prizes" className="bg-secondary/30 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 hover:border-orange-500/30 transition-all duration-500 group flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-[2rem] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500 animate-spin-slow">🎡</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Lucky Wheel</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Cài đặt tỷ lệ trúng thưởng <br /> và cấu hình quà tặng vòng quay.</p>
                </Link>
            </div>

            {/* Quick Summary Footer */}

        </div>
    );
};

export default AdminDashboard;
