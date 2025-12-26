// Socket.IO instance - singleton pattern
let io = null;

const initSocket = (server) => {
    const socketIO = require('socket.io');

    io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.id);

        // User joins their own room based on userId
        socket.on('join', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined room user_${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
};

// Emit deposit success notification to specific user
const notifyDepositSuccess = (userId, depositData) => {
    try {
        const io = getIO();
        io.to(`user_${userId}`).emit('deposit_approved', {
            message: 'Nạp tiền thành công!',
            amount: depositData.amount,
            newBalance: depositData.newBalance,
            timestamp: new Date()
        });
        console.log(`📢 Sent deposit notification to user ${userId}`);
    } catch (error) {
        console.error('Error sending socket notification:', error);
    }
};

// Emit deposit error notification to specific user
const notifyDepositError = (userId, errorData) => {
    try {
        const io = getIO();
        io.to(`user_${userId}`).emit('deposit_rejected', {
            message: errorData.message || 'Thẻ không hợp lệ!',
            transactionId: errorData.transactionId,
            timestamp: new Date()
        });
        console.log(`📢 Sent deposit REJECTED notification to user ${userId}`);
    } catch (error) {
        console.error('Error sending socket error notification:', error);
    }
};

module.exports = {
    initSocket,
    getIO,
    notifyDepositSuccess,
    notifyDepositError
};
