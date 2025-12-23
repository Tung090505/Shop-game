const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LuckyWheelPrize = require('./models/LuckyWheelPrize');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected for Seeding Prizes'))
    .catch(err => console.log('❌ Connection Error:', err));

const seedPrizes = [
    { name: '10.000đ', type: 'balance', value: 10000, chance: 0.4, color: '#f59e0b' },
    { name: '25.000đ', type: 'balance', value: 25000, chance: 0.2, color: '#00e676' },
    { name: '30.000đ', type: 'balance', value: 30000, chance: 0.05, color: '#2979ff' },
    { name: 'Chúc bạn may mắn', type: 'empty', value: null, chance: 0.3, color: '#6b7280' },
    { name: 'Jackpot 100k', type: 'balance', value: 100000, chance: 0.05, color: '#ff1744' }
];

const seedDB = async () => {
    try {
        await LuckyWheelPrize.deleteMany({});
        await LuckyWheelPrize.insertMany(seedPrizes);
        console.log("Lucky Wheel Prizes Seeded!");
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

seedDB();
