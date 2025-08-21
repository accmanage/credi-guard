import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: "admin" | "staff";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    // not logged in → send to login
    return <Navigate to={`/${role}/login`} replace />;
  }

  if (userRole !== role) {
    // wrong role → send to correct dashboard
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
}
