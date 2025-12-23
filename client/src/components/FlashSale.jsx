import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

const FlashSale = () => {
    const [products, setProducts] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const res = await api.fetchProducts({ flashSale: true });
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFlashSales();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-primary relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-gaming-red rounded-full animate-ping"></div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                                FLASH <span className="text-gaming-red">SALE</span>
                            </h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                                <React.Fragment key={i}>
                                    <div className="bg-secondary border border-white/10 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">
                                        {String(unit).padStart(2, '0')}
                                    </div>
                                    {i < 2 && <span className="text-accent font-black text-2xl">:</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <Link to="/shop" className="group text-accent font-black uppercase italic tracking-widest flex items-center hover:text-white transition">
                        XEM TẤT CẢ <span className="ml-3 group-hover:translate-x-2 transition">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <Link key={product._id} to={`/product/${product._id}`} className="group bg-secondary/40 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden hover:border-accent/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] relative">
                            <div className="absolute top-4 left-4 z-10 bg-gaming-red text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xl italic uppercase tracking-widest">
                                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                            </div>
                            <div className="h-48 overflow-hidden">
                                <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60 group-hover:opacity-100" alt="" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-white font-black text-base line-clamp-1 mb-4 group-hover:text-accent transition uppercase italic tracking-tight">{product.title}</h3>
                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs line-through font-bold mb-1">{product.price.toLocaleString('vi-VN')}đ</span>
                                        <span className="text-2xl font-black text-accent italic tracking-tighter">{product.discountPrice.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-lg">
                                        <span className="text-xl">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FlashSale;
