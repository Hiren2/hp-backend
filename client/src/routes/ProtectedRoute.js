import { Navigate, Outlet } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

export default function ProtectedRoute({ roles }) {
  
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  
  return <Outlet />;
}
