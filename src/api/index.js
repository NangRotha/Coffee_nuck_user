import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const API_BASE_URL = API_URL.replace(/\/api$/, '') || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get('/products', { params: { category } }),
};

// Orders API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
  getByTransactionId: (transactionId) => api.get(`/orders/transaction/${transactionId}`),
};

// Payment API
export const paymentAPI = {
  createQR: (orderId) => api.post('/payment/create-qr', { order_id: orderId }),
  verify: (transactionId) => api.post(`/payment/verify/${transactionId}`),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  getManagers: () => api.get('/staff/managers'),
};

// Events API
export const eventAPI = {
  getAll: (activeOnly = true) => api.get('/events', { params: { active_only: activeOnly } }),
  getUpcoming: () => api.get('/events/upcoming'),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
};

export default api;