import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 1. REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. RESPONSE INTERCEPTOR (FIXED: ANTI-LOOP)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Jika server kirim 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // 1. Bersihkan data user yang tidak valid/kadaluarsa
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 2. CEK: Hanya redirect jika kita BELUM di halaman login ('/')
      // Ini mencegah halaman me-refresh dirinya sendiri terus menerus
      if (window.location.pathname !== '/') {
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;