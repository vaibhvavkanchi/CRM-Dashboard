import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
  roles,
  permission,
  redirectTo = "/dashboard",
}) {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
