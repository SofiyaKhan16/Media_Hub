import { Navigate } from "react-router-dom";
import { getCookie } from "../api/cookies";

function ProtectedRoute({ children }) {
  const token = getCookie("jwtToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
