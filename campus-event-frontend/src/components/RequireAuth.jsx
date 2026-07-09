import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RequireAuth({ children, allowedRoles = [] }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = String(user.role || "student").toLowerCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "organizer") {
      return <Navigate to="/organizer/dashboard" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
}

export default RequireAuth;
