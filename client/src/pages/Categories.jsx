import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, getAssetUrl } from '../api';
import SEO from '../components/SEO';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data);
            } catch (err) {
                console.error('Không thể tải danh mục:', err);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    return (
        <div className="min-h-screen bg-primary pt-32 pb-24">
            <SEO title="Danh mục Game" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-accent font-black text-xs uppercase tracking-[0.4em] mb-4 block">Store Collections</span>
                    <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
                        CHỌN <span className="text-accent">GAME</span> BẠN MUỐN
                    </h1>
                    <div className="w-24 h-2 bg-accent mx-auto mt-8 rounded-full"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-96 rounded-[3rem] bg-white/5 animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {categories.filter(c => !c.parent).map((game) => (
                            <Link
                                key={game._id}
                                to={`/game/${game._id}`}
                                className="group relative h-96 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 hover:border-accent/50 hover:-translate-y-2"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: game.image ? `url(${getAssetUrl(game.image)})` : 'none', backgroundColor: '#1a1a1a' }}
                                >
                                    {!game.image && <div className="w-full h-full flex items-center justify-center text-7xl opacity-20">🎮</div>}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition duration-500"></div>

                                {/* Content */}
                                <div className="absolute inset-x-0 bottom-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="w-12 h-1 bg-accent mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{game.name}</h3>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                {game.description || 'Xem chi tiết các loại tài khoản & dịch vụ'}
                                            </p>
                                        </div>
                                        <div className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-accent/20 group-hover:scale-110 transition-all duration-500">
                                            →
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl group-hover:border-accent group-hover:w-16 group-hover:h-16 transition-all duration-500"></div>
                            </Link>
                        ))}
                    </div>
                )}

                {categories.length === 0 && !loading && (
                    <div className="text-center py-32 bg-secondary/30 rounded-[4rem] border border-white/5">
                        <div className="text-8xl mb-8 opacity-20 grayscale">📦</div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Hiện chưa có danh mục game nào</h3>
                        <p className="text-gray-500 mt-4">Vui lòng quay lại sau.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
