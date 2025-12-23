import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchMyOrders, fetchMyDeposits, changePassword } from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);

    // Change Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, depositsRes] = await Promise.all([
                    fetchMyOrders(),
                    fetchMyDeposits()
                ]);
                setOrders(ordersRes.data);
                setDeposits(depositsRes.data);
            } catch (err) {
                toast.error('Không thể tải dữ liệu cá nhân');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã copy ${label}`);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error('Mật khẩu mới không khớp');
        if (passwords.new.length < 6) return toast.error('Mật khẩu phải từ 6 ký tự');

        setUpdating(true);
        try {
            await changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            toast.success('Đổi mật khẩu thành công');
            setShowPasswordModal(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            toast.error(err.response?.data || 'Đổi mật khẩu thất bại');
        } finally {
            setUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-primary py-20 pb-32">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Profile - Ultra Premium */}
                <div className="bg-secondary/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-accent/10 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent via-blue-500 to-purple-600 p-1 shadow-2xl shadow-accent/20 animate-spin-slow">
                                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-5xl md:text-6xl border-4 border-white/5">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0f172a] shadow-lg"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">{user.username}</h1>
                                <span className="bg-accent/10 text-accent text-[10px] font-black px-4 py-1.5 rounded-full border border-accent/20 uppercase tracking-widest italic h-fit w-fit mx-auto md:mx-0">
                                    {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                </span>
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mb-8">{user.email}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-3xl backdrop-blur-md">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 text-center md:text-left">Số dư khả dụng</p>
                                    <p className="text-accent font-black text-3xl italic tracking-tighter">{user.balance?.toLocaleString('vi-VN')}đ</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-3xl backdrop-blur-md">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 text-center md:text-left">Hoa hồng tích lũy</p>
                                    <p className="text-green-500 font-black text-3xl italic tracking-tighter">{user.commissionBalance?.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="bg-white/5 hover:bg-white/10 text-white font-black px-8 py-4 rounded-2xl border border-white/5 transition-all uppercase italic tracking-widest text-xs"
                            >
                                Đổi Mật Khẩu
                            </button>
                            <button
                                onClick={() => navigate('/transactions')}
                                className="bg-accent hover:bg-accent-hover text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-accent/20 transition-all uppercase italic tracking-widest text-xs"
                            >
                                Lịch sử giao dịch
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs - Modern Minimalist */}
                <div className="flex justify-center md:justify-start space-x-2 mb-10 bg-secondary/30 p-2 rounded-3xl w-fit border border-white/5 backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-8 py-4 rounded-2xl font-black text-xs uppercase italic tracking-[0.15em] transition-all duration-500 ${activeTab === 'orders' ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Tài khoản đã mua
                    </button>
                    <button
                        onClick={() => setActiveTab('deposits')}
                        className={`px-8 py-4 rounded-2xl font-black text-xs uppercase italic tracking-[0.15em] transition-all duration-500 ${activeTab === 'deposits' ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Lịch sử nạp tiền
                    </button>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    {activeTab === 'orders' ? (
                        <div className="grid grid-cols-1 gap-4">
                            {orders.length === 0 ? (
                                <div className="bg-secondary/20 rounded-[3rem] border border-dashed border-white/10 py-32 text-center">
                                    <div className="text-6xl mb-6 opacity-20">🛒</div>
                                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm italic">Bạn chưa thực hiện bất kỳ giao dịch mua nào</p>
                                    <button className="mt-8 text-accent font-black uppercase italic tracking-widest text-xs hover:underline">Khám phá cửa hàng ngay</button>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order._id} className="bg-secondary/40 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden group hover:border-accent/30 transition-all duration-500 shadow-2xl">
                                        <div className="flex flex-col lg:flex-row min-h-[140px]">
                                            {/* Product Preview */}
                                            <div className="lg:w-1/4 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-white/5 flex items-center gap-4 bg-white/[0.02]">
                                                <div className="relative shrink-0">
                                                    <img src={order.product?.images?.[0]} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-accent transition-all" alt="" />
                                                    <div className="absolute -top-2 -right-2 bg-accent text-[7px] font-black px-1.5 py-0.5 rounded-md text-white italic shadow-lg">#{order._id.slice(-4).toUpperCase()}</div>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-black text-lg uppercase italic tracking-tighter mb-1 group-hover:text-accent transition-colors leading-tight">{order.product?.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-accent font-black text-base italic">{order.price?.toLocaleString('vi-VN')}đ</span>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">• {format(new Date(order.createdAt), 'dd/MM/yyyy')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AUTOMATIC DELIVERY INFORMATION */}
                                            <div className="flex-1 p-5 md:p-6 lg:p-8 flex flex-col justify-center relative bg-gradient-to-br from-transparent to-accent/[0.02]">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-1 h-5 bg-accent rounded-full"></div>
                                                    <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest">Thông tin bàn giao tự động</h4>
                                                    <div className="ml-auto flex items-center text-[9px] font-black text-green-500 uppercase italic tracking-widest animate-pulse">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                        Đã sẵn sàng
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 group/field hover:bg-white/10 transition-all flex items-center justify-between">
                                                        <div>
                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-0.5">Tài khoản (Username)</span>
                                                            <code className="text-white text-base font-black tracking-tight">{order.product?.credentials?.username || 'Chưa cập nhật'}</code>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(order.product?.credentials?.username, 'Tài khoản')}
                                                            className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-accent hover:bg-accent/10 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                                        </button>
                                                    </div>
                                                    <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 group/field hover:bg-white/10 transition-all flex items-center justify-between">
                                                        <div>
                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-0.5">Mật khẩu (Password)</span>
                                                            <code className="text-accent text-base font-black tracking-tight">{order.product?.credentials?.password || '********'}</code>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(order.product?.credentials?.password, 'Mật khẩu')}
                                                            className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-accent hover:bg-accent/10 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="bg-secondary/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dịch vụ</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã GD</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {deposits.map(deposit => (
                                            <tr key={deposit._id} className="hover:bg-white/[0.02] transition">
                                                <td className="px-8 py-6 text-slate-400 text-xs font-bold uppercase">{format(new Date(deposit.createdAt), 'dd/MM/yyyy • HH:mm')}</td>
                                                <td className="px-8 py-6 text-accent font-black italic text-lg">{deposit.amount.toLocaleString('vi-VN')}đ</td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase italic tracking-widest border ${deposit.method === 'bank' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-pink-500/10 text-pink-500 border-pink-500/20'}`}>
                                                        {deposit.method}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6"><code className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-white transition-colors">{deposit.transactionId}</code></td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-[0.15em] ${deposit.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                        deposit.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        }`}>
                                                        {deposit.status === 'pending' ? 'Đang xử lý' : deposit.status === 'approved' ? 'Thành công' : 'Đã hủy'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {deposits.length === 0 && (
                                <div className="py-24 text-center text-slate-500 font-black uppercase tracking-widest text-xs italic">Không tìm thấy lịch sử nạp tiền</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Đổi mật khẩu</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="text-slate-500 hover:text-white transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent transition-all"
                                    placeholder="Tối thiểu 6 ký tự"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                disabled={updating}
                                className="w-full bg-accent hover:bg-accent-hover text-white font-black py-5 rounded-2xl shadow-xl shadow-accent/20 transition-all uppercase italic tracking-[0.2em] text-xs disabled:opacity-50 mt-4"
                            >
                                {updating ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
