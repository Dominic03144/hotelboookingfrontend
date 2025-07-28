// src/pages/UserBookingsPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";

type Booking = {
  bookingId: number;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  totalAmount: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings/my`, {
          withCredentials: true,
        });
        setBookings(response.data.bookings || []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch bookings.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (bookings.length === 0) return <p>You have no bookings.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.bookingId}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded"
          >
            <h2 className="font-semibold text-lg">{booking.hotelName}</h2>
            <p>Room Type: {booking.roomType}</p>
            <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p>Status: <span className="font-medium">{booking.bookingStatus}</span></p>
            <p>Total Amount: ${booking.totalAmount.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
