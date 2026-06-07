import axios from "axios";
import { getToken, clearAuth } from "../utils/auth";

let isLoggingOut = false;

const api = axios.create({
  baseURL: "https://hp-backend-ec7x.onrender.com/api", 
});

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

// 🔥 SMART RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "";

    // 🛑 Do NOT log out if it's just a Sandbox demo block from our backend
    if (status === 403 && message.includes("Sandbox Mode")) {
      return Promise.reject(error);
    }

    // 🔄 Log out silently on 401 (Unauthorized) or strict 403 (Invalid Role/Token)
    if ((status === 401 || status === 403) && !isLoggingOut) {
      isLoggingOut = true;

      clearAuth();

      // Trigger the storage event to sync other tabs
      localStorage.setItem("app_logout", Date.now().toString());

      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;