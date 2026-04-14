// src/api/api.js
import axios from "axios";
import { getToken, clearAuth } from "../utils/auth";

let isLoggingOut = false;

const api = axios.create({
  // 🔥 THE MAGIC LINK: Ab tera Frontend is live server se baat karega
  baseURL: "https://hp-backend-ec7x.onrender.com/api", 
});

/* ================= REQUEST ================= */
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

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      clearAuth();

      // notify other tabs
      localStorage.setItem("app_logout", Date.now().toString());

      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;