// ✅ src/pages/RoomDetailsPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/axios"; // ✅ use the configured api instance
import { DateRange, type Range } from "react-date-range";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function RoomDetailsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [room, setRoom] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`); // ✅ no extra /api
        const roomData = {
          ...res.data,
          pricePerNight: Number(res.data.pricePerNight),
        };
        setRoom(roomData);
      } catch (err) {
        console.error("Error fetching room:", err);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBook = () => {
    if (!room) {
      alert("Room data not loaded yet.");
      return;
    }
    setShowConfirm(true);
  };

  const nights = Math.max(
    Math.ceil(
      ((dateRange[0].endDate?.getTime() || 0) -
        (dateRange[0].startDate?.getTime() || 0)) /
        (1000 * 60 * 60 * 24)
    ),
    0
  );

  const totalAmount = room && nights > 0 ? room.pricePerNight * nights : 0;

  const confirmBooking = async () => {
    if (!room) {
      alert("Room data missing.");
      return;
    }

    const checkIn = dateRange[0].startDate?.toISOString().slice(0, 10);
    const checkOut = dateRange[0].endDate?.toISOString().slice(0, 10);

    if (!checkIn || !checkOut) {
      alert("Please select valid dates.");
      return;
    }

    if (nights <= 0) {
      alert("Select a valid date range.");
      return;
    }

    try {
      const bookingRes = await api.post("/bookings", {
        roomId: Number(roomId),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: 1,
        totalAmount: totalAmount,
      });

      const bookingId = bookingRes.data.booking.bookingId;

      const checkoutRes = await api.post(
        "/payments/create-checkout-session",
        {
          bookingId,
          amount: totalAmount * 100, // cents for Stripe
        }
      );

      window.location.href = checkoutRes.data.url;
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {room ? `Room Details: ${room.roomType}` : "Loading..."}
      </h1>

      {room && (
        <p className="text-lg mb-6">
          <strong>Price per night:</strong> ${room.pricePerNight} <br />
          <strong>Selected Nights:</strong> {nights} <br />
          <strong>Total Amount:</strong> ${totalAmount}
        </p>
      )}

      {room && (
        <div className="mb-6 border p-4 rounded-lg shadow">
          <DateRange
            ranges={dateRange}
            onChange={(ranges) => setDateRange([ranges.selection])}
            minDate={new Date()}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
        </div>
      )}

      {room && (
        <button
          onClick={handleBook}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Select Dates & Continue
        </button>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Booking</h2>
            <p>
              <strong>Check-in:</strong>{" "}
              {dateRange[0].startDate?.toDateString()}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {dateRange[0].endDate?.toDateString()}
            </p>
            <p>
              <strong>Total Nights:</strong> {nights}
            </p>
            <p className="mb-4">
              <strong>Total Amount:</strong> ${totalAmount}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={confirmBooking}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Confirm & Pay
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
