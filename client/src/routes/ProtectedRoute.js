import { Navigate, Outlet } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

export default function ProtectedRoute({ roles }) {
  // 🔒 Not logged in
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  // 🔒 Role not allowed
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
}
