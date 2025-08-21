import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: "admin" | "staff";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const userRole = localStorage.getItem("role");

  // If not logged in → go to login
  if (!userRole) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  // If wrong role → force them to their own dashboard
  if (userRole !== role) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
}
