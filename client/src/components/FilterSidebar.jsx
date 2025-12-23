import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories } from '../api';

const FilterSidebar = ({ setFilters }) => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category') || '';

    const [category, setCategory] = useState(categoryParam);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data);
            } catch (err) {
                console.error('Không thể tải danh mục');
            }
        };
        loadCategories();
    }, []);

    const handleFilter = () => {
        setFilters({ category, minPrice, maxPrice });
    };

    return (
        <div className="bg-secondary/50 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 border-l-4 border-accent pl-4">Bộ Lọc</h2>

            <div className="space-y-8">
                {/* Category */}
                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Danh mục game</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-primary border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-accent transition appearance-none cursor-pointer"
                    >
                        <option value="">Tất cả game</option>
                        {categories
                            .map(cat => {
                                const parentName = cat.parent ? (categories.find(c => c._id === (cat.parent?._id || cat.parent))?.name) : null;
                                return (
                                    <option key={cat._id} value={cat.name}>
                                        {parentName ? `${parentName} > ` : ''}{cat.name}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Khoảng giá (VNĐ)</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-primary border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-accent transition"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-primary border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-accent transition"
                        />
                    </div>
                </div>

                <button
                    onClick={handleFilter}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-black py-5 rounded-2xl shadow-lg shadow-accent/20 transition-all duration-300 uppercase italic tracking-widest"
                >
                    ÁP DỤNG BỘ LỌC
                </button>

                <button
                    onClick={() => {
                        setCategory('');
                        setMinPrice(0);
                        setMaxPrice(10000000);
                        setFilters({ category: '', minPrice: 0, maxPrice: 10000000 });
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-2xl border border-white/10 transition uppercase text-xs tracking-widest"
                >
                    XÓA BỘ LỌC
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
