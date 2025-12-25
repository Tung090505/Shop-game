import React, { useState, useEffect } from 'react';
import { adminFetchAllDeposits, adminUpdateDeposit } from '../api';
import toast from 'react-hot-toast';

const AdminDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDeposits = async () => {
        try {
            const res = await adminFetchAllDeposits();
            setDeposits(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Không thể tải danh sách nạp tiền');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeposits();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await adminUpdateDeposit(id, status);
            toast.success(status === 'approved' ? 'Đã duyệt nạp tiền' : 'Đã từ chối');
            loadDeposits();
        } catch (err) {
            toast.error('Thao tác thất bại');
        }
    };

    if (loading) return <div className="text-center py-20 text-white font-bold animate-pulse">ĐANG TẢI YÊU CẦU...</div>;

    const pendingCount = deposits.filter(d => d.status === 'pending').length;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                        Duyệt <span className="text-yellow-500">Nạp tiền</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Phê duyệt các giao dịch chuyển khoản từ khách hàng</p>
                </div>
                {pendingCount > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 px-8 py-4 rounded-2xl flex items-center shadow-xl shadow-yellow-500/5">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-ping"></span>
                        <span className="text-yellow-500 font-black uppercase italic tracking-widest text-sm">Cần xử lý: {pendingCount} yêu cầu</span>
                    </div>
                )}
            </div>

            <div className="bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-6">Người nạp</th>
                                <th className="px-8 py-6">Số tiền</th>
                                <th className="px-8 py-6">Hình thức</th>
                                <th className="px-8 py-6">Nội dung / Mã GD</th>
                                <th className="px-8 py-6">Trạng thái</th>
                                <th className="px-8 py-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-medium">
                            {deposits.map((deposit) => (
                                <tr key={deposit._id} className="hover:bg-white/[0.02] transition">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black uppercase text-sm">{deposit.user?.username || 'N/A'}</span>
                                            <span className="text-[10px] text-slate-500 mt-0.5">{deposit.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-green-500 font-black text-lg italic">+{deposit.amount.toLocaleString('vi-VN')}đ</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase italic border ${deposit.method === 'bank' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            deposit.method === 'momo' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' :
                                                'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                            }`}>
                                            {deposit.method === 'bank' ? 'Ngân hàng' :
                                                deposit.method === 'momo' ? 'Momo' :
                                                    `Thẻ ${deposit.cardDetails?.type || 'Cào'}`}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {deposit.method === 'card' ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase">PIN:</span>
                                                    <code className="text-xs text-orange-500 font-bold">{deposit.cardDetails?.pin}</code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase">SERI:</span>
                                                    <code className="text-xs text-slate-400 font-mono">{deposit.cardDetails?.serial}</code>
                                                </div>
                                            </div>
                                        ) : (
                                            <code className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-mono">
                                                {deposit.transactionId}
                                            </code>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase italic ${deposit.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                            deposit.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            {deposit.status === 'pending' ? 'Chờ duyệt' :
                                                deposit.status === 'approved' ? 'Hoàn tất' : 'Đã từ chối'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {deposit.status === 'pending' ? (
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleAction(deposit._id, 'approved')}
                                                    className="bg-green-500 hover:bg-green-600 text-white text-[10px] font-black px-5 py-2.5 rounded-xl transition uppercase italic tracking-widest"
                                                >
                                                    Phê duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleAction(deposit._id, 'rejected')}
                                                    className="bg-white/5 hover:bg-red-500 hover:text-white text-slate-400 text-[10px] font-black px-5 py-2.5 rounded-xl transition uppercase italic tracking-widest"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-600 text-[10px] font-bold uppercase">Đã xử lý</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {deposits.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="text-5xl mb-4 opacity-10">💰</div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">Không có yêu cầu nạp tiền nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDeposits;
