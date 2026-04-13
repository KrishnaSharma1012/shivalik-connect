import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // fallback for refresh / async issue
  const storedUser = localStorage.getItem("user");

  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;