import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to their dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admindash" : "/userdash"} replace />;
  }

  return children;
};

export default ProtectedRoute;