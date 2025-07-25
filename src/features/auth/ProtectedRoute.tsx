import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import type { JSX } from "react";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, rehydrated } = useAuth();
  const location = useLocation();

  // ✅ While auth state is loading, show a fallback
  if (!rehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ If not authenticated, redirect to login with `from` + custom message
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "🔒 Please log in to continue.",
        }}
      />
    );
  }

  // ✅ If authenticated, render the protected children
  return children;
}
