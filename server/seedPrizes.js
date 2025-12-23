const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LuckyWheelPrize = require('./models/LuckyWheelPrize');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding Prizes'))
    .catch(err => console.log(err));

const seedPrizes = [
    { name: '$5 Balance', type: 'balance', value: 5, chance: 0.4, color: '#f59e0b' },
    { name: '$20 Balance', type: 'balance', value: 20, chance: 0.1, color: '#00e676' },
    { name: '$50 Balance', type: 'balance', value: 50, chance: 0.05, color: '#2979ff' },
    { name: 'Better Luck Next Time', type: 'empty', value: null, chance: 0.4, color: '#6b7280' },
    { name: 'Jackpot $100', type: 'balance', value: 100, chance: 0.05, color: '#ff1744' }
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
