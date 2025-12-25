import React, { useState, useEffect, useContext } from 'react';
import { fetchTransactions } from '../api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const Transactions = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const res = await fetchTransactions();
                setTransactions(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch transactions', err);
                setLoading(false);
            }
        };
        if (user) getTransactions();
    }, [user]);

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const filteredTransactions = transactions.filter(tx => {
        const term = searchTerm.toLowerCase();
        return (
            tx._id?.toLowerCase().includes(term) ||
            tx.type?.toLowerCase().includes(term) ||
            tx.description?.toLowerCase().includes(term) ||
            tx.amount?.toString().includes(term)
        );
    });

    return (
        <div className="min-h-screen bg-primary py-24 pb-40">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-16">
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                        Biến động <span className="text-accent">Số dư</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Minh bạch • Rõ ràng • Chi tiết 24/7</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm giao dịch (Mã, Loại, Nội dung, Số tiền...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#121927] border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-slate-600 focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none"
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-secondary/40 backdrop-blur-xl rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-6">Thời gian</th>
                                    <th className="px-8 py-6">Loại GD</th>
                                    <th className="px-8 py-6">Nội dung chi tiết</th>
                                    <th className="px-8 py-6 text-right">Biến động</th>
                                    <th className="px-8 py-6 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-medium">
                                {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-white/[0.02] transition group">
                                        <td className="px-8 py-6 text-slate-500 text-xs font-bold uppercase">
                                            {format(new Date(tx.createdAt), 'dd/MM/yyyy • HH:mm')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase italic tracking-widest border ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                tx.type === 'purchase' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    tx.type === 'lucky-wheel' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                                }`}>
                                                {tx.type === 'deposit' ? 'Cộng tiền' :
                                                    tx.type === 'purchase' ? 'Mua hàng' :
                                                        tx.type === 'lucky-wheel' ? 'Vòng quay' : tx.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-white font-black text-sm uppercase italic tracking-tight group-hover:text-accent transition-colors">{tx.description}</div>
                                            <div className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest">Mã: {tx._id.toUpperCase()}</div>
                                        </td>
                                        <td className={`px-8 py-6 text-right font-black text-lg italic ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN')}đ
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center justify-center text-green-500 font-black text-[10px] uppercase tracking-widest italic">
                                                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                Thành công
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="text-5xl mb-4 opacity-20">📜</div>
                                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs italic">Bạn chưa có bất kỳ giao dịch nào</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
