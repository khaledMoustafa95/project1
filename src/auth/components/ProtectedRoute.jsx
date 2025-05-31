import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path as per your structure

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading User Authentication...
      </div>
    );
  }

  if (!authState.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
