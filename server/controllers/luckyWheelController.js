const LuckyWheelPrize = require('../models/LuckyWheelPrize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const SPIN_COST = 20000;

exports.getPrizes = async (req, res) => {
    try {
        const prizes = await LuckyWheelPrize.find();
        res.json(prizes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.spin = async (req, res) => {
    try {
        // 1. Trừ tiền quay ngay lập tức (Atomic)
        const userAfterCharge = await User.findOneAndUpdate(
            { _id: req.user._id, balance: { $gte: SPIN_COST } },
            { $inc: { balance: -SPIN_COST } },
            { new: true }
        );

        if (!userAfterCharge) {
            return res.status(400).json({ message: 'Số dư không đủ để quay vòng quay may mắn!' });
        }

        // 2. Ghi log tiền phí
        await new Transaction({
            userId: userAfterCharge._id,
            type: 'lucky-wheel',
            amount: -SPIN_COST,
            description: 'Phí quay vòng quay may mắn'
        }).save();

        const prizes = await LuckyWheelPrize.find();
        if (prizes.length === 0) {
            // Rollback tiền nếu không có giải thưởng
            await User.findByIdAndUpdate(req.user._id, { $inc: { balance: SPIN_COST } });
            return res.status(500).json({ message: 'Lỗi hệ thống: Chưa cấu hình giải thưởng.' });
        }

        // 3. Tính toán kết quả ngẫu nhiên
        const random = Math.random();
        let cumulativeChance = 0;
        let selectedPrize = prizes[prizes.length - 1];

        for (const prize of prizes) {
            cumulativeChance += prize.chance;
            if (random < cumulativeChance) {
                selectedPrize = prize;
                break;
            }
        }

        let finalBalance = userAfterCharge.balance;
        let resultMessage = `Chúc mừng! Bạn đã trúng ${selectedPrize.name}!`;

        // 4. Nếu trúng tiền, cộng thưởng (Atomic)
        if (selectedPrize.type === 'balance') {
            const prizeValue = selectedPrize.value || 0;
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $inc: { balance: prizeValue } },
                { new: true }
            );
            finalBalance = updatedUser.balance;

            await new Transaction({
                userId: req.user._id,
                type: 'lucky-wheel',
                amount: prizeValue,
                description: `Trúng thưởng: ${selectedPrize.name} (+${prizeValue.toLocaleString()}đ)`
            }).save();
            resultMessage = `Chúc mừng! Bạn đã trúng ${prizeValue.toLocaleString()}đ vào tài khoản!`;
        } else if (selectedPrize.type === 'product') {
            resultMessage = `Chúc mừng! Bạn đã trúng ${selectedPrize.name}! Vui lòng kiểm tra kho đồ.`;
        } else if (selectedPrize.type === 'empty') {
            resultMessage = `Rất tiếc, chúc bạn may mắn lần sau!`;
        }

        res.json({
            prize: selectedPrize,
            newBalance: finalBalance,
            message: resultMessage
        });

    } catch (err) {
        console.error('Lỗi vòng quay:', err);
        res.status(500).json({ message: 'Lỗi hệ thống khi quay thưởng.' });
    }
};

exports.addPrize = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    try {
        const prize = new LuckyWheelPrize(req.body);
        await prize.save();
        res.json(prize);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePrize = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    try {
        const prize = await LuckyWheelPrize.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(prize);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePrize = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    try {
        await LuckyWheelPrize.findByIdAndDelete(req.params.id);
        res.json({ message: 'Prize deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
