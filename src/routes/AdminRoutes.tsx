import { Route } from "react-router-dom";
import ProtectedAdminRoute from "../components/auth/ProtectedAdminRoute";
import AdminDashboard from "../admin/AdminDashboard";

import AdminOverview from "../pages/adminPages/AdminOverview";
import AdminUsersPage from "../pages/adminPages/AdminUserPage";
import AdminBookingsPage from "../pages/adminPages/AdminBookingPage";
import AdminRoomsPage from "../pages/adminPages/AdminRoomsPage";
import AdminHotelsPage from "../pages/adminPages/AdminHotelsPage";
import AdminRoomFormPage from "../pages/adminPages/AdminRoomFormPage";
import AdminTicketsPage from "../pages/adminPages/AdminTicketsPage";
import AdminPaymentsPage from "../pages/adminPages/AdminPaymentPage";
import AdminProfilePage from "../pages/adminPages/AdminProfilePage";
import UserPage from "../pages/usePages/UserPage";

const AdminRoutes = (
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
);

export default AdminRoutes;
