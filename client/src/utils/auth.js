// src/utils/auth.js

const LOGOUT_EVENT = "app_logout";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/* ✅ SAFE LOGOUT (single fire) */
export const logout = () => {
  clearAuth();

  // 🔥 notify other tabs (once)
  localStorage.setItem(LOGOUT_EVENT, Date.now().toString());

  // hard redirect avoids react glitches
  window.location.replace("/login");
};

export const listenToLogout = (callback) => {
  window.addEventListener("storage", (e) => {
    if (e.key === LOGOUT_EVENT) {
      callback();
    }
  });
};
