import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data)
};

// Business API
export const businessAPI = {
  setup: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'logo' && data[key] instanceof File) {
        formData.append('logo', data[key]);
      } else if (key !== 'logo') {
        formData.append(key, data[key]);
      }
    });
    return api.post('/business/setup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getMyBusiness: () => api.get('/business/my-business')
};

// Site API
export const siteAPI = {
  generate: () => api.post('/site/generate'),
  getContent: () => api.get('/site/content')
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  updateContent: (content) => api.put('/admin/content', { content }),
  publish: () => api.post('/admin/publish'),
  unpublish: () => api.post('/admin/unpublish')
};

export default api;