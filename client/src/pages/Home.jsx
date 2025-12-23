import React, { useState, useEffect } from 'react';
import LuckyWheel from '../components/LuckyWheel';
import FlashSale from '../components/FlashSale';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchCategories, fetchProducts } from '../api';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    fetchCategories(),
                    fetchProducts()
                ]);
                setCategories(categoriesRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error('Không thể tải dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    return (
        <div className="min-h-screen bg-primary text-text-main">
            <SEO title="Trang chủ" />
            {/* Hero Section - Full Dark */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-primary">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-8 backdrop-blur-md">
                                <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
                                <span className="text-accent font-black text-xs uppercase tracking-[0.2em]">Hệ thống bán Acc tự động số 1</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] uppercase italic tracking-tighter">
                                <span className="text-white">LEVEL UP</span><br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-secondary to-accent bg-[length:200%_auto] animate-gradient-x">YOUR GAME</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                                Khám phá kho tài khoản game cực phẩm. Giao dịch siêu tốc, bảo mật tuyệt đối, hỗ trợ 24/7.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                                <Link to="/categories" className="group relative bg-accent hover:bg-accent-hover text-white px-10 py-5 rounded-2xl font-black text-xl transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] w-full sm:w-auto text-center uppercase italic tracking-widest overflow-hidden">
                                    <span className="relative z-10">MUA ACC NGAY</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </Link>
                                <Link to="/topup" className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-xl transition border border-white/10 w-full sm:w-auto text-center backdrop-blur-md uppercase italic tracking-widest">
                                    NẠP TIỀN
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto lg:mx-0">
                                <div>
                                    <div className="text-2xl font-black text-white">10K+</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Giao dịch</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">1K+</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Khách hàng</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">95%</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hài lòng</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full max-w-xl">
                            <LuckyWheel />
                        </div>
                    </div>
                </div>
            </section>

            {/* Flash Sale Section */}
            <FlashSale />

            {/* Game Selection - Parent Categories Entry Points */}
            <section className="py-24 bg-[#0a0f1d] border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent font-black text-xs uppercase tracking-[0.4em] mb-4 block">Store Collections</span>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                            DANH MỤC <span className="text-accent">TRÒ CHƠI</span>
                        </h2>
                        <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {categories.filter(c => !c.parent).map((game) => {
                            const subCategoryNames = categories.filter(c => (c.parent?._id || c.parent) === game._id).map(c => c.name);
                            const gameItemsCount = products.filter(p => p.category === game.name || subCategoryNames.includes(p.category)).length;

                            return (
                                <Link
                                    key={game._id}
                                    to={`/game/${game._id}`}
                                    className="group relative h-64 md:h-80 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 hover:border-accent/40 hover:-translate-y-2"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: game.image ? `url(${game.image})` : 'none', backgroundColor: '#1a1a1a' }}
                                    >
                                        {!game.image && <div className="w-full h-full flex items-center justify-center text-7xl opacity-10">🎮</div>}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>

                                    <div className="absolute inset-0 p-10 flex flex-col justify-center">
                                        <div className="w-12 h-1 bg-accent mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                                        <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4 group-hover:text-accent transition-colors">
                                            {game.name}
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{gameItemsCount} ITEMS</span>
                                            </div>
                                            <p className="text-accent text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                                                KHÁM PHÁ NGAY →
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-8 right-8 w-16 h-16 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                                        <span className="text-white text-3xl italic font-black group-hover:scale-110 transition-transform">→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-secondary/30 backdrop-blur-sm border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { icon: '⚡', title: 'Giao dịch nhanh', desc: 'Nhận tài khoản ngay sau 1s' },
                            { icon: '🛡️', title: 'Bảo mật 100%', desc: 'Hệ thống mã hóa tối tân' },
                            { icon: '💎', title: 'Giá rẻ nhất', desc: 'Luôn có ưu đãi mỗi ngày' },
                            { icon: '📞', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH tận tâm' }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-5xl mb-6 transform group-hover:scale-125 transition duration-300 inline-block">{item.icon}</div>
                                <h4 className="text-xl font-black text-white uppercase italic mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
