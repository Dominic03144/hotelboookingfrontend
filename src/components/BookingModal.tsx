// ✅ src/components/BookingModal.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/authContext"; // ✅ Get token from context

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: {
    roomId: number;
    pricePerNight: number;
    roomType: string;
  } | null;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedRoom,
}) => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();
  const { token } = useAuth(); // ✅ Use AuthContext here

  useEffect(() => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const inDate = new Date(checkInDate);
      const outDate = new Date(checkOutDate);
      const nights =
        (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24);

      if (isNaN(nights) || nights < 1) {
        setTotalAmount(0);
      } else {
        setTotalAmount(Number(selectedRoom.pricePerNight) * nights);
      }
    } else {
      setTotalAmount(0);
    }
  }, [selectedRoom, checkInDate, checkOutDate]);

  const handleBooking = async () => {
    if (!selectedRoom) {
      toast.error("No room selected.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select valid check-in and check-out dates.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to book.");
      return;
    }

    const payload = {
      roomId: selectedRoom.roomId,
      checkInDate,
      checkOutDate,
      guests: numGuests,
      totalAmount,
      specialRequests,
    };

    console.log("📦 Booking payload:", payload);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/bookings",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Server response:", res.data);

      toast.success(res.data.message || "Booking successful!");

      onClose();

      navigate(`/rooms/${selectedRoom.roomId}`);
    } catch (error: any) {
      console.error("❌ Booking error:", error);
      toast.error(
        error.response?.data?.message || "Booking failed. Try again."
      );
    }
  };

  if (!isOpen || !selectedRoom) return null;

  const isDisabled = !checkInDate || !checkOutDate || totalAmount <= 0;

  return (
    <div className="booking-modal p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Book Room: {selectedRoom.roomType}
      </h2>

      <label className="block mb-2">
        Check-in:
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="block border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Check-out:
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="block border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Guests:
        <input
          type="number"
          min={1}
          value={numGuests}
          onChange={(e) => setNumGuests(Number(e.target.value))}
          className="block border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Special Requests:
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="block border p-2 w-full"
        />
      </label>

      <p className="font-semibold mb-4">
        Total Amount:{" "}
        <span className="text-green-600">${totalAmount.toFixed(2)}</span>
      </p>

      <button
        onClick={handleBooking}
        disabled={isDisabled}
        className={`px-4 py-2 bg-blue-600 text-white rounded ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        Confirm Booking
      </button>

      <button
        onClick={onClose}
        className="ml-4 px-4 py-2 border rounded hover:bg-gray-100"
      >
        Cancel
      </button>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default BookingModal;
