import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Booking {
  bookingId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
  room: {
    name: string;
    price: number;
  };
  status: string; // 'confirmed' | 'cancelled'
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view your bookings.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings/my-bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("✅ My bookings:", res.data);
        setBookings(res.data.bookings || []);
      } catch (error: any) {
        console.error("❌ Error fetching bookings:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch your bookings. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId: number) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to cancel bookings.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("✅ Cancel response:", res.data);
      toast.success(res.data.message || "Booking cancelled.");

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (error: any) {
      console.error("❌ Cancel error:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel booking."
      );
    }
  };

  if (loading) {
    return <div className="p-4">Loading your bookings...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="border p-4 rounded shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">
                Room: {booking.room.name}
              </h2>
              <p>
                <strong>Check-in:</strong> {booking.checkInDate}
              </p>
              <p>
                <strong>Check-out:</strong> {booking.checkOutDate}
              </p>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              <p>
                <strong>Total Amount:</strong> ${booking.totalAmount}
              </p>
              {booking.specialRequests && (
                <p>
                  <strong>Special Requests:</strong>{" "}
                  {booking.specialRequests}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Booked on: {new Date(booking.createdAt).toLocaleString()}
              </p>
              <p
                className={`mt-2 font-semibold ${
                  booking.status === "cancelled"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                Status: {booking.status}
              </p>

              {booking.status !== "cancelled" && (
                <button
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};

export default MyBookings;
