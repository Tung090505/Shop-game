import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: categoryParam,
        minPrice: 0,
        maxPrice: 10000000
    });

    useEffect(() => {
        setFilters(prev => ({ ...prev, category: categoryParam }));
    }, [categoryParam]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/products', {
                params: filters
            });
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-primary py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="sticky top-28">
                            <FilterSidebar setFilters={setFilters} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4">
                        {/* Search & Header */}
                        <div className="bg-secondary/50 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                                    CỬA HÀNG <span className="text-accent">TÀI KHOẢN</span>
                                </h1>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">Tìm thấy {filteredProducts.length} kết quả phù hợp</p>
                            </div>
                            <div className="relative md:w-80">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-primary border border-white/10 rounded-2xl px-6 py-4 pl-12 focus:border-accent outline-none transition text-white font-medium placeholder:text-gray-600"
                                />
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]"></div>
                                <span className="text-accent font-black uppercase italic tracking-widest">Đang tải dữ liệu...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {!loading && filteredProducts.length === 0 && (
                            <div className="bg-secondary/30 rounded-[3rem] p-24 text-center border border-white/5 backdrop-blur-sm">
                                <span className="text-8xl mb-8 block grayscale opacity-50">🔍</span>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Không tìm thấy tài khoản</h3>
                                <p className="text-gray-500 mt-4 font-medium">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setFilters({ category: '', minPrice: 0, maxPrice: 10000000 }) }}
                                    className="mt-10 bg-white/5 hover:bg-white/10 text-accent px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest border border-white/10 transition"
                                >
                                    XÓA TẤT CẢ BỘ LỌC
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
