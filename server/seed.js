const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch(err => console.log('❌ Connection Error:', err));

const seedProducts = [
    // ... (existing products)
    {
        title: "Valorant Radiant Account | Vandal Prime",
        category: "Valorant",
        price: 150,
        oldPrice: 200,
        description: "High tier Valorant account with Radiant rank and Prime Vandal skin.",
        attributes: {
            "Rank": "Radiant",
            "Skins": "50+",
            "Agents": "All Unlocked"
        },
        images: ["https://images.unsplash.com/photo-1624138784181-dc7f5b75e52e?auto=format&fit=crop&q=80&w=500"],
        credentials: { username: "user1", password: "pw1" }
    },
    {
        title: "LOL Diamond 1 | 100 Champs | 50 Skins",
        category: "League of Legends",
        price: 80,
        description: "Diamond 1 account, ready for Master push. High MMR.",
        attributes: {
            "Rank": "Diamond 1",
            "Champions": "100",
            "Skins": "50"
        },
        images: ["https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&q=80&w=500"],
        credentials: { username: "user2", password: "pw2" }
    },
    {
        title: "TFT Challenger Set 10",
        category: "TFT",
        price: 120,
        oldPrice: 150,
        description: "Top 50 Challenger account.",
        attributes: {
            "Rank": "Challenger",
            "Little Legends": "20"
        },
        images: ["https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=500"],
        credentials: { username: "user3", password: "pw3" }
    }
];

const seedDB = async () => {
    try {
        // Clear existing
        await Product.deleteMany({});
        await User.deleteMany({});

        // Seed Products
        await Product.insertMany(seedProducts);
        console.log("Products Seeded!");

        // Seed Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            email: 'admin@shop.com',
            password: hashedPassword,
            role: 'admin',
            balance: 999999
        });
        await admin.save();
        console.log("Admin User Seeded! (admin/admin123)");

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

seedDB();
