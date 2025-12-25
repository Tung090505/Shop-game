import React, { useState, useEffect } from 'react';
import { adminFetchAllUsers, adminUpdateUserBalance, adminDeleteUser } from '../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newBalance, setNewBalance] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsers = async () => {
        try {
            const res = await adminFetchAllUsers();
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Không thể tải danh sách thành viên');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleEditBalance = (user) => {
        setEditingUser(user);
        setNewBalance(user.balance);
        setShowEditModal(true);
    };

    const handleUpdateBalance = async (e) => {
        e.preventDefault();
        try {
            await adminUpdateUserBalance(editingUser._id, newBalance);
            toast.success('Đã cập nhật số dư thành công');
            setShowEditModal(false);
            loadUsers();
        } catch (err) {
            toast.error('Cập nhật thất bại');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.')) {
            try {
                await adminDeleteUser(id);
                toast.success('Đã xóa thành viên');
                loadUsers();
            } catch (err) {
                toast.error('Không thể xóa thành viên');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        return (
            user.username?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.role?.toLowerCase().includes(term) ||
            user.balance?.toString().includes(term)
        );
    });

    return (
        <div className="container mx-auto px-4 py-12 pb-32">
            <div className="mb-12">
                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                    Quản lý <span className="text-green-500">Thành viên</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Phân quyền và quản lý tài chính người dùng</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thành viên (Username, Email, Số dư...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#121927] border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
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
                                <th className="px-10 py-8">Người dùng</th>
                                <th className="px-10 py-8">Ngày tham gia</th>
                                <th className="px-10 py-8">Vai trò</th>
                                <th className="px-10 py-8 text-right">Số dư ví</th>
                                <th className="px-10 py-8 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-medium">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center text-white font-black border border-white/5 uppercase text-xl italic shadow-inner">
                                                {u.username.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-white font-black uppercase text-base tracking-tight group-hover:text-green-500 transition-colors leading-none mb-1.5">{u.username}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-slate-500 text-xs font-black uppercase tracking-widest">
                                        {format(new Date(u.createdAt), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-[0.2em] border ${u.role === 'admin' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                            }`}>
                                            {u.role === 'admin' ? '🛡️ Quản trị' : '👤 Thành viên'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="text-white font-black text-xl italic tracking-tighter">{u.balance.toLocaleString('vi-VN')}đ</div>
                                        <div className="text-[10px] text-accent/50 group-hover:text-accent font-black uppercase tracking-widest transition-colors mt-1">{u.commissionBalance?.toLocaleString('vi-VN')}đ Hoa Hồng</div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={() => handleEditBalance(u)}
                                                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all duration-300 border border-white/5 shadow-lg"
                                                title="Sửa số dư"
                                            >
                                                💰
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/5 shadow-lg"
                                                title="Xóa User"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="py-32 text-center text-slate-500 font-black uppercase tracking-[0.3em] italic text-xs">
                        Hệ thống hiện chưa có thành viên nào
                    </div>
                )}
            </div>

            {/* Edit Balance Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-primary/90 backdrop-blur-xl z-[110] flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] w-full max-w-lg rounded-[3.5rem] border border-white/10 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-white/5 text-center">
                            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">💵</div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Cập nhật số dư</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 italic px-8">Thay đổi trực tiếp quỹ tiền của <span className="text-white">{editingUser?.username}</span></p>
                        </div>
                        <form onSubmit={handleUpdateBalance} className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Số dư mới (đ)</label>
                                <input
                                    type="number"
                                    value={newBalance}
                                    onChange={(e) => setNewBalance(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-accent font-black text-3xl outline-none focus:border-accent transition text-center shadow-inner"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-accent/30 transition-all duration-300 uppercase italic tracking-widest">
                                    XÁC NHẬN CẬP NHẬT
                                </button>
                                <button type="button" onClick={() => setShowEditModal(false)} className="w-full bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white font-black py-4 rounded-2xl transition-all uppercase italic tracking-widest text-[10px]">
                                    HỦY BỎ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
