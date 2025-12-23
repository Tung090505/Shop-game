import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchPrizes, spinWheel } from '../api';
import toast from 'react-hot-toast';

const LuckyWheel = () => {
    const { user, fetchProfile, setUser } = useContext(AuthContext);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [prizes, setPrizes] = useState([]);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef(null);

    const SPIN_COST = 20000; // Updated to 20k VND

    useEffect(() => {
        const loadPrizes = async () => {
            try {
                const res = await fetchPrizes();
                if (Array.isArray(res.data)) {
                    setPrizes(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch prizes', err);
            }
        };
        loadPrizes();
    }, []);

    const spin = async () => {
        if (spinning || prizes.length === 0) return;
        if (!user) {
            toast.error('Vui lòng đăng nhập để quay!');
            return;
        }
        if (user.balance < SPIN_COST) {
            toast.error('Số dư không đủ! Vui lòng nạp thêm.');
            return;
        }

        setSpinning(true);
        setResult(null);

        try {
            const res = await spinWheel();

            // Deduct cost immediately in UI
            setUser(prev => ({ ...prev, balance: prev.balance - SPIN_COST }));

            const prizeIndex = prizes.findIndex(p => p._id === res.data.prize._id);

            if (prizeIndex === -1) {
                setSpinning(false);
                toast.error('Có lỗi xảy ra, vui lòng thử lại!');
                return;
            }

            const segmentAngle = 360 / prizes.length;
            // Calculate rotation to stop at the middle of the segment
            const extraRotation = (360 * 10); // 10 full spins
            const stoppingPoint = (360 - (prizeIndex * segmentAngle)) - (segmentAngle / 2);
            const totalRotation = rotation + extraRotation + (stoppingPoint - (rotation % 360));

            setRotation(totalRotation);

            setTimeout(() => {
                setSpinning(false);
                setResult(res.data.message);
                fetchProfile();
                toast.success(res.data.message, {
                    duration: 5000,
                    icon: '🎁',
                    style: {
                        background: '#1e1b4b',
                        color: '#fff',
                        borderRadius: '1rem',
                        border: '1px solid #4338ca'
                    }
                });
            }, 5000);

        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi hệ thống');
            setSpinning(false);
        }
    };

    return (
        <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] p-12 border border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center mb-12">
                <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Premium Rewards</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-3 uppercase italic tracking-normal leading-[1.5] py-4">
                    QUAY TRỨNG <br className="md:hidden" />
                    <span className="inline-block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 py-2 px-4">
                        MAY MẮN
                    </span>
                </h2>
                <div className="flex items-center justify-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <span className="h-px w-8 bg-slate-800"></span>
                    Chỉ <span className="text-amber-400 font-black">{SPIN_COST.toLocaleString('vi-VN')}đ</span> / Lượt
                    <span className="h-px w-8 bg-slate-800"></span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                    {/* Artistic Outer Frame */}
                    <div className="absolute inset-[-20px] rounded-full border border-white/5 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="absolute inset-[-40px] rounded-full border border-white/[0.02] group-hover:scale-125 transition-transform duration-1000 delay-75"></div>

                    {/* The Glow Effect */}
                    <div className="absolute inset-[-10px] rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-amber-600/20 blur-2xl animate-pulse"></div>

                    {/* Pointer - Highly detailed */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 transform pointer-events-none">
                        <div className="relative flex flex-col items-center">
                            {/* Premium SVG Arrow Pointer */}
                            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_5px_15px_rgba(245,158,11,0.6)]">
                                <path d="M20 50L40 10C40 4.47715 35.5228 0 30 0H10C4.47715 0 0 4.47715 0 10L20 50Z" fill="url(#pointerGradient)" />
                                <defs>
                                    <linearGradient id="pointerGradient" x1="20" y1="0" x2="20" y2="50" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FBBF24" />
                                        <stop offset="1" stopColor="#D97706" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Artistic Reflection */}
                            <div className="absolute top-1 w-6 h-1 bg-white/40 rounded-full blur-[1px]"></div>
                        </div>
                    </div>

                    {/* Wheel Container */}
                    <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-[12px] border-slate-900 shadow-3xl bg-slate-900 overflow-hidden">
                        <div
                            className="w-full h-full transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                <defs>
                                    <filter id="innerGlow">
                                        <feFlood floodColor="black" floodOpacity="0.5" />
                                        <feComposite in2="SourceGraphic" operator="out" />
                                        <feGaussianBlur stdDeviation="1" />
                                        <feComposite operator="atop" in2="SourceGraphic" />
                                    </filter>
                                </defs>
                                {prizes.map((prize, index) => {
                                    const slice = 360 / prizes.length;
                                    const startAngle = index * slice;
                                    const endAngle = (index + 1) * slice;

                                    // Complex SVG path for wheel segment
                                    const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                                    const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                                    const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                                    const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                                    const textRotation = (startAngle + slice / 2);
                                    const flipText = textRotation > 90 && textRotation < 270;

                                    return (
                                        <g key={prize._id}>
                                            <path
                                                d={pathData}
                                                fill={prize.color}
                                                fillOpacity={0.15}
                                                className="transition-opacity duration-300 hover:fill-opacity-30"
                                                stroke="white"
                                                strokeOpacity="0.05"
                                                strokeWidth="0.2"
                                            />
                                            {/* Decorative lines */}
                                            <line x1="50" y1="50" x2={x1} y2={y1} stroke="white" strokeOpacity="0.1" strokeWidth="0.3" />

                                            {/* Prize Content */}
                                            <g transform={`rotate(${startAngle + slice / 2} 50 50)`}>
                                                <g transform={flipText ? `rotate(180 50 18.5)` : ""}>
                                                    <text
                                                        x="50"
                                                        y="15"
                                                        textAnchor="middle"
                                                        fill="white"
                                                        className="text-[4px] font-black uppercase italic tracking-tighter pointer-events-none select-none"
                                                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                                    >
                                                        {prize.name}
                                                    </text>
                                                    <text
                                                        x="50"
                                                        y="22"
                                                        textAnchor="middle"
                                                        fill={prize.color}
                                                        className="text-[2.5px] font-bold uppercase tracking-widest opacity-80 pointer-events-none select-none"
                                                    >
                                                        {prize.type === 'balance' ? 'VÀO VÍ VNĐ' : prize.type === 'product' ? 'ACC GAME' : 'MẤT LƯỢT'}
                                                    </text>
                                                </g>
                                            </g>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Center Hub */}
                        <div className="absolute inset-0 m-auto w-24 h-24 bg-slate-900 rounded-full border-8 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,1)] z-10 flex flex-col items-center justify-center">
                            <div className="text-[10px] font-black text-amber-500 italic tracking-tighter leading-none mb-1">SHOP</div>
                            <div className="text-[10px] font-black text-white italic tracking-tighter leading-none">TFT</div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/10 to-transparent animate-spin-slow"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 w-full max-w-sm">
                    <button
                        onClick={spin}
                        disabled={spinning}
                        className="relative w-full group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative bg-slate-900 border border-white/10 p-6 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
                            <span className="text-2xl font-black text-white uppercase italic tracking-[0.2em] transform group-hover:scale-110 transition-transform">
                                {spinning ? 'ĐANG KHỞI CHẠY...' : 'KÍCH HOẠT NGAY'}
                            </span>
                            <div className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>
                    </button>

                    <p className="text-center mt-6 text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                        Your balance: <span className="text-white">{(user?.balance || 0).toLocaleString('vi-VN')}đ</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LuckyWheel;

