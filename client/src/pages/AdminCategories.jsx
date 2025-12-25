import React, { useState, useEffect } from 'react';
import { fetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, uploadImage, getAssetUrl } from '../api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: '',
        parent: '',
        type: 'account',
        displayOrder: 0
    });
    const [currentParentId, setCurrentParentId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Helper: Tìm object thư mục cha từ ID hiện tại
    const currentParent = categories.find(c => String(c._id) === String(currentParentId));

    const loadCategories = async () => {
        try {
            const res = await fetchCategories();
            setCategories(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Không thể tải danh sách danh mục');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category && category._id) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                image: category.image || '',
                description: category.description || '',
                parent: category.parent?._id || category.parent || '',
                type: category.type || 'account',
                displayOrder: category.displayOrder || 0
            });
        } else if (currentParent) {
            setEditingCategory(null);
            setFormData({
                name: '',
                image: '',
                description: '',
                parent: currentParentId,
                type: currentParent.type || 'account', // Thừa hưởng type từ cha
                displayOrder: categories.filter(c => String(c.parent?._id || c.parent || '') === String(currentParentId || '')).length + 1
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                image: '',
                description: '',
                parent: '',
                type: 'account',
                displayOrder: categories.filter(c => !c.parent).length + 1
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('images', file);

        setIsUploading(true);
        try {
            const res = await uploadImage(uploadFormData);
            // Sử dụng functional update để tránh race condition
            setFormData(prev => ({ ...prev, image: res.data.imageUrls[0] }));
            toast.success('Đã tải lên hình ảnh');
        } catch (err) {
            toast.error('Tải ảnh thất bại');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await adminUpdateCategory(editingCategory._id, formData);
                toast.success('Đã cập nhật danh mục');
            } else {
                await adminCreateCategory(formData);
                toast.success('Đã thêm danh mục mới');
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (err) {
            console.error('Submit error:', err);
            toast.error(err.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await adminDeleteCategory(id);
                toast.success('Đã xóa danh mục');
                loadCategories();
            } catch (err) {
                toast.error('Xóa thất bại');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-white font-bold animate-pulse uppercase tracking-[0.3em]">Đang tải dữ liệu...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        {currentParentId && (
                            <button
                                onClick={() => setCurrentParentId(null)}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-accent transition-all border border-white/10"
                            >
                                ←
                            </button>
                        )}
                        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                            {currentParentId && currentParent ? (
                                <>Quản lý <span className="text-accent">{currentParent.name}</span></>
                            ) : (
                                <>Quản lý <span className="text-accent">Thư mục Game</span></>
                            )}
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
                        {currentParentId && currentParent ? `Đang quản lý các thư mục con của ${currentParent.name}` : 'Phân loại game (Liên Quân, Tốc Chiến, Free Fire...)'}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-accent hover:bg-accent-hover text-white font-black px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-accent/20 uppercase italic tracking-widest text-sm flex items-center gap-3 group"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform tracking-normal">+</span>
                    {currentParentId ? `Thêm thư mục con` : 'Thêm thư mục mới'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories
                    .filter(cat => {
                        const pid = cat.parent?._id || cat.parent || null;
                        return String(pid || '') === String(currentParentId || '');
                    })
                    .map((cat) => (
                        <div key={cat._id} className="bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl group transition-all hover:border-accent/30 flex flex-col relative">
                            <div className="relative h-48 overflow-hidden bg-white/5 pointer-events-none">
                                {cat.image ? (
                                    <img src={getAssetUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🎮</div>
                                )}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg z-10">
                                    <span className="text-white font-black text-[10px] uppercase italic tracking-widest">STT: {cat.displayOrder}</span>
                                </div>
                                {!cat.parent && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10">
                                        <span className="bg-white text-black font-black px-6 py-2 rounded-full text-[10px] uppercase italic tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            Quản lý mục con →
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex-1 flex flex-col relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{cat.name}</h3>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${cat.type === 'wheel' ? 'bg-orange-500/20 text-orange-500' :
                                        cat.type === 'random' ? 'bg-blue-500/20 text-blue-500' :
                                            'bg-green-500/20 text-green-500'
                                        }`}>
                                        {cat.type === 'wheel' ? 'Vòng quay' : cat.type === 'random' ? 'Random' : cat.type === 'service' ? 'Dịch vụ' : 'Shop Acc'}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs line-clamp-2 mb-6 flex-1 italic">{cat.description || 'Chưa có mô tả cho thư mục này.'}</p>

                                <div className="flex gap-3 relative z-30">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(cat); }}
                                        className="flex-1 bg-white/5 hover:bg-accent hover:text-white text-slate-300 font-black py-3 rounded-xl transition-all uppercase italic text-[10px] tracking-widest border border-white/5"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(cat._id); }}
                                        className="px-6 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-500 font-black py-3 rounded-xl transition-all uppercase italic text-[10px] tracking-widest border border-white/5"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                            {/* Clickable Overlay to "Enter" - Moved to end and higher z-index */}
                            {!cat.parent && (
                                <div
                                    onClick={() => setCurrentParentId(cat._id)}
                                    className="absolute inset-0 z-20 cursor-pointer"
                                    title={`Bấm để quản lý các mục con của ${cat.name}`}
                                ></div>
                            )}
                        </div>
                    ))}

                {/* Empty State */}
                {categories.filter(cat => {
                    const pid = cat.parent?._id || cat.parent || null;
                    return String(pid || '') === String(currentParentId || '');
                }).length === 0 && (
                        <div className="col-span-full py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 text-center">
                            <div className="text-6xl mb-6 grayscale opacity-20">📂</div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Chưa có thư mục nào ở đây</h3>
                            <p className="text-slate-500 mt-2 text-sm italic">Hãy bấm nút "Thêm" để bắt đầu tạo cấu trúc cho Shop của bạn.</p>
                        </div>
                    )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop - click to close */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>

                    {/* Modal Content - must be above backdrop */}
                    <div className="bg-[#0f172a] p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full max-w-xl relative z-[10000] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

                        <h2 className="text-3xl font-black text-white uppercase italic mb-10 flex items-center leading-none">
                            <span className="w-2 h-10 bg-accent mr-5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></span>
                            {editingCategory ? 'Sửa thư mục' : 'Thêm thư mục mới'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tên thư mục game</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                    required
                                    placeholder="Ví dụ: LIÊN QUÂN MOBILE"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Thư mục cha (Để trống nếu là thư mục gốc)</label>
                                <select
                                    value={formData.parent}
                                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all appearance-none"
                                >
                                    <option value="" className="bg-secondary text-white">--- Không có (Thư mục gốc) ---</option>
                                    {categories.filter(c => !c.parent && c._id !== editingCategory?._id).map(c => (
                                        <option key={c._id} value={c._id} className="bg-secondary text-white">{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Loại hình xử lý (Trang riêng biệt)</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all appearance-none"
                                >
                                    <option value="account" className="bg-secondary text-white font-bold">🛒 Shop Acc (Bình thường)</option>
                                    <option value="random" className="bg-secondary text-white font-bold">🎲 Thử vận may (Acc Random)</option>
                                    <option value="wheel" className="bg-secondary text-white font-bold">🎡 Vòng quay may mắn</option>
                                    <option value="service" className="bg-secondary text-white font-bold">🛠️ Dịch vụ game (Cày thuê/Nạp tiền)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Thứ tự hiển thị</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Hình ảnh (Icon)</label>
                                    <div className="relative h-24 group/upload">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            accept="image/*"
                                        />
                                        <div className="w-full h-full bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-500 uppercase italic tracking-widest transition-all hover:bg-white/10 overflow-hidden relative">
                                            {isUploading ? (
                                                'Đang tải...'
                                            ) : formData.image ? (
                                                <>
                                                    <img src={getAssetUrl(formData.image)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/upload:opacity-30 transition-opacity" />
                                                    <span className="relative z-10 text-white drop-shadow-md">Đã có ảnh (Click đổi)</span>
                                                </>

                                            ) : (
                                                'Chọn ảnh icon'
                                            )}
                                        </div>
                                    </div>
                                    {formData.image && <p className="text-[9px] text-slate-600 font-bold truncate px-2 mt-1">{formData.image}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mô tả ngắn</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-accent transition-all h-28 resize-none"
                                    placeholder="Nên nhập ngắn gọn để hiển thị đẹp nhất..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-accent hover:bg-accent-hover text-white font-black py-5 rounded-2xl shadow-xl shadow-accent/20 transition-all uppercase italic tracking-widest"
                                >
                                    {editingCategory ? 'Lưu cập nhật' : 'Tạo thư mục'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-10 bg-white/5 text-slate-400 font-black py-5 rounded-2xl transition hover:bg-white/10 uppercase italic tracking-widest"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
