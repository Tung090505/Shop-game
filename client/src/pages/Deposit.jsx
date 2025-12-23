import React, { useState, useContext, useEffect } from 'react';
import * as api from '../api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Deposit = () => {
    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('card');
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
        { id: 'VIETTEL', name: 'Viettel' },
        { id: 'MOBIFONE', name: 'Mobifone' },
        { id: 'VINAPHONE', name: 'Vinaphone' },
        { id: 'ZING', name: 'Zing' },
    ];

    const CARD_AMOUNTS = ['10000', '20000', '30000', '50000', '100000', '200000', '300000', '500000', '1000000'];

    const BANK_CONFIG = {
        bankId: '970422',
        accountNo: '0869024105',
        accountName: 'PHAM THANH TUNG',
    };

    useEffect(() => {
        const randomStr = Math.floor(100000 + Math.random() * 900000);
        setDepositCode(`NAP${randomStr}`);
    }, []);

    const transferContent = depositCode;

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                await api.submitDeposit({
                    amount: Number(amount),
                    method,
                    transactionId: depositCode
                });

                const url = `https://api.vietqr.io/${BANK_CONFIG.bankId}/${BANK_CONFIG.accountNo}/${amount}/${depositCode}/vietqr_net_2.jpg?accountName=${encodeURIComponent(BANK_CONFIG.accountName)}&t=${Date.now()}`;
                setQrUrl(url);
                setIsSubmitted(true);
                toast.success('Đã tạo yêu cầu! Vui lòng quét mã QR để chuyển khoản.');

            } catch (err) {
                console.error('Deposit Error:', err);
                const msg = err.response?.data?.message || err.message || 'Gửi yêu cầu thất bại';
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        } else {
            if (!serial || !pin) {
                toast.error('Vui lòng nhập đầy đủ serial và mã thẻ');
                return;
            }

            setLoading(true);
            try {
                await api.submitDeposit({
                    amount: Number(declaredAmount),
                    method: 'card',
                    transactionId: `CARD_${Date.now()}`,
                    cardDetails: {
                        type: cardType,
                        serial,
                        pin,
                        declaredAmount: Number(declaredAmount)
                    }
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
        <div className="min-h-screen bg-[#070b14] py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Method Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-[#121927] p-2 rounded-3xl flex gap-2 shadow-[0px_4px_px_rgba(0,0,0,0.5)] border border-[#1e293b]">
                        <button
                            onClick={() => !isSubmitted && setMethod('bank')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase italic text-sm transition-all duration-300 ${method === 'bank' ? 'bg-[#ff4d15] text-white shadow-[0px_4px_12px_#ff4d154d]' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <span className="text-xl">🏛️</span> NGÂN HÀNG
                        </button>

                        <button
                            onClick={() => !isSubmitted && setMethod('card')}
                            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold uppercase italic text-sm transition-all duration-300 ${method === 'card' ? 'bg-[#ff4d15] text-white shadow-[0px_4px_15px_#ff4d154d]' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <span className="text-xl">💳</span> THẺ CÀO
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#121927] rounded-[2rem] p-8 shadow-2xl border border-[#1e293b]">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-8 bg-[#6366f1] rounded-full shadow-[0px_0px_10px_#6366f1]"></div>
                                <h1 className="text-2xl font-black text-white uppercase italic tracking-wider">
                                    {method === 'card' ? 'THÔNG TIN NẠP THẺ CÀO' : 'THÔNG TIN NẠP TIỀN'}
                                </h1>
                            </div>

                            {!localStorage.getItem('token') ? (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
                                    <h2 className="text-xl font-bold text-white mb-4">Bạn chưa đăng nhập</h2>
                                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Vui lòng đăng nhập để thực hiện nạp tiền và nhận các ưu đãi hấp dẫn.</p>
                                    <a href="/login" className="px-10 py-4 bg-[#ff4d15] text-white rounded-2xl font-bold uppercase italic transition duration-300 shadow-xl shadow-[#ff4d154d] hover:-translate-y-1">Đăng nhập ngay</a>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {method === 'card' ? (
                                        <div className="space-y-8">
                                            {/* Card Provider */}
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[2px] block ml-1">LOẠI THẺ</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {CARD_PROVIDERS.map((provider) => (
                                                        <button
                                                            key={provider.id}
                                                            type="button"
                                                            onClick={() => setCardType(provider.id)}
                                                            className={`py-4 rounded-2xl font-black text-xs transition-all border-2 relative overflow-hidden group ${cardType === provider.id ? 'bg-[#1e293b] border-[#6366f1] text-white shadow-[0px_0px_15px_#6366f14d]' : 'bg-[#1a2333]/50 border-transparent text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}
                                                        >
                                                            {provider.name}
                                                            {cardType === provider.id && <div className="absolute top-0 right-0 w-8 h-8 bg-[#6366f1] shadow-[0px_0px_10px_#6366f1] translate-x-4 -translate-y-4 rotate-45"></div>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Card Amount */}
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[2px] block ml-1">MỆNH GIÁ</label>
                                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                                    {CARD_AMOUNTS.map((amt) => (
                                                        <button
                                                            key={amt}
                                                            type="button"
                                                            onClick={() => setDeclaredAmount(amt)}
                                                            className={`py-3.5 rounded-xl font-black text-[11px] transition-all border-2 ${declaredAmount === amt ? 'bg-[#1e293b] border-[#6366f1] text-[#6366f1] shadow-[0px_0px_10px_#6366f133]' : 'bg-[#1a2333]/50 border-transparent text-slate-500 hover:bg-[#1a2333] hover:text-slate-300'}`}
                                                        >
                                                            {Number(amt).toLocaleString('vi-VN')}đ
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-[#fbbf24] font-bold italic ml-1">* Chú ý: Chọn sai mệnh giá có thể mất thẻ.</p>
                                            </div>

                                            {/* Serial & Code */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[2px] block ml-1">SỐ SERIAL</label>
                                                    <input
                                                        type="text"
                                                        value={serial}
                                                        onChange={(e) => setSerial(e.target.value)}
                                                        placeholder="Nhập số serial..."
                                                        className="w-full bg-[#1a2333] border border-white/5 rounded-2xl px-6 py-4.5 text-white font-bold text-sm outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f133] transition-all placeholder:text-slate-700"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[2px] block ml-1">MÃ THẺ (PIN)</label>
                                                    <input
                                                        type="text"
                                                        value={pin}
                                                        onChange={(e) => setPin(e.target.value)}
                                                        placeholder="Nhập mã thẻ..."
                                                        className="w-full bg-[#1a2333] border border-white/5 rounded-2xl px-6 py-4.5 text-white font-bold text-sm outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f133] transition-all placeholder:text-slate-700"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Discount Banner */}
                                            <div className="bg-[#1e1515] border border-[#ff4e1533] p-5 rounded-2xl relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4e15]"></div>
                                                <div className="flex items-center gap-3 text-[#ff4e15] mb-2 font-black italic">
                                                    <span className="text-lg animate-pulse">🔥</span>
                                                    <span className="text-xs uppercase tracking-widest">ƯU ĐÃI NẠP THẺ</span>
                                                </div>
                                                <p className="text-slate-400 text-[11px] uppercase font-bold tracking-tight leading-loose">
                                                    CHIẾT KHẤU HỆ THỐNG: <span className="text-white">20%</span>. BẠN SẼ NHẬN ĐƯỢC <span className="text-[#ff4e15] italic">{(Number(declaredAmount) * 0.8).toLocaleString('vi-VN')}đ</span> VÀO TÀI KHOẢN.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 animate-in fade-in duration-500">
                                            <div className="space-y-4">
                                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[2px] block ml-1">NHẬP SỐ TIỀN MUỐN NẠP (VNĐ)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="VÍ DỤ: 100000"
                                                        disabled={isSubmitted}
                                                        className={`w-full bg-[#1a2333] border border-white/5 rounded-2xl px-8 py-6 text-white font-black text-3xl outline-none focus:border-[#6366f1] transition-all shadow-inner placeholder:text-slate-800 ${isSubmitted ? 'opacity-50' : ''}`}
                                                        required
                                                    />
                                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 font-black italic uppercase text-xl">VNĐ</span>
                                                </div>
                                            </div>

                                            {isSubmitted && qrUrl && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                                                    <div className="bg-[#1a2333] p-6 rounded-3xl border border-white/5">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] block mb-2">CHỦ TÀI KHOẢN</span>
                                                        <span className="text-white font-black text-xl italic tracking-tight">{BANK_CONFIG.accountName}</span>
                                                    </div>
                                                    <div className="bg-[#1a2333] p-6 rounded-3xl border border-white/5 group">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] block mb-2">NỘI DUNG CHUYỂN KHOẢN</span>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[#6366f1] font-black text-2xl italic tracking-tighter">{transferContent}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => { navigator.clipboard.writeText(transferContent); toast.success('Đã copy nội dung'); }}
                                                                className="bg-[#6366f1] text-white px-5 py-2.5 rounded-xl font-bold text-[10px] hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#6366f133]"
                                                            >
                                                                COPY
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-[#1e1e1a] border border-[#fbbf2433] p-6 rounded-2xl">
                                                <p className="text-[#fbbf24] text-[11px] font-black uppercase tracking-wider leading-relaxed flex gap-2">
                                                    <span className="shrink-0">⚠️</span>
                                                    <span>LƯU Ý: {isSubmitted ? `BẠN PHẢI NHẬP CHÍNH XÁC NỘI DUNG CHUYỂN KHOẢN LÀ "${transferContent}" ĐỂ HỆ THỐNG CÓ THỂ TỰ ĐỘNG XÁC MINH.` : 'VUI LÒNG ĐIỀN SỐ TIỀN VÀ NHẤN NÚT BÊN DƯỚI ĐỂ NHẬN THÔNG TIN CHUYỂN KHOẢN.'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || (method !== 'card' && isSubmitted)}
                                        className={`w-full font-black py-6 rounded-3xl shadow-2xl transition-all duration-300 uppercase italic tracking-[0.3em] text-lg active:scale-[0.98] disabled:opacity-50 ${method === 'card' ? 'bg-[#ff4d15] hover:bg-[#ff5d25] shadow-[#ff4d154d]' : 'bg-[#6366f1] hover:bg-[#7376f1] shadow-[#6366f14d]'}`}
                                    >
                                        {loading ? 'ĐANG XỬ LÝ...' : (method === 'card' ? 'NẠP THẺ NGAY' : (isSubmitted ? 'VUI LÒNG CHUYỂN TIỀN' : 'TẠO MÃ NẠP TIỀN'))}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 h-full">
                        {method === 'card' ? (
                            <div className="bg-[#121927] rounded-[2rem] p-10 shadow-2xl border border-[#1e293b] h-full flex flex-col">
                                <h3 className="text-2xl font-black text-white uppercase italic mb-10 flex items-center gap-4">
                                    <div className="w-1.5 h-8 bg-[#ff4d15] rounded-full"></div>
                                    LƯU Ý <span className="text-[#ff4d15]">NẠP THẺ</span>
                                </h3>

                                <div className="space-y-8">
                                    {[
                                        "NHẬP CHÍNH XÁC SỐ SERIAL VÀ MÃ THẺ. CHỌN ĐÚNG NHÀ MẠNG.",
                                        "CHỌN ĐÚNG MỆNH GIÁ, CHỌN SAI SE BỊ MẤT THẺ HOẶC BỊ PHẠT 50% GIÁ TRỊ.",
                                        "HỆ THỐNG XỬ LÝ TỰ ĐỘNG TỪ 1-5 PHÚT TÙY THUỘC VÀO NHÀ MẠNG.",
                                        "THẺ ZING VÀ THẺ CÀO ĐIỆN THOẠI ĐỀU CÓ MỨC CHIẾT KHẤU RIÊNG THEO TỪNG THỜI ĐIỂM."
                                    ].map((text, idx) => (
                                        <div key={idx} className="flex gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-[#1a2333] flex items-center justify-center shrink-0 font-black text-[#ff4d15] italic shadow-lg border border-white/5">
                                                0{idx + 1}
                                            </div>
                                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest leading-loose pt-1">{text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-12">
                                    <div className="bg-[#1a2333]/50 border border-dashed border-white/10 p-6 rounded-3xl text-center group cursor-pointer hover:bg-[#1a2333] transition">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">CẦN HỖ TRỢ GẤP?</p>
                                        <p className="text-white font-black uppercase italic tracking-widest text-sm group-hover:text-[#6366f1] transition">LIÊN HỆ FANPAGE NGAY</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#121927] rounded-[2rem] p-10 shadow-2xl border border-[#1e293b] text-center h-full flex flex-col items-center justify-center relative overflow-hidden">
                                <>
                                    <h3 className="text-2xl font-black text-white uppercase italic mb-8">
                                        QUÉT MÃ <span className="text-[#6366f1]">VIETQR</span>
                                    </h3>
                                    <div className="bg-white p-5 rounded-3xl shadow-[0px_0px_30px_rgba(99,102,241,0.2)]">
                                        {isSubmitted && qrUrl ? (
                                            <img src={qrUrl} alt="QR Code" className="w-64 h-64 mx-auto rounded-xl animate-in zoom-in-95 duration-500" />
                                        ) : (
                                            <div className="w-64 h-64 flex flex-col items-center justify-center text-slate-300">
                                                <span className="text-5xl mb-4 group-hover:scale-110 transition duration-500">💰</span>
                                                <p className="font-black uppercase text-[10px] tracking-widest leading-loose">BẤM "TẠO MÃ NẠP TIỀN"<br />ĐỂ NHẬN MÃ QR</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose max-w-[200px]">
                                        TỰ ĐỘNG CỘNG TIỀN SAU 30S - 1P KHI CHUYỂN KHOẢN THÀNH CÔNG.
                                    </p>
                                </>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deposit;