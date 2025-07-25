// ✅ src/pages/UserBookingsDashboard.tsx

import { useEffect, useState } from "react";
import axios from "axios";

type Booking = {
  bookingId: number;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  guests: number;
  specialRequests?: string | null;
};

export default function UserBookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch user bookings on mount
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        const res = await axios.get("/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.success && Array.isArray(res.data.bookings)) {
          setBookings(res.data.bookings);
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  async function cancelBooking(bookingId: number) {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, bookingStatus: "Cancelled" } : b
        )
      );
    } catch {
      alert("Failed to cancel booking");
    }
  }

  async function confirmBooking(bookingId: number) {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/bookings/${bookingId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, bookingStatus: "Confirmed" } : b
        )
      );
    } catch {
      alert("Failed to confirm booking");
    }
  }

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
      {bookings.length === 0 && <p>You have no bookings yet.</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Hotel</th>
              <th className="border p-2">Room</th>
              <th className="border p-2">Check-in</th>
              <th className="border p-2">Check-out</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Guests</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td className="border p-2">{b.hotelName}</td>
                <td className="border p-2">{b.roomType}</td>
                <td className="border p-2">
                  {new Date(b.checkInDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(b.checkOutDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{b.bookingStatus}</td>
                <td className="border p-2">{b.guests}</td>
                <td className="border p-2">
                  {b.bookingStatus === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmBooking(b.bookingId)}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => cancelBooking(b.bookingId)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {b.bookingStatus !== "Pending" && <em>No actions</em>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
