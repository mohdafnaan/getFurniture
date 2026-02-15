import axios from 'axios';

const api = axios.create({
  // If we are in production and running on the same domain, relative path is best
  baseURL: import.meta.env.PROD ? '' : (import.meta.env.VITE_URL || 'http://localhost:3000'),
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Backend expects this? Let's check auth middleware later.
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
