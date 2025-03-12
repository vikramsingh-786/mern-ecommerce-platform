import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (!role || !allowedRoles?.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
