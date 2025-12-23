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
        const user = await User.findById(req.user._id);
        if (user.balance < SPIN_COST) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.balance -= SPIN_COST;
        await user.save();

        await new Transaction({
            userId: user._id,
            type: 'lucky-wheel',
            amount: -SPIN_COST,
            description: 'Lucky Wheel spin cost'
        }).save();

        const prizes = await LuckyWheelPrize.find();
        if (prizes.length === 0) {
            return res.status(500).json({ message: 'No prizes configured' });
        }

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

        let resultMessage = `Chúc mừng! Bạn đã trúng ${selectedPrize.name}!`;
        if (selectedPrize.type === 'balance') {
            user.balance += selectedPrize.value;
            await user.save();

            await new Transaction({
                userId: user._id,
                type: 'lucky-wheel',
                amount: selectedPrize.value,
                description: `Trúng vòng quay: ${selectedPrize.name} (+${selectedPrize.value.toLocaleString()}đ)`
            }).save();
            resultMessage = `Chúc mừng! Bạn đã trúng ${selectedPrize.value.toLocaleString()}đ vào tài khoản!`;
        } else if (selectedPrize.type === 'product') {
            resultMessage = `Chúc mừng! Bạn đã trúng ${selectedPrize.name}! Vui lòng kiểm tra kho đồ.`;
        } else if (selectedPrize.type === 'empty') {
            resultMessage = `Rất tiếc, chúc bạn may mắn lần sau!`;
        }

        res.json({
            prize: selectedPrize,
            newBalance: user.balance,
            message: resultMessage
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
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
