import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Deposit = () => {
    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('bank');
    const [depositCode, setDepositCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // State cho thẻ cào
    const [cardType, setCardType] = useState('VIETTEL');
    const [declaredAmount, setDeclaredAmount] = useState('10000');
    const [serial, setSerial] = useState('');
    const [pin, setPin] = useState('');

    const CARD_PROVIDERS = [
        { id: 'VIETTEL', name: 'Viettel', color: 'bg-red-600' },
        { id: 'MOBIFONE', name: 'Mobifone', color: 'bg-blue-600' },
        { id: 'VINAPHONE', name: 'Vinaphone', color: 'bg-blue-400' },
        { id: 'ZING', name: 'Zing', color: 'bg-orange-500' },
    ];

    const CARD_AMOUNTS = ['10000', '20000', '30000', '50000', '100000', '200000', '300000', '500000', '1000000'];

    // Cấu hình ngân hàng chuẩn (Sử dụng mã BIN 970422 cho MB Bank)
    const BANK_CONFIG = {
        bankId: '970422',
        accountNo: '0869024105',
        accountName: 'PHAM THANH TUNG',
    };

    // Tạo mã nạp ngẫu nhiên khi vào trang
    useEffect(() => {
        const randomStr = Math.floor(100000 + Math.random() * 900000);
        setDepositCode(`NAP${randomStr}`);
    }, []);

    const transferContent = depositCode;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Xử lý nạp Bank/Momo
        if (method !== 'card') {
            if (!amount) {
                toast.error('Vui lòng nhập số tiền muốn nạp');
                return;
            }

            if (Number(amount) < 10000) {
                toast.error('Số tiền nạp tối thiểu là 10.000đ');
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/deposits/submit', {
                    amount: Number(amount),
                    method,
                    transactionId: depositCode
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Sử dụng API VietQR trực tiếp - Tốc độ cao và ổn định hơn
                const url = `https://api.vietqr.io/${BANK_CONFIG.bankId}/${BANK_CONFIG.accountNo}/${amount}/${depositCode}/vietqr_net_2.jpg?accountName=${encodeURIComponent(BANK_CONFIG.accountName)}&t=${Date.now()}`;
                setQrUrl(url);
                setIsSubmitted(true);
                toast.success('Đã tạo yêu cầu! Vui lòng quét mã QR để chuyển khoản.');

            } catch (err) {
                toast.error(err.response?.data?.message || 'Gửi yêu cầu thất bại');
            } finally {
                setLoading(false);
            }
        }
        // Xử lý nạp Thẻ cào
        else {
            if (!serial || !pin) {
                toast.error('Vui lòng nhập đầy đủ serial và mã thẻ');
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post('http://localhost:5000/api/deposits/submit', {
                    amount: Number(declaredAmount),
                    method: 'card',
                    transactionId: `CARD_${Date.now()}`,
                    cardDetails: {
                        type: cardType,
                        serial,
                        pin,
                        declaredAmount: Number(declaredAmount)
                    }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                toast.success('Gửi thẻ thành công! Vui lòng chờ hệ thống kiểm tra (1-3 phút)');
                setSerial('');
                setPin('');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Gửi thẻ thất bại');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setAmount('');
        setQrUrl('');
        setDepositCode(`NAP${Math.floor(100000 + Math.random() * 900000)}`);
    };

    return (
        <div className="min-h-screen bg-primary py-20 pb-32">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
                        NẠP TIỀN <span className="text-accent">DỊCH VỤ</span>
                    </h1>
                    <div className="h-1 w-24 bg-accent rounded-full mb-6"></div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">An toàn • Bảo mật • Tự động</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Select & Info */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Selector */}
                        <div className="bg-secondary/40 backdrop-blur-xl p-3 rounded-[2rem] border border-white/5 flex flex-wrap gap-2">
                            <button
                                onClick={() => !isSubmitted && setMethod('bank')}
                                className={`flex-1 min-w-[140px] py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 ${method === 'bank' ? 'bg-accent text-white shadow-2xl shadow-accent/20' : 'text-slate-500 hover:text-slate-300'} ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-xl">🏦</span> Ngân Hàng
                            </button>
                            <button
                                onClick={() => !isSubmitted && setMethod('momo')}
                                className={`flex-1 min-w-[140px] py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 ${method === 'momo' ? 'bg-[#a50064] text-white shadow-2xl shadow-pink-500/20' : 'text-slate-500 hover:text-slate-300'} ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-xl">🧠</span> MoMo
                            </button>
                            <button
                                onClick={() => !isSubmitted && setMethod('card')}
                                className={`flex-1 min-w-[140px] py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 ${method === 'card' ? 'bg-orange-600 text-white shadow-2xl shadow-orange-500/20' : 'text-slate-500 hover:text-slate-300'} ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-xl">💳</span> Thẻ Cào
                            </button>
                        </div>

                        {/* Input Area */}
                        {!localStorage.getItem('token') ? (
                            <div className="bg-secondary/40 backdrop-blur-xl p-16 rounded-[3rem] border border-white/5 shadow-2xl text-center">
                                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
                                <h2 className="text-2xl font-black text-white uppercase mb-4 italic">Yêu cầu đăng nhập</h2>
                                <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">Bạn cần đăng nhập để thực hiện nạp tiền vào tài khoản</p>
                                <a href="/login" className="inline-block bg-accent hover:bg-accent-hover text-white font-black px-10 py-4 rounded-2xl transition shadow-xl shadow-accent/20 uppercase italic tracking-widest">Đăng nhập ngay</a>
                            </div>
                        ) : (
                            <div className="bg-secondary/40 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-black text-white uppercase italic flex items-center leading-none">
                                        <span className="w-2 h-6 bg-accent mr-4 rounded-full"></span>
                                        {method === 'card' ? 'Thông tin nạp thẻ cào' : 'Thông tin nạp tiền'}
                                    </h2>
                                    {(isSubmitted && method !== 'card') && (
                                        <button
                                            onClick={handleReset}
                                            className="text-[10px] text-accent font-black uppercase tracking-tighter hover:underline"
                                        >
                                            Làm mới / Nạp tiếp
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {method === 'card' ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                            {/* Chọn nhà mạng */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Loại thẻ</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {CARD_PROVIDERS.map((provider) => (
                                                        <button
                                                            key={provider.id}
                                                            type="button"
                                                            onClick={() => setCardType(provider.id)}
                                                            className={`py-3 rounded-2xl font-black text-xs transition-all border ${cardType === provider.id ? 'bg-white/10 text-white border-accent' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300'}`}
                                                        >
                                                            {provider.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Chọn mệnh giá */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mệnh giá</label>
                                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                                    {CARD_AMOUNTS.map((amt) => (
                                                        <button
                                                            key={amt}
                                                            type="button"
                                                            onClick={() => setDeclaredAmount(amt)}
                                                            className={`py-3 rounded-xl font-black text-[10px] transition-all border ${declaredAmount === amt ? 'bg-accent/20 text-accent border-accent/40' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300'}`}
                                                        >
                                                            {Number(amt).toLocaleString('vi-VN')}đ
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-yellow-500/70 font-bold italic">* Chú ý: Chọn sai mệnh giá có thể mất thẻ.</p>
                                            </div>

                                            {/* Serial & Code */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Số Serial</label>
                                                    <input
                                                        type="text"
                                                        value={serial}
                                                        onChange={(e) => setSerial(e.target.value)}
                                                        placeholder="Nhập số serial..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-sm outline-none focus:border-accent transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mã thẻ (Pin)</label>
                                                    <input
                                                        type="text"
                                                        value={pin}
                                                        onChange={(e) => setPin(e.target.value)}
                                                        placeholder="Nhập mã thẻ..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-sm outline-none focus:border-accent transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl">
                                                <div className="flex items-center gap-3 text-orange-500 mb-2">
                                                    <span className="text-lg">🔥</span>
                                                    <span className="text-[11px] font-black uppercase tracking-wider">Ưu đãi nạp thẻ</span>
                                                </div>
                                                <p className="text-slate-400 text-[10px] leading-relaxed uppercase font-bold tracking-tight">Chiết khấu hệ thống: <b>20%</b>. Bạn sẽ nhận được <b>{(Number(declaredAmount) * 0.8).toLocaleString('vi-VN')}đ</b> vào tài khoản.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Bước 1: Nhập số tiền muốn nạp (đ)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={amount}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '');
                                                            setAmount(val);
                                                        }}
                                                        placeholder="VD: 10000"
                                                        disabled={isSubmitted}
                                                        className={`w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-black text-2xl outline-none focus:border-accent transition-all shadow-inner placeholder:text-slate-700 ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        required
                                                    />
                                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600 font-black italic uppercase text-lg">VNĐ</span>
                                                </div>
                                                {amount && (
                                                    <div className="ml-2 mt-2 flex items-center gap-2 animate-pulse">
                                                        <span className="text-[15px] text-slate-500 font-bold uppercase tracking-widest leading-none">~</span>
                                                        <span className="text-emerald-400 font-black text-sm italic tracking-tight">
                                                            {Number(amount).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {isSubmitted && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Chủ tài khoản</span>
                                                        <span className="text-white font-black text-lg uppercase italic tracking-tight">{BANK_CONFIG.accountName}</span>
                                                    </div>
                                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-accent/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                                        <div className="relative z-10">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Bước 2: Nội dung chuyển khoản</span>
                                                            <div className="flex items-center justify-between pointer-events-none">
                                                                <span className="text-accent font-black text-2xl italic tracking-tighter">{transferContent}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(transferContent); toast.success('Đã copy nội dung'); }}
                                                                    className="bg-accent text-white px-4 py-2 rounded-xl font-black text-[10px] hover:scale-110 active:scale-95 transition-all shadow-lg shadow-accent/20 pointer-events-auto"
                                                                >
                                                                    COPY
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-3xl">
                                                <p className="text-yellow-500 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
                                                    ⚠️ <span className="ml-1">Lưu ý:</span> {isSubmitted ? `Bạn phải nhập chính xác nội dung chuyển khoản là ${transferContent} để hệ thống có thể xác minh tiền của bạn.` : 'Vui lòng điền số tiền và nhấn nút bên dưới để nhận Mã QR và thông tin chuyển khoản.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || (method !== 'card' && (!amount || isSubmitted))}
                                        className={`w-full font-black py-6 rounded-[2rem] shadow-2xl transition-all duration-300 uppercase italic tracking-[0.2em] text-lg disabled:opacity-50 disabled:cursor-not-allowed group ${method === 'card' ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20' : 'bg-accent hover:bg-accent-hover shadow-accent/40'}`}
                                    >
                                        <span className="group-hover:tracking-[0.3em] transition-all duration-300">
                                            {loading ? 'Hệ thống đang xử lý...' : method === 'card' ? 'Nạp thẻ ngay' : isSubmitted ? 'Vui lòng quét mã và chuyển tiền' : 'Tạo mã QR nạp tiền'}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Side: QR Code Area / Card Tips */}
                    <div className="lg:col-span-5 h-full">
                        {method === 'card' ? (
                            <div className="bg-secondary/40 backdrop-blur-xl p-10 rounded-[4rem] border border-white/5 shadow-2xl h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                                    Lưu ý <span className="text-orange-600">nạp thẻ</span>
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 font-black text-orange-600 italic">01</div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">Nhập chính xác số serial và mã thẻ, chọn đúng nhà mạng.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 font-black text-orange-600 italic">02</div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">Chọn đúng mệnh giá, chọn sai sẽ bị mất thẻ hoặc bị phạt 50% giá trị.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 font-black text-orange-600 italic">03</div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">Hệ thống xử lý tự động từ 1-5 phút tùy thuộc vào nhà mạng.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 font-black text-orange-600 italic">04</div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">Thẻ zing và thẻ cào điện thoại đều có mức chiết khấu riêng theo từng thời điểm.</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-10">
                                    <div className="bg-white/5 p-6 rounded-3xl border border-dashed border-white/10 text-center">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Cần hỗ trợ gấp?</p>
                                        <p className="text-white font-black uppercase italic tracking-widest text-sm hover:text-accent cursor-pointer transition">Liên hệ Fanpage Ngay</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-secondary/40 backdrop-blur-xl p-10 rounded-[4rem] border border-white/5 shadow-2xl text-center relative overflow-hidden h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

                                {method === 'bank' ? (
                                    <>
                                        <h3 className="text-2xl font-black text-white uppercase italic mb-8">
                                            Quét Mã <span className="text-accent">VIETQR</span>
                                        </h3>

                                        <div className="relative group">
                                            <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                                            <div className="relative bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-white/10">
                                                {isSubmitted && qrUrl ? (
                                                    <img
                                                        key={qrUrl}
                                                        src={qrUrl}
                                                        onError={(e) => {
                                                            if (!e.target.src.includes('sepay.vn')) {
                                                                e.target.src = `https://qr.sepay.vn/img?bank=MBBank&acc=${BANK_CONFIG.accountNo}&amount=${amount}&des=${depositCode}&mem=1`;
                                                            }
                                                        }}
                                                        className="w-full max-w-[280px] mx-auto rounded-2xl animate-in zoom-in-75 duration-500"
                                                        alt="QR Nạp tiền"
                                                    />
                                                ) : (
                                                    <div className="w-[280px] h-[280px] flex items-center justify-center flex-col p-8 text-slate-300 text-center">
                                                        <span className="text-5xl mb-4 opacity-20">💰</span>
                                                        <p className="font-black uppercase text-[10px] tracking-widest leading-loose">Bấm nút "Tạo mã QR" <br /> để nhận mã nạp tiền</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-10 space-y-4">
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                                Hệ thống tự động ghi nhận sau khi chuyển khoản thành công
                                            </p>
                                            {isSubmitted && qrUrl && (
                                                <a
                                                    href={qrUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block mt-4 bg-accent/20 hover:bg-accent/30 text-accent font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-accent/30"
                                                >
                                                    Mở Mã QR Trong Tab Mới
                                                </a>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-[#a50064]/20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-2xl border border-pink-500/20">📱</div>
                                        <h3 className="text-2xl font-black text-white uppercase italic mb-4">Ví <span className="text-pink-500">MoMo</span></h3>
                                        {isSubmitted ? (
                                            <div className="w-full space-y-3 animate-in fade-in duration-500">
                                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-pink-500/30 transition">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SĐT MoMo</span>
                                                    <span className="text-white font-black text-lg tracking-widest">0987654321</span>
                                                </div>
                                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-pink-500/30 transition">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nội dung</span>
                                                    <span className="text-pink-500 font-black text-lg">{depositCode}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 font-bold mb-8 max-w-xs mx-auto text-sm leading-relaxed uppercase tracking-wider">Bấm nút tạo mã nạp tiền để nhận thông tin chuyển khoản MoMo</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deposit;
