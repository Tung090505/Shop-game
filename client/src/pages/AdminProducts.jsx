import React, { useState, useEffect } from 'react';
import { fetchProducts, adminFetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, uploadImage, fetchCategories, getAssetUrl } from '../api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(''); // Filter by category
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        price: 0,
        oldPrice: 0,
        description: '',
        images: [],
        attributes: { Rank: '', Skins: '', Pet: '' },
        credentials: { username: '', password: '' },
        status: 'available',
        flashSale: false,
        discountPrice: 0
    });

    const loadProducts = async () => {
        try {
            const res = await adminFetchProducts();
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Không thể tải danh sách sản phẩm');
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetchCategories();
            setCategories(res.data);
            if (!editingProduct && res.data.length > 0) {
                setFormData(prev => ({ ...prev, category: res.data[0].name }));
            }
        } catch (err) {
            console.error('Không thể tải danh mục');
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const handleEdit = (product) => {
        setEditingProduct(product);

        // Tìm parent category của sản phẩm
        const productCategory = categories.find(cat => cat.name === product.category);
        const parentId = productCategory?.parent?._id || productCategory?.parent || '';
        setSelectedParentCategory(String(parentId));

        setFormData({
            ...product,
            attributes: product.attributes || { Rank: '', Skins: '', Pet: '' },
            credentials: product.credentials || { username: '', password: '' },
            flashSale: product.flashSale || false,
            discountPrice: product.discountPrice || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await adminDeleteProduct(id);
                toast.success('Đã xóa sản phẩm');
                loadProducts();
            } catch (err) {
                toast.error('Xóa thất bại');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Trim whitespace from all string fields
            const sanitizedData = {
                ...formData,
                title: formData.title?.trim(),
                category: formData.category?.trim(),
                description: formData.description?.trim()
            };

            if (editingProduct) {
                await adminUpdateProduct(editingProduct._id, sanitizedData);
                toast.success('Cập nhật thành công');
            } else {
                await adminCreateProduct(sanitizedData);
                toast.success('Đăng sản phẩm thành công');
            }

            setShowModal(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            toast.error('Thao tác thất bại');
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadData = new FormData();
        files.forEach(file => uploadData.append('images', file));

        setUploading(true);
        try {
            const { data } = await uploadImage(uploadData);
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...data.imageUrls]
            }));
            toast.success(`Đã tải lên ${data.imageUrls.length} ảnh`);
        } catch (err) {
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Filter products by selected category
    const filteredProducts = selectedCategory
        ? products.filter(p => p.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim())
        : products;

    // Group products by category for the sidebar
    const productsByCategory = products.reduce((acc, product) => {
        const cat = product.category || 'Chưa phân loại';
        if (!acc[cat]) acc[cat] = 0;
        acc[cat]++;
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-12 pb-32">
            {/* Category Filter Tabs */}
            <div className="mb-8 overflow-x-auto">
                <div className="flex gap-3 pb-4">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-6 py-3 rounded-2xl font-black text-sm uppercase italic tracking-widest transition-all whitespace-nowrap ${selectedCategory === ''
                            ? 'bg-accent text-white shadow-xl shadow-accent/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        📦 Tất cả ({products.length})
                    </button>
                    {Object.keys(productsByCategory).sort().map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-2xl font-black text-sm uppercase italic tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-accent text-white shadow-xl shadow-accent/20'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            📁 {cat} ({productsByCategory[cat]})
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                        Quản lý <span className="text-accent">Sản phẩm</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">
                        {selectedCategory ? `Danh mục: ${selectedCategory}` : 'Phân phối tài khoản Game chuyên nghiệp'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                            title: '',
                            category: categories.length > 0 ? categories[0].name : '',
                            price: 0,
                            oldPrice: 0,
                            description: '',
                            images: [],
                            attributes: { Rank: '', Skins: '', Pet: '' },
                            credentials: { username: '', password: '' },
                            status: 'available',
                            flashSale: false,
                            discountPrice: 0
                        });
                        setShowModal(true);
                    }}
                    className="bg-accent hover:bg-accent-hover text-white font-black px-10 py-5 rounded-[2rem] transition-all duration-500 shadow-2xl shadow-accent/20 uppercase italic tracking-widest flex items-center group"
                >
                    <span className="text-2xl mr-3 group-hover:rotate-90 transition-transform duration-500">+</span> ĐĂNG ACC MỚI
                </button>
            </div>

            <div className="bg-secondary/40 backdrop-blur-xl rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-8">Tài khoản</th>
                                <th className="px-10 py-8">Danh mục</th>
                                <th className="px-10 py-8">Giá bán</th>
                                <th className="px-10 py-8">Trạng thái</th>
                                <th className="px-10 py-8 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-medium">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-6">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={getAssetUrl(product.images[0])}
                                                    className="w-20 h-20 rounded-[2rem] object-cover border-2 border-white/10 group-hover:border-accent transition-all duration-500"
                                                    alt=""
                                                    crossOrigin="anonymous"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-accent text-[9px] font-black px-2 py-1 rounded-lg text-white italic shadow-lg">ID: {product._id.slice(-4).toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div className="text-white font-black uppercase text-lg italic tracking-tight group-hover:text-accent transition-colors">{product.title}</div>
                                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                                    {product.attributes?.Rank || 'NO RANK'} • {product.attributes?.Skins || '0'} SKINS
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="text-accent font-black text-xl italic tracking-tighter">{product.price.toLocaleString('vi-VN')}đ</div>
                                        {product.oldPrice > 0 && (
                                            <div className="text-slate-600 text-[10px] line-through font-bold">{product.oldPrice.toLocaleString('vi-VN')}đ</div>
                                        )}
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest border ${product.status === 'available' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {product.status === 'available' ? '🔥 Đang bán' : '🔒 Đã bán'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg border border-white/5"
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg border border-white/5"
                                                title="Xóa Acc"
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
                {products.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="text-6xl mb-6 opacity-20">📦</div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs italic">Cửa hàng hiện đang trống rỗng</p>
                    </div>
                )}
            </div>

            {/* Premium Full-Screen Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-primary/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] w-full max-w-5xl rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95 duration-300 relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

                        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <div>
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                                    {editingProduct ? 'Cập nhật' : 'Đăng mới'} <span className="text-accent">Sản phẩm</span>
                                </h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Hệ thống phân phối tài khoản tự động</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 transition-all text-2xl border border-white/5">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 overflow-y-auto space-y-12 flex-grow custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Left Side: Basic Info */}
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Tên Sản Phẩm </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-white font-black text-lg outline-none focus:border-accent transition shadow-inner placeholder:text-slate-700"
                                            placeholder="VD: ACC SIÊU PHẨM - FULL TƯỚNG"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Parent Category (Game) */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Game chính</label>
                                            <select
                                                value={selectedParentCategory}
                                                onChange={(e) => {
                                                    setSelectedParentCategory(e.target.value);
                                                    setFormData({ ...formData, category: '' }); // Reset subcategory
                                                }}
                                                className="w-full bg-slate-900 border border-white/10 rounded-3xl px-8 py-5 text-white font-black outline-none focus:border-accent transition appearance-none cursor-pointer"
                                                style={{ colorScheme: 'dark' }}
                                                required
                                            >
                                                <option value="">-- Chọn game --</option>
                                                {categories
                                                    .filter(cat => !cat.parent) // Chỉ hiển thị danh mục cha
                                                    .map(cat => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {/* Subcategory (Product Type) */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Danh mục con</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded-3xl px-8 py-5 text-white font-black outline-none focus:border-accent transition appearance-none cursor-pointer"
                                                style={{ colorScheme: 'dark' }}
                                                required
                                                disabled={!selectedParentCategory}
                                            >
                                                <option value="">-- Chọn loại --</option>
                                                {categories
                                                    .filter(cat => String(cat.parent?._id || cat.parent || '') === String(selectedParentCategory))
                                                    .map(cat => (
                                                        <option key={cat._id} value={cat.name}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                {selectedParentCategory && categories.filter(cat => String(cat.parent?._id || cat.parent || '') === String(selectedParentCategory)).length === 0 && (
                                                    <option value="" disabled>Chưa có danh mục con</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Trạng thái</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded-3xl px-8 py-5 text-white font-black outline-none focus:border-accent transition appearance-none cursor-pointer"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                <option value="available">Sẵn sàng bán</option>
                                                <option value="sold">Đã bán</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Giá bán hiện tại (đ)</label>
                                            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-accent font-black text-2xl outline-none focus:border-accent transition shadow-inner" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Giá cũ / Giá gốc (đ)</label>
                                            <input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-slate-500 font-black text-2xl outline-none focus:border-accent transition shadow-inner" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Mô tả sản phẩm</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-white font-medium outline-none focus:border-accent transition shadow-inner h-32 resize-none"
                                            placeholder="Nhập vài lời mời chào..."
                                        />
                                    </div>

                                    <div className="p-8 bg-orange-500/5 rounded-3xl border border-orange-500/20 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase text-orange-500 tracking-[0.2em] italic flex items-center">
                                                <span className="w-2 h-4 bg-orange-500 mr-3 rounded-full"></span>
                                                Cài đặt Flash Sale
                                            </h3>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.flashSale}
                                                    onChange={(e) => setFormData({ ...formData, flashSale: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>

                                        {formData.flashSale && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Giá Flash Sale (VNĐ)</label>
                                                <input
                                                    type="number"
                                                    value={formData.discountPrice}
                                                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                                    className="w-full bg-[#0f172a] border border-orange-500/30 rounded-2xl px-6 py-4 text-orange-500 font-black text-xl outline-none focus:border-orange-500 transition shadow-inner"
                                                    placeholder="Nhập giá khuyến mãi..."
                                                />
                                                <p className="text-[9px] text-orange-500/50 font-bold italic ml-2">* Giá này sẽ hiển thị ở mục Flash Sale trang chủ</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Technical Info & Credentials */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hình ảnh minh họa ({formData.images.length}/5)</label>
                                            {formData.images.length > 0 && (
                                                <button type="button" onClick={() => setFormData({ ...formData, images: [] })} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">Xóa tất cả</button>
                                            )}
                                        </div>

                                        {/* Main Large Preview */}
                                        <div className="relative group cursor-pointer w-full aspect-video rounded-[3rem] overflow-hidden border-2 border-dashed border-white/10 hover:border-accent transition-all duration-500 bg-white/[0.02] flex items-center justify-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[30]"
                                            />

                                            {uploading ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-20">
                                                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Đang tải lên...</span>
                                                </div>
                                            ) : formData.images.length > 0 ? (
                                                <>
                                                    <img
                                                        src={getAssetUrl(formData.images[0])}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        alt="Preview"
                                                        crossOrigin="anonymous"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl">
                                                            <span className="text-[10px] font-black uppercase text-white tracking-widest">Thêm / Thay đổi ảnh</span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-accent transition-colors duration-500">
                                                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">📸</div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Tải ảnh lên (Tối đa 5 ảnh)</span>
                                                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-40 italic">Nhấn để chọn nhiều ảnh từ máy tính</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnails Grid */}
                                        {formData.images.length > 0 && (
                                            <div className="grid grid-cols-5 gap-4 px-2">
                                                {formData.images.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group/thumb">
                                                        <img src={getAssetUrl(img)} className="w-full h-full object-cover" crossOrigin="anonymous" alt="" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover/thumb:opacity-100 transition-opacity z-20"
                                                        >✕</button>
                                                        {idx === 0 && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-accent/80 text-[8px] font-black text-white text-center py-1 uppercase italic">Ảnh chính</div>
                                                        )}
                                                    </div>
                                                ))}
                                                {formData.images.length < 5 && (
                                                    <div className="relative aspect-square rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-slate-600 hover:border-accent hover:text-accent transition-all cursor-pointer">
                                                        <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                        <span className="text-xl">+</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 space-y-6">
                                        <h3 className="text-xs font-black uppercase text-accent tracking-[0.2em] italic flex items-center">
                                            <span className="w-2 h-4 bg-accent mr-3 rounded-full"></span>
                                            Thông số Acc game
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black text-slate-600 uppercase ml-2">Rank Hiện Tại</span>
                                                <input type="text" placeholder="Vàng, Kim Cương..." value={formData.attributes.Rank} onChange={(e) => setFormData({ ...formData, attributes: { ...formData.attributes, Rank: e.target.value } })} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-black outline-none focus:border-accent transition" />
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black text-slate-600 uppercase ml-2">Số lượng Skin</span>
                                                <input type="text" placeholder="100+, 200+..." value={formData.attributes.Skins} onChange={(e) => setFormData({ ...formData, attributes: { ...formData.attributes, Skins: e.target.value } })} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-black outline-none focus:border-accent transition" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-accent/5 rounded-[3.5rem] border border-accent/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-accent/20"></div>
                                        <h3 className="text-sm font-black mb-8 uppercase text-white tracking-[0.25em] italic flex items-center">
                                            <span className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center mr-4 text-xs shadow-lg shadow-accent/20">🔑</span>
                                            Kho Bàn Giao Tự Động
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black text-slate-500 uppercase ml-2">Tên đăng nhập (Username)</span>
                                                <input type="text" placeholder="Tài Khoản.." value={formData.credentials.username} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, username: e.target.value } })} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-2xl px-8 py-4 text-white font-black outline-none focus:border-accent transition placeholder:text-slate-700" required />
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black text-slate-500 uppercase ml-2">Mật khẩu (Password)</span>
                                                <input type="text" placeholder="Mật khẩu.." value={formData.credentials.password} onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, password: e.target.value } })} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-2xl px-8 py-4 text-accent font-black outline-none focus:border-accent transition placeholder:text-slate-700" required />
                                            </div>
                                            <p className="text-[9px] text-accent/50 font-black uppercase tracking-widest text-center mt-4">⚠️ Thông tin này sẽ được gửi ngay cho khách sau khi thanh toán</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/5">
                                <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-black py-8 rounded-[2.5rem] shadow-3xl shadow-accent/30 transition-all duration-500 uppercase italic tracking-[0.3em] text-2xl flex items-center justify-center group">
                                    <span className="mr-4 group-hover:scale-125 transition-transform duration-500">🚀</span> {editingProduct ? 'CẬP NHẬT CƠ SỞ DỮ LIỆU' : 'XÁC NHẬN ĐĂNG BÁN '}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
