import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api';
import SEO from '../components/SEO';

const GameDetail = () => {
    const { id } = useParams();
    const [parentCategory, setParentCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    fetchCategories(),
                    fetchProducts()
                ]);

                const allCats = categoriesRes.data;
                const parent = allCats.find(c => c._id === id || c.slug === id);

                if (parent) {
                    setParentCategory(parent);
                    const children = allCats.filter(c => (c.parent?._id || c.parent) === parent._id);
                    setSubCategories(children.length > 0 ? children : [parent]);
                }
                setProducts(productsRes.data);
            } catch (err) {
                console.error('Lỗi tải dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary pt-32 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!parentCategory) {
        return (
            <div className="min-h-screen bg-primary pt-32 text-center text-white">
                <h1 className="text-4xl font-black">Danh mục không tồn tại</h1>
                <Link to="/" className="text-accent mt-4 inline-block">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary pb-24">
            <SEO title={parentCategory.name} />

            {/* Header / Banner */}
            <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110"
                    style={{ backgroundImage: `url(${parentCategory.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070'})` }}
                ></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>

                <div className="container mx-auto px-4 relative h-full flex flex-col justify-center items-center text-center">
                    <span className="text-accent font-black text-sm uppercase tracking-[0.5em] mb-4 animate-in fade-in slide-in-from-bottom-3 duration-700">Collections</span>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        {parentCategory.name}
                    </h1>
                    <div className="w-24 h-2 bg-accent rounded-full mb-8"></div>
                    <p className="text-gray-400 max-w-2xl font-medium text-lg italic leading-relaxed">
                        {parentCategory.description || `Khám phá các dịch vụ và tài khoản cực phẩm của ${parentCategory.name} tại hệ thống.`}
                    </p>
                </div>
            </section>

            {/* Sub-Categories Grid - The 2 Columns Layout */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {subCategories.map((item) => {
                            const itemProducts = products.filter(p => p.category === item.name);
                            const minPrice = itemProducts.length > 0 ? Math.min(...itemProducts.map(p => p.price)) : 0;
                            const total = itemProducts.length;

                            // Determine target path based on category type
                            let targetPath = `/shop?category=${item.name}`;
                            if (item.type === 'wheel') targetPath = `/luckywheel`;
                            if (item.type === 'random') targetPath = `/shop?category=${item.name}&mode=random`;

                            return (
                                <Link
                                    key={item._id}
                                    to={targetPath}
                                    className="group bg-secondary/5 border border-white/5 rounded-[2rem] overflow-hidden hover:border-accent/40 hover:bg-secondary/10 transition-all duration-500 flex flex-col md:flex-row shadow-2xl animate-in fade-in slide-in-from-bottom-10"
                                >
                                    <div className="w-full md:w-48 lg:w-56 shrink-0 aspect-[16/9] md:aspect-square overflow-hidden relative">
                                        <img
                                            src={item.image || (itemProducts[0]?.images[0]) || 'https://via.placeholder.com/400x400?text=GAME'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />

                                        {/* Status Tag Overlay for Image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                {/* Status Tag */}
                                                {item.type !== 'wheel' ? (
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Còn {total} tài khoản</span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block animate-pulse">🔥 Đang Hot</span>
                                                )}

                                                <h4 className="text-xl md:text-2xl font-black text-white group-hover:text-accent transition uppercase italic tracking-tighter mb-2">
                                                    {item.name}
                                                </h4>

                                                <div className="text-2xl font-black text-white italic tracking-tighter">
                                                    <span className="text-[9px] text-slate-500 tracking-[0.1em] font-black uppercase mr-2 italic">
                                                        {item.type === 'wheel' ? 'Giá quay:' : 'Giá từ:'}
                                                    </span>
                                                    <span className="text-accent">
                                                        {minPrice > 0 ? minPrice.toLocaleString('vi-VN') : '---'}
                                                    </span>
                                                    {minPrice > 0 && <span className="text-sm ml-1">đ</span>}
                                                </div>
                                            </div>

                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 self-end sm:self-center">
                                                <span className="text-2xl italic">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GameDetail;
