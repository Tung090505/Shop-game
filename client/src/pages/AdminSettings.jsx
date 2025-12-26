import React, { useState, useEffect, useContext } from 'react';
import api from '../api/config';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AdminSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testingWebhook, setTestingWebhook] = useState(false);
    const { user } = useContext(AuthContext);

    // Mapping key hiển thị cho đẹp
    const SETTING_LABELS = {
        'GACHTHE1S_PARTNER_ID': 'Partner ID (Gachthe1s)',
        'GACHTHE1S_PARTNER_KEY': 'Partner Key (Gachthe1s)',
        'ADMIN_BANK_NAME': 'Ngân hàng nhận tiền',
        'ADMIN_BANK_ACCOUNT': 'Số tài khoản',
        'ADMIN_BANK_ACCOUNT_NAME': 'Tên chủ tài khoản'
    };

    const loadSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Không thể tải cấu hình');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleUpdate = async (key, value) => {
        try {
            await api.post('/settings', { key, value });
            toast.success('Đã lưu cấu hình');
            loadSettings(); // Reload để đảm bảo đồng bộ
        } catch (err) {
            toast.error('Lưu thất bại');
        }
    };

    // Hàm lấy giá trị hiện tại của key
    const getValue = (key) => {
        const setting = settings.find(s => s.key === key);
        return setting ? setting.value : '';
    };

    // Test webhook endpoint
    const testWebhook = async () => {
        setTestingWebhook(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://shop-game-dy16.onrender.com/api';
            const response = await fetch(`${apiUrl}/webhooks/card?secret=ShopGameBaoMat2025BaoMat2025Nsryon`);
            const text = await response.text();

            if (response.ok) {
                toast.success(`✅ Webhook hoạt động! Response: ${text}`);
            } else {
                toast.error(`❌ Webhook lỗi! Status: ${response.status}`);
            }
        } catch (err) {
            toast.error(`❌ Không thể kết nối: ${err.message}`);
        } finally {
            setTestingWebhook(false);
        }
    };

    // Auto generate callback URL
    const callbackUrl = `${import.meta.env.VITE_API_URL || 'https://shop-game-dy16.onrender.com/api'}/webhooks/card?secret=ShopGameBaoMat2025BaoMat2025Nsryon`;

    if (loading) return <div className="text-center text-white p-10">Đang tải cấu hình...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-8">
                Cấu hình <span className="text-accent">Hệ Thống</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gachthe1s Config */}
                <div className="bg-secondary/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
                    <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-3">
                        <span className="text-3xl">💳</span> Cấu hình Gạch Thẻ
                    </h2>

                    <div className="space-y-6">
                        {['GACHTHE1S_PARTNER_ID', 'GACHTHE1S_PARTNER_KEY'].map(key => (
                            <div key={key}>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                                    {SETTING_LABELS[key]}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        defaultValue={getValue(key)}
                                        onBlur={(e) => {
                                            if (e.target.value !== getValue(key)) {
                                                handleUpdate(key, e.target.value);
                                            }
                                        }}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-all"
                                        placeholder={`Nhập ${SETTING_LABELS[key]}...`}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-white/5 mt-4">
                            <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2 mb-2 block">
                                Callback URL (Copy vào Gachthe1s)
                            </label>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 break-all text-slate-300 font-mono text-xs select-all cursor-pointer hover:text-white transition-colors" onClick={() => { navigator.clipboard.writeText(callbackUrl); toast.success('Đã copy!'); }}>
                                {callbackUrl}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 italic">* Đảm bảo chọn kiểu <b>POST</b> khi cấu hình trên Gachthe1s.</p>

                            {/* Test Button */}
                            <button
                                onClick={testWebhook}
                                disabled={testingWebhook}
                                className="mt-4 w-full bg-accent hover:bg-accent/80 disabled:bg-slate-600 text-white font-black py-3 px-6 rounded-xl uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed"
                            >
                                {testingWebhook ? '🔄 Đang kiểm tra...' : '🧪 Test Webhook Endpoint'}
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 bg-black/20 p-4 rounded-xl border border-accent/20">
                            <h3 className="text-sm font-black text-accent uppercase mb-3">📋 Hướng dẫn cấu hình Gachthe1s</h3>
                            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                                <li>Truy cập <a href="https://gachthe1s.com" target="_blank" className="text-accent underline">gachthe1s.com</a> và đăng nhập</li>
                                <li>Vào phần <b>Cấu hình Callback</b></li>
                                <li>Copy URL ở trên và paste vào ô <b>Callback URL</b></li>
                                <li>Chọn phương thức: <b>POST</b></li>
                                <li>Lưu cấu hình</li>
                                <li>Nhấn nút <b>Test Webhook</b> ở trên để kiểm tra</li>
                            </ol>
                            <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-[10px] text-green-400">
                                    ✅ <b>Lưu ý:</b> Webhook chỉ nhận được dữ liệu khi có giao dịch thực tế từ Gachthe1s
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Config */}
                <div className="bg-secondary/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
                    <h2 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-3">
                        <span className="text-3xl">🏦</span> Thông tin Ngân hàng Admin
                    </h2>

                    <div className="space-y-6">
                        {['ADMIN_BANK_NAME', 'ADMIN_BANK_ACCOUNT', 'ADMIN_BANK_ACCOUNT_NAME'].map(key => (
                            <div key={key}>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                                    {SETTING_LABELS[key]}
                                </label>
                                <input
                                    type="text"
                                    defaultValue={getValue(key)}
                                    // Update on blur (focus out) to avoid too many requests
                                    onBlur={(e) => {
                                        if (e.target.value !== getValue(key)) {
                                            handleUpdate(key, e.target.value);
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-accent transition-all"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
