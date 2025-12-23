import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, createOrder, fetchProfile, fetchProducts } from '../api';
import * as api from '../api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await fetchProductById(id);
                setProduct(res.data);

                // Fetch related products (same category)
                if (res.data.category) {
                    const relatedRes = await api.fetchProducts({ category: res.data.category });
                    setRelatedProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
                }
            } catch (err) {
                toast.error('Không tìm thấy sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleBuy = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để mua hàng');
            navigate('/login');
            return;
        }

        if (user.balance < product.price) {
            toast.error('Số dư không đủ, vui lòng nạp thêm');
            navigate('/topup');
            return;
        }

        setBuying(true);
        try {
            await createOrder(product._id);

            // Refresh Profile
            const userRes = await fetchProfile();
            setUser(userRes.data);

            toast.success('Mua hàng thành công! Đang chuyển đến kho tài khoản của bạn.');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi mua hàng');
        } finally {
            setBuying(false);
            setShowConfirm(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Đang tải dữ liệu tài khoản...</p>
        </div>
    );

    if (!product) return <div className="text-center text-white py-20 font-black">KHÔNG TÌM THẤY SẢN PHẨM</div>;

    return (
        <div className="min-h-screen bg-primary py-24 pb-40">
            <SEO
                title={`${product.title} | ShopNickTFT`}
                description={`Mua ngay tài khoản ${product.title} giá tốt nhất tại ShopNickTFT. Giao dịch tự động 24/7.`}
            />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-3 mb-8 text-[10px] font-black uppercase tracking-[0.2em] italic">
                    <span className="text-slate-500 cursor-pointer hover:text-white transition" onClick={() => navigate('/')}>TRANG CHỦ</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-slate-500 cursor-pointer hover:text-white transition" onClick={() => navigate('/shop')}>CỬA HÀNG</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-accent">{product.title}</span>
                </div>

                {/* Product Section */}
                <div className="bg-secondary/40 backdrop-blur-2xl rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative mb-20">
                    {/* Glowing Orbs */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mt-48"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-48 -mb-48"></div>

                    {/* Left: Images */}
                    <div className="lg:w-1/2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 relative bg-white/[0.01]">
                        <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl aspect-[16/9]">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {product.images?.slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square rounded-2xl border border-white/5 overflow-hidden hover:border-accent transition cursor-pointer">
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-white/5 border border-white/10 text-slate-400 font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest italic leading-none">
                                    {product.category}
                                </span>
                                {product.status === 'available' ? (
                                    <span className="bg-green-500/10 text-green-500 font-black text-[10px] px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest italic leading-none flex items-center">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-ping"></span> ĐANG BÁN
                                    </span>
                                ) : (
                                    <span className="bg-red-500/10 text-red-500 font-black text-[10px] px-4 py-1.5 rounded-full border border-red-500/20 uppercase tracking-widest italic leading-none">
                                        ĐÃ BÁN
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white hover:text-accent transition-colors leading-tight uppercase italic tracking-tighter mb-6">{product.title}</h1>

                            <div className="flex items-center gap-6 mb-10">
                                <span className="text-5xl font-black text-accent italic tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    {product.price?.toLocaleString('vi-VN')}đ
                                </span>
                                {product.oldPrice > 0 && (
                                    <span className="text-2xl text-slate-600 font-bold line-through italic decoration-red-500/30">
                                        {product.oldPrice?.toLocaleString('vi-VN')}đ
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed uppercase tracking-widest line-clamp-3">
                                {product.description || "Tài khoản chơi Game cực đỉnh, thông tin sạch sẽ, bảo hành trọn đời tại hệ thống ShopNickTFT. Giao dịch hoàn toàn tự động."}
                            </p>
                        </div>

                        {/* Attributes Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-12">
                            {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                                <div key={key} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                                    <span className="block text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1 italic opacity-60 group-hover:opacity-100 transition-opacity">{key}</span>
                                    <span className="text-white font-black text-lg italic tracking-tight uppercase">{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5">
                            {product.status === 'available' ? (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="w-full bg-accent hover:bg-accent-hover text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-accent/40 transition-all duration-500 uppercase italic tracking-[0.2em] text-xl flex items-center justify-center group"
                                >
                                    MUA NGAY <span className="ml-3 text-2xl group-hover:translate-x-2 transition-transform">→</span>
                                </button>
                            ) : (
                                <button disabled className="w-full bg-slate-800 text-slate-500 font-black py-7 rounded-[2.5rem] cursor-not-allowed uppercase italic tracking-widest text-xl">
                                    SẢN PHẨM ĐÃ HẾT HÀNG
                                </button>
                            )}
                            <div className="flex items-center justify-center gap-6 mt-8 opacity-40">
                                <div className="text-[10px] text-white font-black uppercase tracking-widest flex items-center leading-none">🛡️ Bảo hành 100%</div>
                                <div className="text-[10px] text-white font-black uppercase tracking-widest flex items-center leading-none">🚀 Nhận acc ngay</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <p className="text-accent font-black uppercase text-[10px] tracking-[0.3em] mb-2">Gợi ý dành riêng cho bạn</p>
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">TÀI KHOẢN <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">TƯƠNG TỰ</span></h2>
                            </div>
                            <button
                                onClick={() => navigate('/shop')}
                                className="hidden md:block bg-white/5 hover:bg-white/10 text-white font-black text-[10px] px-8 py-4 rounded-2xl border border-white/10 uppercase italic tracking-widest transition"
                            >
                                XEM TẤT CẢ
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <div
                                    key={p._id}
                                    onClick={() => { navigate(`/product/${p._id}`); window.scrollTo(0, 0); }}
                                    className="bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer"
                                >
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-white font-black uppercase italic tracking-tighter text-lg truncate group-hover:text-accent transition">{p.title}</h3>
                                        <p className="text-accent font-black text-xl italic mt-2">{p.price?.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-primary/95 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => !buying && setShowConfirm(false)}
                    ></div>

                    <div className="relative bg-secondary p-10 md:p-14 rounded-[4rem] border border-white/10 shadow-2xl max-w-lg w-full text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-2xl shadow-accent/20">💰</div>

                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Xác nhận thanh toán</h2>
                        <p className="text-slate-500 font-bold mb-10 leading-relaxed uppercase tracking-widest text-xs px-4">
                            Bạn có chắc chắn muốn mua <span className="text-white">{product.title}</span> với giá <span className="text-accent">{product.price.toLocaleString('vi-VN')}đ</span>?
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleBuy}
                                disabled={buying}
                                className="w-full bg-accent hover:bg-accent-hover text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-accent/30 transition-all duration-300 uppercase italic tracking-widest disabled:opacity-50"
                            >
                                {buying ? 'Đang thực hiện thanh toán...' : 'ĐỒNG Ý THANH TOÁN'}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={buying}
                                className="w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-black py-6 rounded-[2rem] transition-all uppercase italic tracking-widest text-xs"
                            >
                                HỦY GIAO DỊCH
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
