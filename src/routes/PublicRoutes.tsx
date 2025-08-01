import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Pages that use MainLayout (with Navbar/Footer)
import LandingPage from "../pages/Public/HomePage";
import HotelsPage from "../pages/usePages/HotelsPage";
import HotelDetailsPage from "../pages/usePages/HotelDetailsPage";
import HotelRoomsPage from "../pages/usePages/HotelRoomsPage";
import RoomDetailsPage from "../pages/usePages/RoomsDetailsPage";
import ServicesPage from "../pages/Public/ServicesPage";
import AboutPage from "../pages/Public/AboutPage";
import ContactPage from "../pages/Public/ContactPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";

// Pages that should NOT use MainLayout (no Navbar/Footer)
import RegisterPage from "../pages/Public/RegisterPage";
import LoginPage from "../pages/Public/LoginPage";
import VerifyEmailPage from "../pages/Public/verifyEmailpage";

const PublicRoutes = (
  <>
    {/* Routes with MainLayout */}
    <Route element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:id" element={<HotelDetailsPage />} />
      <Route path="/hotels/:hotelId/rooms" element={<HotelRoomsPage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
    </Route>

    {/* Routes without MainLayout (no duplicate navbar) */}
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
  </>
);

export default PublicRoutes;
