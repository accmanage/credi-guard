import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import AdminDashboard from "@/components/AdminDashboard";
import StaffDashboard from "@/components/StaffDashboard";

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard */}
      <Route path="/" element={<AdminDashboard />} />

      {/* Staff Dashboard */}
      <Route path="/staff" element={<StaffDashboard />} />

      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
