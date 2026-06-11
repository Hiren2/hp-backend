import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Chatbot from "./components/Chatbot"; 

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Home from "./pages/Home";

import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import MyOrders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Support from "./pages/Support"; 
import Wishlist from "./pages/Wishlist"; 
import ChangePassword from "./pages/ChangePassword"; 

import AdminServices from "./pages/AdminServices";
import AdminManagers from "./pages/AdminManagers";
import AdminStats from "./pages/AdminStats";
import AdminOrderHistory from "./pages/AdminOrderHistory";
import SystemActivity from "./pages/SystemActivity";
import AdminReviews from "./pages/AdminReviews"; // 🔥 IMPORTED REVIEW PAGE

import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerOrders from "./pages/ManagerOrders";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminAuditLogs from "./pages/SuperAdminAuditLogs";
import SuperAdminManageAdmins from "./pages/SuperAdminManageAdmins";

import { getUser } from "./utils/auth";

// 🔥 MULTI-TAB INSTANT SYNC LOGIC
window.addEventListener("storage", (e) => {
  if (e.key === "token" || e.key === "user" || e.key === "app_logout" || e.key === "logout") {
    if (!window.location.pathname.includes("/login")) {
      window.location.reload();
    }
  }
});

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

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Customer Routes */}
        <Route
          element={
            <RequireAuth>
              <Layout />
              <Chatbot />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/support" element={<Support />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Manager Routes */}
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

          {/* Admin Routes (Business Level) */}
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
          {/* 🔥 FEEDBACK HUB STRICTLY FOR ADMIN ONLY */}
          <Route
            path="/admin/reviews"
            element={
              <RequireAdmin>
                <AdminReviews />
              </RequireAdmin>
            }
          />

          {/* Super Admin Routes (System Level) */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}