// src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Chatbot from "./components/Chatbot"; 

/* AUTH */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* PUBLIC */
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
import Wishlist from "./pages/Wishlist"; 

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
import SuperAdminManageAdmins from "./pages/SuperAdminManageAdmins";

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
          <Route path="/wishlist" element={<Wishlist />} />
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
            path="/superadmin/manage-roles"
            element={
              <RequireSuperAdmin>
                <SuperAdminManageAdmins />
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
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}