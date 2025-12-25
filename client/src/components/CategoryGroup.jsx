// Helper component to group products by category
export const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
        const cat = product.category || 'Chưa phân loại';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});
};

export const CategoryGroup = ({ categoryName, products, onEdit, onDelete, getAssetUrl }) => {
    return (
        <div className="bg-secondary/40 backdrop-blur-xl rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-accent/10 to-accent-secondary/10 border-b border-white/10 px-10 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-2xl">
                            📁
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                                {categoryName}
                            </h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                {products.length} sản phẩm
                            </p>
                        </div>
                    </div>
                    <div className="text-accent font-black text-sm uppercase italic">
                        Tổng: {products.reduce((sum, p) => sum + p.price, 0).toLocaleString('vi-VN')}đ
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                        <tr>
                            <th className="px-10 py-6">Tài khoản</th>
                            <th className="px-10 py-6">Giá bán</th>
                            <th className="px-10 py-6">Trạng thái</th>
                            <th className="px-10 py-6 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-medium">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <img
                                                src={product.images[0] ? getAssetUrl(product.images[0]) : 'https://via.placeholder.com/80x80?text=NO+IMG'}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-accent transition-all duration-500"
                                                alt=""
                                                crossOrigin="anonymous"
                                            />
                                            <div className="absolute -top-2 -right-2 bg-accent text-[8px] font-black px-1.5 py-0.5 rounded-lg text-white italic shadow-lg">
                                                #{product._id.slice(-4).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white font-black uppercase text-base italic tracking-tight group-hover:text-accent transition-colors">
                                                {product.title}
                                            </div>
                                            <div className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">
                                                {product.attributes?.Rank || 'NO RANK'} • {product.attributes?.Skins || '0'} SKINS
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="text-accent font-black text-lg italic tracking-tighter">
                                        {product.price.toLocaleString('vi-VN')}đ
                                    </div>
                                    {product.oldPrice > 0 && (
                                        <div className="text-slate-600 text-[9px] line-through font-bold">
                                            {product.oldPrice.toLocaleString('vi-VN')}đ
                                        </div>
                                    )}
                                </td>
                                <td className="px-10 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest border ${product.status === 'available'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {product.status === 'available' ? '🔥 Đang bán' : '🔒 Đã bán'}
                                    </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg border border-white/5"
                                            title="Chỉnh sửa"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => onDelete(product._id)}
                                            className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg border border-white/5"
                                            title="Xóa"
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
        </div>
    );
};
