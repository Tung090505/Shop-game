import React, { useState } from 'react';
import API from '../api';

const FixImageUrls = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFix = async () => {
        if (!window.confirm('Bạn có chắc muốn fix tất cả image URLs trong database?')) {
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await API.post('/maintenance/fix-image-urls');
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary text-text-main p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-white mb-8">🔧 Fix Image URLs</h1>

                <div className="bg-secondary border border-white/10 rounded-2xl p-8 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Vấn đề:</h2>
                    <p className="text-gray-400 mb-4">
                        Một số ảnh trong database có URL trỏ về <code className="bg-black/50 px-2 py-1 rounded">localhost:5000</code>
                        nên khi deploy lên production sẽ không hiển thị được.
                    </p>
                    <h2 className="text-xl font-bold text-white mb-4">Giải pháp:</h2>
                    <p className="text-gray-400 mb-6">
                        Tool này sẽ tự động chuyển tất cả URL dạng <code className="bg-black/50 px-2 py-1 rounded">http://localhost:5000/uploads/...</code>
                        thành <code className="bg-black/50 px-2 py-1 rounded">/uploads/...</code> để hệ thống tự động nhận diện đúng server.
                    </p>

                    <button
                        onClick={handleFix}
                        disabled={loading}
                        className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Đang xử lý...' : '🚀 Fix Ngay'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 mb-6">
                        <h3 className="text-red-500 font-bold text-lg mb-2">❌ Lỗi</h3>
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-6">
                        <h3 className="text-green-500 font-bold text-lg mb-4">✅ Thành công!</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/30 rounded-xl p-4">
                                <div className="text-3xl font-black text-white">{result.results.categoriesFixed}</div>
                                <div className="text-sm text-gray-400">Categories đã fix</div>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4">
                                <div className="text-3xl font-black text-white">{result.results.productsFixed}</div>
                                <div className="text-sm text-gray-400">Products đã fix</div>
                            </div>
                        </div>

                        {result.results.details.length > 0 && (
                            <div>
                                <h4 className="text-white font-bold mb-3">Chi tiết:</h4>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {result.results.details.map((item, index) => (
                                        <div key={index} className="bg-black/30 rounded-lg p-3 text-sm">
                                            <div className="text-accent font-bold mb-1">
                                                {item.type === 'category' ? '📁' : '📦'} {item.name}
                                            </div>
                                            <div className="text-gray-500 break-all">
                                                <span className="text-red-400">❌ {item.oldUrl}</span>
                                            </div>
                                            <div className="text-gray-400 break-all">
                                                <span className="text-green-400">✅ {item.newUrl}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FixImageUrls;
