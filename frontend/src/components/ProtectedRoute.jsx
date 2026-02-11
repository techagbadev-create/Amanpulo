import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store";

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page, saving the attempted location
    return <Navigate to="/owner/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
