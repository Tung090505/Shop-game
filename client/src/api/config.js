import axios from 'axios';

// Tự động nhận diện môi trường: Nếu chạy ở máy là localhost, nếu chạy online thì lấy link Hosting
const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
const API_URL = isLocal
    ? 'http://localhost:5000/api'
    : 'https://shop-game-dy16.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
});

// Tự động đính kèm Token vào mọi yêu cầu nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
