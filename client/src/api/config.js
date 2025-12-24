import axios from 'axios';

// Tự động nhận diện môi trường: Nếu chạy ở máy là localhost, nếu chạy online thì lấy link Hosting
const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
const BACKEND_URL = isLocal
    ? 'http://localhost:5000'
    : 'https://shop-game-dy16.onrender.com';

const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
});

// Helper: Xử lý URL hình ảnh (Nếu là localhost -> Chuyển sang URL online tương ứng)
export const getAssetUrl = (url) => {
    if (!url) return '';

    // Nếu là URL tuyệt đối (bắt đầu bằng http)
    if (url.startsWith('http')) {
        // Nếu không phải ở local mà URL lại trỏ về localhost/127.0.0.1 -> Chuyển sang BACKEND_URL
        if (!isLocal && (url.includes('localhost') || url.includes('127.0.0.1'))) {
            return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, BACKEND_URL);
        }
        return url;
    }

    // Nếu là path tương đối (ví dụ: /uploads/abc.jpg)
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${BACKEND_URL}${cleanPath}`;
};

// Tự động đính kèm Token vào mọi yêu cầu nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
