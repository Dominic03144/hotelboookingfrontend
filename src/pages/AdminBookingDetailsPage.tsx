import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Printer } from "lucide-react";

interface BookingDetail {
  bookingId: number;
  userName: string;
  userEmail?: string;
  hotelName: string;
  hotelAddress?: string;
  roomType: string;
  pricePerNight?: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  specialRequests?: string;
}

const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooking = useCallback(async () => {
    try {
      if (!id) throw new Error("Booking ID is missing");
      const res = await fetch(`https://hotelroombooking-jmh1.onrender.comapi/bookings/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch booking: ${res.statusText}`);
      const data: BookingDetail = await res.json();
      setBooking(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setError("");
    setBooking(null);
    fetchBooking();
  }, [fetchBooking]);

  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return;

    const confirmed = confirm(`Change status to "${newStatus}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/${booking.bookingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setBooking({ ...booking, status: newStatus });
      alert("✅ Status updated successfully!");
    } catch {
      alert("❌ Failed to update status.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 space-x-2">
        <Loader className="animate-spin w-6 h-6" />
        <span>Loading booking details...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 space-y-4">
        <p>⚠️ {error}</p>
        <button
          onClick={fetchBooking}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Booking not found.
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 print:p-0">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        &larr; Back to Bookings
      </button>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-700">
          Booking Details (ID: {booking.bookingId})
        </h1>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <Printer size={18} />
          <span>Print</span>
        </button>
      </div>

      <div className="space-y-6 text-gray-800 bg-white shadow p-6 rounded">
        <section>
          <h2 className="text-xl font-semibold mb-1">Guest Information</h2>
          <p><strong>Name:</strong> {booking.userName}</p>
          {booking.userEmail && <p><strong>Email:</strong> {booking.userEmail}</p>}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">Hotel Information</h2>
          <p><strong>Hotel:</strong> {booking.hotelName}</p>
          {booking.hotelAddress && (
            <p><strong>Address:</strong> {booking.hotelAddress}</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">Room Details</h2>
          <p><strong>Room Type:</strong> {booking.roomType}</p>
          {booking.pricePerNight !== undefined && (
            <p><strong>Price per Night:</strong> ${booking.pricePerNight.toFixed(2)}</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">Booking Dates</h2>
          <p><strong>Check-In:</strong> {booking.checkInDate}</p>
          <p><strong>Check-Out:</strong> {booking.checkOutDate}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">Status</h2>
          <p className="mb-2">{booking.status}</p>
          <select
            value={booking.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </section>

        {booking.specialRequests && (
          <section>
            <h2 className="text-xl font-semibold mb-1">Special Requests</h2>
            <p>{booking.specialRequests}</p>
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminBookingDetailPage;
