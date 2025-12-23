import React, { useState, useEffect } from 'react';

const GlobalWidgets = () => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    // Dữ liệu mẫu cho thông báo xã hội
    const activities = [
        { name: 'Tùng Lê', action: 'vừa mua thành công', item: 'Acc Liên Quân #1293' },
        { name: 'Hoàng Minh', action: 'vừa nạp', item: '20,000đ từ MB Bank' },
        { name: 'Văn Nam', action: 'vừa mua thành công', item: 'Acc TFT #4562' },
        { name: 'Anh Tú', action: 'vừa nạp', item: '50,000đ qua Thẻ cào' },
        { name: 'Quốc Bảo', action: 'vừa mua thành công', item: 'Acc Free Fire #8822' },
        { name: 'Minh Tuấn', action: 'vừa nạp', item: '10,000đ từ Vietcombank' },
        { name: 'Gia Bảo', action: 'vừa mua thành công', item: 'Acc Liên Quân #7732' },
        { name: 'Ngọc Ánh', action: 'vừa nạp', item: '10,000đ từ Techcombank' },
        { name: 'Hữu Thắng', action: 'vừa mua thành công', item: 'Acc LOL #2231' },
        { name: 'Thế Vinh', action: 'vừa nạp', item: '50,000đ qua Thẻ cào' },
        { name: 'Trọng Hiếu', action: 'vừa mua thành công', item: 'Acc Free Fire #1102' },
        { name: 'Duy Mạnh', action: 'vừa nạp', item: '100,000đ từ ACB Bank' },
        { name: 'Kim Ngân', action: 'vừa nạp', item: '200,000đ qua Thẻ cào ' },
        { name: 'Hoàng Long', action: 'vừa mua thành công', item: 'Acc Liên Quân #9001' },
        { name: 'Tiến Dũng', action: 'vừa nạp', item: '150,000đ từ TP Bank' },
    ];

    useEffect(() => {
        const showRandomNotification = () => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            setNotification(randomActivity);
            setIsVisible(true);

            // Ẩn sau 5s
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Chạy lần đầu sau 10s
        const initialTimeout = setTimeout(showRandomNotification, 10000);

        // Lặp lại mỗi 25-40s
        const interval = setInterval(() => {
            showRandomNotification();
        }, Math.random() * (40000 - 25000) + 25000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            {/* Social Proof Notification */}
            <div className={`fixed bottom-8 left-8 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-[#0f172a] border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xs backdrop-blur-xl">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl shrink-0">
                        {notification?.item.includes('nạp') ? '💰' : notification?.item.includes('Acc') ? '🎮' : '🎁'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] font-black text-white uppercase italic truncate">
                            {notification?.name} <span className="text-accent">{notification?.action}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">
                            {notification?.item}
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Support Column */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
                {/* Zalo Button */}
                <a
                    href="https://zalo.me/0869024105"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center justify-center w-14 h-14 bg-[#0068FF] rounded-2xl shadow-[0_0_20px_rgba(0,104,255,0.4)] hover:scale-110 transition-all duration-300 animate-bounce-slow"
                >
                    <span className="text-white font-black text-xs">Zalo</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-primary animate-ping"></div>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 px-4 py-2 bg-white text-black text-[10px] font-black uppercase rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                        Hỗ trợ Zalo 24/7
                    </div>
                </a>

                {/* Facebook Button */}
                <a
                    href="https://www.facebook.com/Ryon05"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center justify-center w-14 h-14 bg-[#1877F2] rounded-2xl shadow-[0_0_20px_rgba(24,119,242,0.4)] hover:scale-110 transition-all duration-300"
                >
                    <span className="text-white font-black text-xl italic leading-none">f</span>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 px-4 py-2 bg-white text-black text-[10px] font-black uppercase rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                        Chat Facebook
                    </div>
                </a>

                {/* Messenger/Phone Button */}
                <a
                    href="tel:0335028503"
                    className="group relative flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-accent hover:border-accent transition-all duration-300"
                >
                    <span className="text-xl">📞</span>
                    <div className="absolute right-full mr-4 px-4 py-2 bg-white text-black text-[10px] font-black uppercase rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                        Gọi Hotline
                    </div>
                </a>
            </div>

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};

export default GlobalWidgets;
