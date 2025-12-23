import React, { createContext, useState, useEffect } from 'react';
import * as api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.fetchProfile();
                    setUser(data);
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        const { data } = await api.login({ username, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const register = async (username, email, password, ref = null) => {
        await api.register({ username, email, password, ref });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const fetchProfile = async () => {
        try {
            const { data } = await api.fetchProfile();
            setUser(data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
