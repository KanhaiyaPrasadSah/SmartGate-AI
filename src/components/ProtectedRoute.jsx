import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  // If not logged in → redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If logged in → allow access
  return children;
};

export default ProtectedRoute;