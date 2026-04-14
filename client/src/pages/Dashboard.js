import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import UserDashboard from "./UserDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminStats from "./AdminStats";
import SuperAdminDashboard from "./SuperAdminDashboard";

export default function Dashboard() {

  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* 🔥 ROLE BASED DASHBOARD */

  if (user.role === "superadmin") {
    return <SuperAdminDashboard />;
  }

  if (user.role === "admin") {
    return <AdminStats />;
  }

  if (user.role === "manager") {
    return <ManagerDashboard />;
  }

  return <UserDashboard />;
}