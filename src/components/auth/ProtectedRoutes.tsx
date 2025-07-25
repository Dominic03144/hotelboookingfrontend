// ✅ src/components/auth/ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, type JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.info("🔒 Please log in to continue.");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
