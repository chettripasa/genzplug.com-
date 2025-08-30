import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
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

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }).then(res => res.data),
  
  getCurrentUser: () => 
    api.get('/auth/me').then(res => res.data),
    
  // Helper method to get token from localStorage
  getToken: () => localStorage.getItem('token'),
};

export const productAPI = {
  getAll: () => api.get('/products').then(res => res.data),
  getById: (id: string) => api.get(`/products/${id}`).then(res => res.data),
};

export const videoAPI = {
  getAll: () => api.get('/videos').then(res => res.data),
  getById: (id: string) => api.get(`/videos/${id}`).then(res => res.data),
  upload: (formData: FormData) => 
    api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
};

export const userAPI = {
  getProfile: (id: string) => api.get(`/users/${id}`).then(res => res.data),
  updateProfile: (data: any) => api.put('/users/profile', data).then(res => res.data),
};

export default api;
