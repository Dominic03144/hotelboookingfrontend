import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import LandingPage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import HotelRoomsPage from "./pages/HotelRoomsPage";
import RoomDetailsPage from "./pages/RoomsDetailsPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/verifyEmailpage";

import BookRoomPage from "./pages/BookRoomPage";
import BookingPage from "./pages/BookingPage";

import UserBookingsPage from "./pages/userBookingsPage";
import UserBookingDetailsPage from "./pages/UserBookingDetailsPage";
import UserPaymentsPage from "./pages/UserPaymentsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import StripeProvider from "./StripeProvider";

import UserDashboardPage from "./pages/UserDashboardPage";

import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import AdminOverview from "./pages/AdminOverview";
import AdminUsersPage from "./pages/AdminUserPage";
import AdminBookingsPage from "./pages/AdminBookingPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminHotelsPage from "./pages/AdminHotelsPage";
import AdminRoomFormPage from "./pages/AdminRoomFormPage";
import AdminTicketsPage from "./pages/AdminTicketsPage";
import AdminPaymentsPage from "./pages/AdminPaymentPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import UserPage from "./pages/UserPage";

import { ErrorBoundary } from "react-error-boundary";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white text-red-600">
    <h1 className="text-5xl font-bold mb-2">404</h1>
    <p className="text-xl">Page Not Found</p>
  </div>
);

function DashboardErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong.</h2>
      <p className="mb-2">{error.message}</p>
      <a href="/dashboard" className="text-blue-600 underline">
        Refresh Dashboard
      </a>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  const dispatch = useDispatch();

  // ✅ Auto rehydrate user from localStorage
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
        {/* ✅ Public Layout */}
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/hotels/:hotelId/rooms" element={<HotelRoomsPage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ✅ Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/bookings"
            element={
              <ProtectedRoute>
                <UserBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/bookings/:bookingId"
            element={
              <ProtectedRoute>
                <UserBookingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/payments"
            element={
              <ProtectedRoute>
                <UserPaymentsPage
                  payments={[]}
                  isLoading={false}
                  isError={false}
                  error={undefined}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-room/:roomId"
            element={
              <ProtectedRoute>
                <BookRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <StripeProvider>
                  <PaymentPage />
                </StripeProvider>
              </ProtectedRoute>
            }
          />

          {/* ✅ ✅ ✅ FIX: Do NOT protect payment success */}
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Route>

        {/* ✅ Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ErrorBoundary FallbackComponent={DashboardErrorFallback}>
                  <UserDashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ✅ Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* ✅ Admin Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<UserPage />} />
          <Route path="hotels" element={<AdminHotelsPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="rooms/add" element={<AdminRoomFormPage />} />
          <Route path="rooms/edit/:id" element={<AdminRoomFormPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
        </Route>

        {/* ✅ Catch-All Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </QueryClientProvider>
  );
}
