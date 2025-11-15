import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClientPage from "./pages/ClientPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

import OverviewPage from "./pages/OverviewPage";
import SensorsPage from "./pages/SensorsPage";
import ReportsPage from "./pages/ReportsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ClientPage />} />

      {/* Admin routes (protected) */}
      <Route
        path="/admin"
        element={
            <AdminLayout />
        }
      >
        {/* /admin -> tự redirect sang /admin/overview */}
        <Route index element={<Navigate to="overview" replace />} />

        <Route path="overview" element={<OverviewPage />} />
        <Route path="sensors" element={<SensorsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* fallback cho route lạ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
