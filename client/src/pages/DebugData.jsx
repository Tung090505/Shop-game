import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../api';

const DebugData = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const load = async () => {
            const [prodRes, catRes] = await Promise.all([
                fetchProducts(),
                fetchCategories()
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-primary p-8 text-white">
            <h1 className="text-3xl font-bold mb-8">DEBUG DATA</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Categories ({categories.length})</h2>
                <div className="bg-secondary p-4 rounded overflow-auto">
                    <pre>{JSON.stringify(categories, null, 2)}</pre>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
                <div className="bg-secondary p-4 rounded overflow-auto">
                    <pre>{JSON.stringify(products, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default DebugData;
