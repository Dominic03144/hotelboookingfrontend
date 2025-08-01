import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { DateRange, type Range } from "react-date-range";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { useAuth } from "../../context/authContext";

export default function RoomDetailsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth(); // ✅ Correct: only get user from context
  const token = user?.token || null; // ✅ Always get token from user object

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [room, setRoom] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  console.log("[RoomDetailsPage] Initial token:", token);
  console.log("[RoomDetailsPage] Logged in user:", user);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;

      console.log("[fetchRoom] Fetching room with ID:", roomId);

      try {
        const res = await api.get(`/rooms/${roomId}`);
        console.log("[fetchRoom] API response:", res.data);

        const roomData = {
          ...res.data,
          pricePerNight: Number(res.data.pricePerNight),
        };
        setRoom(roomData);
      } catch (err) {
        console.error("[fetchRoom] Error fetching room:", err);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleBook = () => {
    if (!room) {
      alert("Room data not loaded yet.");
      return;
    }
    console.log("[handleBook] Show confirmation modal");
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

    console.log("[confirmBooking] Booking data:", {
      roomId,
      checkIn,
      checkOut,
      nights,
      totalAmount,
      token,
      user,
    });

    if (!token) {
      console.error("[confirmBooking] ERROR: Token is missing!");
      alert("You must be logged in to confirm booking.");
      return;
    }

    try {
      // Step 1: Create the booking
      const bookingPayload = {
        roomId: Number(roomId),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: 1, // Assuming 1 guest for simplicity
        totalAmount: totalAmount,
      };
      console.log("[confirmBooking] POST /bookings payload:", bookingPayload);
      console.log(
        "[confirmBooking] Using Bearer token for /bookings:",
        `Bearer ${token}`
      );

      const bookingRes = await api.post("/bookings", bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[confirmBooking] Booking response:", bookingRes.data);

      const bookingId = bookingRes.data.booking.bookingId;

      // Step 2: Create checkout session for payment
      const paymentPayload = {
        bookingId,
        amount: totalAmount * 100, // Amount in cents
      };
      console.log(
        "[confirmBooking] POST /payments/create-checkout-session payload:",
        paymentPayload
      );
      console.log(
        "[confirmBooking] Using Bearer token for /payments:",
        `Bearer ${token}`
      );

      const checkoutRes = await api.post(
        "/payments/create-checkout-session",
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("[confirmBooking] Checkout response:", checkoutRes.data);

      // Redirect to the checkout URL
      window.location.href = checkoutRes.data.url;
    } catch (err: any) {
      console.error("[confirmBooking] Error:", err);
      // Provide more user-friendly error messages based on the response
      const errorMessage =
        err.response?.data?.message ||
        "An unexpected error occurred during booking or payment. Please try again.";
      alert(errorMessage);
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
            onChange={(ranges) => {
              console.log("[DateRange] Updated range:", ranges.selection);
              setDateRange([ranges.selection]);
            }}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {" "}
          {/* Added z-50 for modal */}
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