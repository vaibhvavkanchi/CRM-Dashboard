import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalLoader from "./components/GlobalLoader";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import LeadFormPage from "./pages/LeadFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import UsersPage from "./pages/UsersPage";
import { PERMISSIONS, ROLES } from "./utils/rbac";
import useAuth from "./hooks/useAuth";

function HomeRedirect() {
  const { hasPermission } = useAuth();

  return hasPermission(PERMISSIONS.DASHBOARD_READ) ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/leads" replace />
  );
}

/**
 * Root application router wiring public, protected, and permission-gated pages.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <>
      <GlobalLoader />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeRedirect />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                permission={PERMISSIONS.DASHBOARD_READ}
                redirectTo="/leads"
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/new" element={<LeadFormPage mode="create" />} />
          <Route path="leads/:id/edit" element={<LeadFormPage mode="edit" />} />
          <Route
            path="users"
            element={
              <ProtectedRoute
                roles={[ROLES.ADMIN]}
                permission={PERMISSIONS.USER_WRITE}
              >
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
