import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Determine backend URL
        const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
        const BACKEND_URL = isLocal
            ? 'http://localhost:5000'
            : 'https://shop-game-dy16.onrender.com';

        // Initialize socket connection
        const newSocket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            setConnected(true);

            // Join user's room if logged in
            if (user?._id) {
                newSocket.emit('join', user._id);
                console.log('Joined room for user:', user._id);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
