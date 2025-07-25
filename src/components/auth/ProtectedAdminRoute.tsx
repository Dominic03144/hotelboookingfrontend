import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../../app/store"; // adjust path if your store is in a different place
 // adjust path if your store is in a different place
import type { JSX } from "react";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedAdminRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    // Logged in but not an admin
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
        Access Denied: Admins Only
      </div>
    );
  }

  return children;
}
