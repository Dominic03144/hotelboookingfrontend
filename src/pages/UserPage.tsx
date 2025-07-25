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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hotelroombooking-jmh1.onrender.com";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings/my`); 
        setBookings(response.data.bookings);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p>{error}</p>;
  if (bookings.length === 0) return <p>You have no bookings.</p>;

  return (
    <div>
      <h1>Your Bookings</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.bookingId}>
            <strong>{booking.hotelName}</strong> - {booking.roomType} <br />
            Check-in: {new Date(booking.checkInDate).toLocaleDateString()} <br />
            Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} <br />
            Status: {booking.bookingStatus} <br />
            Total: ${booking.totalAmount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
