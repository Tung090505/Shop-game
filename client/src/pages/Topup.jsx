import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

const Topup = () => {
    const [amount, setAmount] = useState(10000);
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleTopup = async () => {
        setLoading(true);
        try {
            const res = await api.topupBalance(amount);
            setUser(res.data); // Update user with new balance
            alert('Topup Successful!');
            navigate('/profile');
        } catch (err) {
            alert('Topup Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="bg-secondary p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Top Up Balance</h2>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[10000, 20000, 50000, 100000, 200000, 500000].map(val => (
                        <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`py-3 rounded-lg font-bold border transition ${amount === val
                                ? 'bg-accent text-white border-accent'
                                : 'bg-primary text-slate-300 border-slate-700 hover:border-accent'
                                }`}
                        >
                            {val.toLocaleString('vi-VN')}đ
                        </button>
                    ))}
                </div>

                <div className="bg-primary p-6 rounded-lg mb-8 border border-slate-700 text-center">
                    <p className="text-slate-400 mb-2">Selected Amount</p>
                    <p className="text-4xl font-bold text-white">{amount.toLocaleString('vi-VN')}đ</p>
                </div>

                <button
                    onClick={handleTopup}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-green-500/30 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Pay Now (Simulated)'}
                </button>

                <p className="text-center text-slate-500 text-xs mt-4">
                    This is a simulated payment gateway for demonstration purposes.
                </p>
            </div>
        </div>
    );
};

export default Topup;
