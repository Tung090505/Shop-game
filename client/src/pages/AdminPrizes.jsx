import React, { useState, useEffect } from 'react';
import { fetchPrizes, adminAddPrize, adminUpdatePrize, adminDeletePrize } from '../api';
import toast from 'react-hot-toast';

const AdminPrizes = () => {
    const [prizes, setPrizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPrize, setEditingPrize] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'balance',
        value: 0,
        chance: 0.1,
        color: '#6366f1'
    });

    const loadPrizes = async () => {
        try {
            const res = await fetchPrizes();
            if (Array.isArray(res.data)) {
                setPrizes(res.data);
            } else {
                console.error('Invalid prizes data:', res.data);
                setPrizes([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Fetch prizes error:', err);
            toast.error('Không thể tải danh sách phần thưởng');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrizes();
    }, []);

    const handleEdit = (prize) => {
        setEditingPrize(prize);
        setFormData(prize);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phần thưởng này?')) {
            try {
                await adminDeletePrize(id);
                toast.success('Đã xóa phần thưởng');
                loadPrizes();
            } catch (err) {
                toast.error('Xóa thất bại');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPrize) {
                await adminUpdatePrize(editingPrize._id, formData);
                toast.success('Cập nhật thành công');
            } else {
                await adminAddPrize(formData);
                toast.success('Thêm phần thưởng thành công');
            }

            setShowModal(false);
            setEditingPrize(null);
            loadPrizes();
        } catch (err) {
            toast.error('Thao tác thất bại');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 pb-32 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        Quản lý <span className="text-purple-500">Vòng quay</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Điều chỉnh tỷ lệ trúng thưởng và phần quà</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPrize(null);
                        setFormData({ name: '', type: 'balance', value: 0, chance: 0.1, color: '#6366f1' });
                        setShowModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black px-10 py-5 rounded-[2rem] transition-all duration-500 shadow-2xl shadow-purple-500/20 uppercase italic tracking-widest flex items-center group"
                >
                    <span className="text-2xl mr-3 group-hover:scale-125 transition-all text-white">+</span> THÊM QUÀ MỚI
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prizes.map((prize) => (
                    <div key={prize._id} className="bg-secondary/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group hover:border-purple-500/30 transition-all duration-500 p-8">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-white/5" style={{ backgroundColor: `${prize.color}20`, color: prize.color }}>
                                {prize.type === 'balance' ? '💰' : prize.type === 'product' ? '🎁' : '❌'}
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => handleEdit(prize)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-white/5">✏️</button>
                                <button onClick={() => handleDelete(prize._id)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/5">🗑️</button>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{prize.name}</h3>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                Loại: {prize.type === 'balance' ? 'Cộng tiền' : prize.type === 'product' ? 'Vật phẩm' : 'Mất lượt'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                            <div>
                                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Giá trị</p>
                                <p className="text-xl font-black italic tracking-tighter">
                                    {prize.value ? `${prize.value.toLocaleString('vi-VN')}đ` : '---'}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Tỷ lệ (0-1)</p>
                                <p className="text-xl font-black italic tracking-tighter text-purple-500">{(prize.chance * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prize Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-primary/95 backdrop-blur-2xl z-[120] flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] w-full max-w-xl rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                                {editingPrize ? 'Sửa' : 'Thêm'} <span className="text-purple-500">Quà tặng</span>
                            </h2>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-12 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Tên phần quà</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition font-black italic" placeholder="VD: 50.000đ Miễn Phí" required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Loại quà</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition font-black appearance-none cursor-pointer"
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="balance">Cộng tiền</option>
                                        <option value="product">Vật phẩm (Quay hũ)</option>
                                        <option value="empty">Mất lượt (Chúc may mắn)</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Giá trị (đ)</label>
                                    <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition font-black italic" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Tỷ lệ (0 đến 1)</label>
                                    <input type="number" step="0.01" value={formData.chance} onChange={(e) => setFormData({ ...formData, chance: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition font-black italic" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Màu chủ đạo</label>
                                    <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full h-[60px] bg-white/5 border border-white/10 rounded-2xl px-2 py-2 outline-none cursor-pointer" />
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-purple-500/20 transition-all uppercase italic tracking-[0.2em]">
                                    LƯU CẤU HÌNH QUÀ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPrizes;
