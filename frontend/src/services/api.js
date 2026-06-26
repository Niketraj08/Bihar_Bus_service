import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout for registration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Bus APIs
export const busAPI = {
  search: (source, destination, date) =>
    api.get('/buses/search', { params: { source, destination, date } }),
  getAll: () => api.get('/buses'),
  getById: (id) => api.get(`/buses/${id}`),
  getSeats: (id, date) => api.get(`/buses/${id}/seats`, { params: { date } }),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

// Payment APIs
export const paymentAPI = {
  createRazorpayOrder: (bookingId) =>
    api.post('/payments/razorpay/create-order', { bookingId }),
  verifyRazorpayPayment: (data) =>
    api.post('/payments/razorpay/verify', data),
  walletPayment: (bookingId) =>
    api.post('/payments/wallet', { bookingId }),
  addMoneyToWallet: (amount) =>
    api.post('/payments/wallet/add-money', { amount }),
  getWalletBalance: () =>
    api.get('/payments/wallet/balance'),
};

// Tracking APIs
export const trackingAPI = {
  getBusLocation: (busId) => api.get(`/tracking/${busId}`),
  updateBusLocation: (busId, data) => api.put(`/tracking/${busId}`, data),
  getRouteStops: (routeId) => api.get(`/tracking/route/${routeId}/stops`),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllBuses: () => api.get('/admin/buses'),
  createBus: (data) => api.post('/admin/buses', data),
  updateBus: (id, data) => api.put(`/admin/buses/${id}`, data),
  deleteBus: (id) => api.delete(`/admin/buses/${id}`),
  getAllRoutes: () => api.get('/admin/routes'),
  createRoute: (data) => api.post('/admin/routes', data),
  updateRoute: (id, data) => api.put(`/admin/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/admin/routes/${id}`),
  getAllBookings: () => api.get('/admin/bookings'),
  getAllUsers: () => api.get('/admin/users'),
};

export default api;

