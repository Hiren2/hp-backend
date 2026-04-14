// src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Chatbot from "./components/Chatbot"; 

/* AUTH */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* 🔥 NEW: PUBLIC LANDING PAGE */
import Home from "./pages/Home";

/* USER */
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import MyOrders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Support from "./pages/Support"; 
import Wishlist from "./pages/Wishlist"; // 🔥 WISHLIST IMPORT KIYA YAHAN

/* ADMIN */
import AdminServices from "./pages/AdminServices";
import AdminManagers from "./pages/AdminManagers";
import AdminStats from "./pages/AdminStats";
import AdminOrderHistory from "./pages/AdminOrderHistory";
import SystemActivity from "./pages/SystemActivity";

/* MANAGER */
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerOrders from "./pages/ManagerOrders";

/* SUPER ADMIN */
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminAuditLogs from "./pages/SuperAdminAuditLogs";

import { getUser } from "./utils/auth";

/* ================= MULTI TAB LOGOUT ================= */

window.addEventListener("storage", (e) => {
  if (e.key === "logout") {
    window.location.replace("/login");
  }
});

/* ================= AUTH GUARDS ================= */

const RequireAuth = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RequireAdmin = ({ children }) => {
  const user = getUser();
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireManager = ({ children }) => {
  const user = getUser();
  if (!user || user.role !== "manager") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireSuperAdmin = ({ children }) => {
  const user = getUser();
  if (!user || user.role !== "superadmin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/* ================= APP ================= */

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ================= */}

        {/* 🔥 Now the root route goes to our awesome Home page! */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= PROTECTED ================= */}

        <Route
          element={
            <RequireAuth>
              <Layout />
              {/* 🛡️ Chatbot component is mounted here. Now universal for all roles. */}
              <Chatbot />
            </RequireAuth>
          }
        >

          {/* USER & UNIVERSAL ROUTES */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 🔥 NEW: WISHLIST ROUTE */}
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* ✅ NEW: SUPPORT ROUTE (Accessible by everyone logged in) */}
          <Route path="/support" element={<Support />} />

          {/* ================= MANAGER ================= */}

          <Route
            path="/manager/dashboard"
            element={
              <RequireManager>
                <ManagerDashboard />
              </RequireManager>
            }
          />

          <Route
            path="/manager/orders"
            element={
              <RequireManager>
                <ManagerOrders />
              </RequireManager>
            }
          />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminStats />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/services"
            element={
              <RequireAdmin>
                <AdminServices />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/managers"
            element={
              <RequireAdmin>
                <AdminManagers />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <RequireAdmin>
                <AdminOrderHistory />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/system-activity"
            element={
              <RequireAdmin>
                <SystemActivity />
              </RequireAdmin>
            }
          />

          {/* ================= SUPER ADMIN ================= */}

          <Route
            path="/superadmin/dashboard"
            element={
              <RequireSuperAdmin>
                <SuperAdminDashboard />
              </RequireSuperAdmin>
            }
          />

          <Route
            path="/superadmin/audit-logs"
            element={
              <RequireSuperAdmin>
                <SuperAdminAuditLogs />
              </RequireSuperAdmin>
            }
          />

        </Route>

        {/* ================= FALLBACK ================= */}

        {/* If user types random URL, send them to our shiny new Home Page instead of Login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}