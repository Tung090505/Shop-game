import React from 'react';

const AnnouncementBar = () => {
    return (
        <div className="bg-accent/10 border-b border-white/5 py-2.5 overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center space-x-12 px-6">
                        <span className="text-[10px] font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                            CHÀO MỪNG BẠN ĐẾN VỚI SHOPNICK - HỆ THỐNG MUA BÁN ACC GAME TỰ ĐỘNG 24/7
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                            KHUYẾN MÃI: NẠP THẺ +20% GIÁ TRỊ - NẠP BANK +25% GIÁ TRỊ
                        </span>
                        <span className="text-[10px] font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            HỆ THỐNG CỘNG TÁC VIÊN CHÍNH THỨC RA MẮT - NHẬN 5% HOA HỒNG TRỌN ĐỜI
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default AnnouncementBar;
