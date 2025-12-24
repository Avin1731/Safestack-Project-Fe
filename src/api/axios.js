import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 1. REQUEST INTERCEPTOR (Sudah benar punyamu)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. RESPONSE INTERCEPTOR (Tambahan Safety Net)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Jika server kirim 401, artinya token sudah tidak berlaku
    if (error.response && error.response.status === 401) {
      localStorage.clear(); // Bersihkan storage
      window.location.reload(); // Tendang ke halaman login otomatis
    }
    return Promise.reject(error);
  }
);

export default api;