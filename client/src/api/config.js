import axios from 'axios';

// Tự động nhận diện môi trường: Nếu chạy ở máy là localhost, nếu chạy online thì lấy link Hosting
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://shop-game-dyf6.onrender.com/api'; // Đã thay link Render của bạn vào đây

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
