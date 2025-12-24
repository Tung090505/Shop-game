import React from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../api';

const ProductCard = ({ product }) => {
    const isSold = product.status === 'sold';

    return (
        <div className="group bg-card-bg rounded-2xl border border-white/5 overflow-hidden hover:border-accent/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={product.images?.[0] ? getAssetUrl(product.images[0]) : 'https://dummyimage.com/600x400/1f2937/ffffff&text=No+Image'}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSold ? 'grayscale opacity-50' : ''}`}
                />

                {/* ID Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/10 uppercase tracking-tighter">
                    #{product._id?.slice(-6).toUpperCase()}
                </div>

                {/* Sold Overlay */}
                {isSold && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-gaming-red text-white font-black px-6 py-2 rounded-xl text-sm uppercase italic tracking-widest shadow-lg shadow-red-500/20 rotate-[-10deg] border-2 border-white/20">
                            ĐÃ BÁN
                        </span>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute bottom-3 right-3 bg-accent text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase italic">
                    {product.category}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <h3 className="text-white font-black text-base mb-4 line-clamp-1 group-hover:text-accent transition uppercase italic tracking-tight">
                    {product.title}
                </h3>

                {/* Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {Object.entries(product.attributes || {}).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex flex-col bg-primary/40 p-2 rounded-xl border border-white/5">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{key}</span>
                            <span className="text-xs font-black text-gray-200 truncate">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        {product.oldPrice && (
                            <span className="text-[10px] text-gray-500 line-through font-bold">{product.oldPrice.toLocaleString('vi-VN')}đ</span>
                        )}
                        <span className="text-xl font-black text-accent italic tracking-tighter">
                            {product.price.toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    <Link
                        to={`/product/${product._id}`}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase italic transition duration-300 ${isSold
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 hover:shadow-accent/40'
                            }`}
                    >
                        {isSold ? 'XEM LẠI' : 'MUA NGAY'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
