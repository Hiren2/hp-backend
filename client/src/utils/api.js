import axios from "axios";
import { getToken, logout } from "../utils/auth";

/* 🔥 PRODUCTION FIX: 
   Localhost ko hata kar Render ki backend link set kar di hai.
   Ab frontend seedha internet wale server se baat karega.
*/
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



api.interceptors.response.use(
  (res) => res,
  (error) => {
    
    if (error.response?.status === 401) {
      logout();
      
      window.location.href = "/login?expired=true"; 
    }
    return Promise.reject(error);
  }
);

export default api;