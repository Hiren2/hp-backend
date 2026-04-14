import axios from "axios";
import { getToken, logout } from "../utils/auth";

/* 🔥 PRODUCTION FIX: 
   Localhost ko hata kar Render ki backend link set kar di hai.
   Ab frontend seedha internet wale server se baat karega.
*/
const api = axios.create({
  baseURL: "https://hp-backend-ec7x.onrender.com/api",
});

/* ===== REQUEST INTERCEPTOR ===== */
// Har request ke sath token bhejne ke liye
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===== RESPONSE INTERCEPTOR ===== */
// Global error handling: Agar token expire ho jaye toh logout kar do
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 401 ka matlab hai session khatam ya unauthorized access
    if (error.response?.status === 401) {
      logout();
      // User ko login page pe redirect karna zaroori hai
      window.location.href = "/login?expired=true"; 
    }
    return Promise.reject(error);
  }
);

export default api;