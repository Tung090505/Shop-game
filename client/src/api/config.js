import axios from 'axios';

// Tự động nhận diện môi trường: Nếu chạy ở máy là localhost, nếu chạy online thì lấy link Hosting
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://api-cua-ban.onrender.com/api'; // Sau này bạn thay link Render vào đây

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
