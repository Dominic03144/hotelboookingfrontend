import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type AdminBooking = {
  bookingId: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: string;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  specialRequests: string | null;

  customer: {
    firstname: string;
    lastname: string;
    email: string;
  };

  roomType: string;
  pricePerNight: string;
  hotelName: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.bookings);
    } catch (err: any) {
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`✅ Status updated to ${newStatus}`);
      fetchBookings();
    } catch {
      toast.error("❌ Failed to update status");
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("✅ Booking deleted");
      fetchBookings();
    } catch {
      toast.error("❌ Failed to delete");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading bookings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        Admin — All Bookings
      </h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Hotel</th>
                <th className="p-3 border">Room</th>
                <th className="p-3 border">Dates</th>
                <th className="p-3 border">Guests</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {b.customer.firstname} {b.customer.lastname}
                  </td>
                  <td className="border px-3 py-2">{b.customer.email}</td>
                  <td className="border px-3 py-2">{b.hotelName}</td>
                  <td className="border px-3 py-2">
                    {b.roomType}{" "}
                    <span className="text-gray-500">(${b.pricePerNight})</span>
                  </td>
                  <td className="border px-3 py-2">
                    {b.checkInDate} → {b.checkOutDate}
                  </td>
                  <td className="border px-3 py-2">{b.guests}</td>
                  <td className="border px-3 py-2">${b.totalAmount}</td>
                  <td className="border px-3 py-2">
                    <StatusBadge status={b.bookingStatus} />
                  </td>
                  <td className="border px-3 py-2 flex flex-col sm:flex-row gap-2">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) =>
                        handleStatusChange(b.bookingId, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleDelete(b.bookingId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
