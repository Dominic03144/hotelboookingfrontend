import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Booking = {
  bookingId: number;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  guests: number;
  totalAmount: number;
  specialRequests?: string | null;
};

type Payment = {
  paymentId: number;
  bookingId: number;
  amount: string;
  paymentStatus: string;
  transactionId: string;
  receiptUrl: string | null;
};

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:8080/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  async function fetchPayments() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8080/api/payments/my-payments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data.payments)) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error("❌ Failed to fetch payments:", err);
    }
  }

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, []);

  async function cancelBooking(bookingId: number) {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchBookings();
    } catch {
      alert("Failed to cancel booking");
    }
  }

  async function confirmBooking(bookingId: number) {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/bookings/${bookingId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchBookings();
    } catch {
      alert("Failed to confirm booking");
    }
  }

  if (loading)
    return <p className="text-center text-gray-600 p-6">Loading your bookings...</p>;
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Your Bookings</h1>
      {bookings.length === 0 && (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}
      <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-blue-50">
            <tr>
              <th className="border p-3 text-left">Hotel</th>
              <th className="border p-3 text-left">Room</th>
              <th className="border p-3 text-left">Check-in</th>
              <th className="border p-3 text-left">Check-out</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Guests</th>
              <th className="border p-3 text-left">Amount</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const payment = payments.find(p => p.bookingId === b.bookingId);
              return (
                <tr key={b.bookingId} className="hover:bg-gray-50">
                  <td className="border p-3">{b.hotelName}</td>
                  <td className="border p-3">{b.roomType}</td>
                  <td className="border p-3">
                    {new Date(b.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    <StatusBadge status={b.bookingStatus} />
                  </td>
                  <td className="border p-3">{b.guests}</td>
                  <td className="border p-3">${b.totalAmount.toFixed(2)}</td>
                  <td className="border p-3">
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/profile/bookings/${b.bookingId}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 text-center"
                      >
                        View Details
                      </Link>

                      {payment?.receiptUrl ? (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 text-center"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 text-center">
                          No receipt yet
                        </span>
                      )}

                      {b.bookingStatus === "Pending" ? (
                        <div className="flex flex-col gap-1 mt-2">
                          <button
                            onClick={() => confirmBooking(b.bookingId)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => cancelBooking(b.bookingId)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <em className="text-xs text-gray-500">No actions</em>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "Pending" | "Confirmed" | "Cancelled" | string;
}) {
  let color = "";
  switch (status) {
    case "Confirmed":
      color = "bg-green-100 text-green-800";
      break;
    case "Pending":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "Cancelled":
      color = "bg-red-100 text-red-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${color}`}
    >
      {status}
    </span>
  );
}
