import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token from localStorage (or sessionStorage if used)
    localStorage.removeItem("token");

    // Optionally show a small delay before redirecting
    const timeout = setTimeout(() => {
      navigate("/");
    }, 1000); // ⏳ Wait 1 second before redirecting to home

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Logging you out...</h2>
        <p className="text-sm">Please wait while we redirect you to the homepage.</p>
      </div>
    </div>
  );
}
