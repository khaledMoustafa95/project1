import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./auth/pages/Signup";
import LoginPage from "./auth/pages/Login";
import DashboardPage from "./auth/pages/DashboardPage";
import ProtectedRoute from "./auth/components/ProtectedRoute";
import CreatePage from "./auth/components/CreatePage";
import UpdatePage from "./auth/components/UpdatePage";
import ViewPage from "./auth/components/ViewPage";

import { useAuth } from "./auth/context/AuthContext";

export default function AppRoutes() {
  const { authState } = useAuth();
  const AppLoadingIndicator = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem",
      }}
    >
      Loading Application...
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authState.isLoading ? (
              <AppLoadingIndicator />
            ) : authState.user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Public Routes */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route path="create" element={<CreatePage />} />
          <Route path="view" element={<ViewPage />} />
          <Route path="update" element={<UpdatePage />} />
        </Route>

        <Route
          path="*"
          element={
            authState.isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  fontSize: "1.2rem",
                }}
              >
                Loading...
              </div>
            ) : authState.user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
