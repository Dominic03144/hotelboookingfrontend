import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";

import PublicRoutes from "./routes/PublicRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white text-red-600">
    <h1 className="text-5xl font-bold mb-2">404</h1>
    <p className="text-xl">Page Not Found</p>
  </div>
);

const queryClient = new QueryClient();

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");

    if (token && role && userId && email) {
      dispatch(
        setUser({
          token,
          role,
          userId: Number(userId),
          email,
          profileImageUrl: null,
        })
      );
    }
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {PublicRoutes}
        {UserRoutes}
        {AdminRoutes}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </QueryClientProvider>
  );
}
