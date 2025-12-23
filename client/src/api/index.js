import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth Services
export const login = (formData) => API.post('/user/login', formData);
export const register = (formData) => API.post('/user/register', formData);
export const fetchProfile = () => API.get('/user/profile');
export const fetchTransactions = () => API.get('/user/transactions');
export const topupBalance = (amount) => API.post('/user/topup', { amount });
export const withdrawCommission = () => API.post('/user/withdraw-commission');

// Product Services
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const adminFetchProducts = () => API.get('/products/admin/all');
export const adminCreateProduct = (data) => API.post('/products', data);
export const adminUpdateProduct = (id, data) => API.put(`/products/${id}`, data);
export const adminDeleteProduct = (id) => API.delete(`/products/${id}`);

// Order Services
export const createOrder = (productId) => API.post('/orders/create', { productId });
export const fetchMyOrders = () => API.get('/orders/my-orders');

// Lucky Wheel Services
export const fetchPrizes = () => API.get('/lucky-wheel/prizes');
export const spinWheel = () => API.post('/lucky-wheel/spin');

// Deposit Services
export const submitDeposit = (data) => API.post('/deposits/submit', data);
export const fetchMyDeposits = () => API.get('/deposits/my-deposits');

// Admin Services
export const adminFetchAllUsers = () => API.get('/user/all-users');
export const adminFetchAllTransactions = () => API.get('/user/all-transactions');
export const adminFetchAllOrders = () => API.get('/orders/all');
export const adminFetchAllDeposits = () => API.get('/deposits/all');
export const adminUpdateDeposit = (id, status) => API.put(`/deposits/${id}`, { status });
export const adminUpdateUserBalance = (id, amount) => API.put(`/user/update-balance/${id}`, { amount });
export const adminDeleteUser = (id) => API.delete(`/user/${id}`);

// Admin Lucky Wheel Management
export const adminAddPrize = (data) => API.post('/lucky-wheel/prizes', data);
export const adminUpdatePrize = (id, data) => API.put(`/lucky-wheel/prizes/${id}`, data);
export const adminDeletePrize = (id) => API.delete(`/lucky-wheel/prizes/${id}`);

// Upload Service
export const uploadImage = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Category Services
export const fetchCategories = () => API.get('/categories');
export const adminCreateCategory = (data) => API.post('/categories', data);
export const adminUpdateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const adminDeleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;
