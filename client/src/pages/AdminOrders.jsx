import React, { useState, useEffect } from 'react';
import { adminFetchAllOrders } from '../api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadOrders = async () => {
        try {
            const res = await adminFetchAllOrders();
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Không thể tải lịch sử giao dịch');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) return <div className="text-center py-20 text-white font-bold animate-pulse">ĐANG TẢI DỮ LIỆU...</div>;

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order._id?.toLowerCase().includes(term) ||
            order.user?.username?.toLowerCase().includes(term) ||
            order.user?.email?.toLowerCase().includes(term) ||
            order.product?.title?.toLowerCase().includes(term) ||
            order.price?.toString().includes(term)
        );
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                    Lịch sử <span className="text-blue-500">Giao dịch</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Theo dõi mọi đơn hàng đã bán ra</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng (Mã, User, Sản phẩm...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#121927] border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-6">Mã đơn</th>
                                <th className="px-8 py-6">Khách hàng</th>
                                <th className="px-8 py-6">Sản phẩm</th>
                                <th className="px-8 py-6">Giá trị</th>
                                <th className="px-8 py-6">Ngày mua</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-medium">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/[0.02] transition">
                                    <td className="px-8 py-6 font-mono text-xs text-slate-500">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black uppercase text-sm">{order.user?.username || 'Ẩn danh'}</span>
                                            <span className="text-[10px] text-slate-500 mt-0.5">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">🛒</div>
                                            <span className="text-slate-200 font-bold">{order.product?.title || 'Sản phẩm đã bị xóa'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-accent font-black text-base italic">{order.price.toLocaleString('vi-VN')}đ</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-400 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="text-[10px] text-slate-600 mt-0.5 font-bold uppercase">
                                            {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="text-5xl mb-4 opacity-10">📉</div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">Chưa có giao dịch nào phát sinh</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
