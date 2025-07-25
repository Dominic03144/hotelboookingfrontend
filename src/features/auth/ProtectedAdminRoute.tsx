import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { useEffect, type JSX } from "react";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedAdminRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.info("🔒 Please log in to continue.");
    } else if (user.role !== "admin") {
      toast.error("⛔ Access denied: Admins only.");
    }
  }, [user]);

  if (!user) {
    // ✅ If not logged in, pass intended admin page as from
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    // ✅ If not admin, redirect straight to dashboard WITHOUT 'from'
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
