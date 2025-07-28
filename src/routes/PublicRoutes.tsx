// ✅ src/routes/PublicRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/public/HomePage";
import HotelsPage from "../pages/usePages/HotelsPage";
import HotelDetailsPage from "../pages/usePages/HotelDetailsPage";
import HotelRoomsPage from "../pages/usePages/HotelRoomsPage";
import RoomDetailsPage from "../pages/usePages/RoomsDetailsPage";
import ServicesPage from "../pages/public/ServicesPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import RegisterPage from "../pages/public/RegisterPage";
import LoginPage from "../pages/public/LoginPage";
import VerifyEmailPage from "../pages/public/verifyEmailpage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";

const PublicRoutes = (
  <Route element={<MainLayout />}>
    <Route index element={<LandingPage />} />
    <Route path="/hotels" element={<HotelsPage />} />
    <Route path="/hotels/:id" element={<HotelDetailsPage />} />
    <Route path="/hotels/:hotelId/rooms" element={<HotelRoomsPage />} />
    <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/payment-success" element={<PaymentSuccessPage />} />
  </Route>
);

export default PublicRoutes;
