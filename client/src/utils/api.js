import axios from "axios";
import { getToken, logout } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ===== REQUEST INTERCEPTOR ===== */
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
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 🔥 PRO FIX: Agar 401 (Unauthorized/Expired Token) aaya toh seedha bahar!
    if (error.response?.status === 401) {
      logout();
      // User ko turant login pe bhej do taaki wo broken page par na atke
      window.location.href = "/login?expired=true"; 
    }
    return Promise.reject(error);
  }
);

export default api;