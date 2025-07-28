import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import StripeProvider from "../StripeProvider";

import ProfilePage from "../pages/ProfilePage";
import UserBookingsPage from "../pages/usePages/userBookingsPage";
import UserBookingDetailsPage from "../pages/usePages/UserBookingDetailsPage";
import UserPaymentsPage from "../pages/usePages/UserPaymentsPage";
import BookRoomPage from "../pages/usePages/BookRoomPage";
import BookingPage from "../pages/usePages/BookingPage";
import PaymentPage from "../pages/PaymentPage";
import UserDashboardPage from "../pages/usePages/UserDashboardPage";

import { ErrorBoundary } from "react-error-boundary";

function DashboardErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong.</h2>
      <p className="mb-2">{error.message}</p>
      <a href="/dashboard" className="text-blue-600 underline">Refresh Dashboard</a>
    </div>
  );
}

const UserRoutes = (
  <>
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
          <UserPaymentsPage payments={[]} isLoading={false} isError={false} error={undefined} />
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
    <Route
      element={<DashboardLayout />}
    >
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
  </>
);

export default UserRoutes;
