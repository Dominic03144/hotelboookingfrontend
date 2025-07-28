import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import type { Room } from "../types/room";
import { differenceInDays, format } from "date-fns";
import { useAuth } from "../context/authContext"; // ✅ import your auth hook

const BookRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // ✅ get user

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.info("Please log in to continue.");
      navigate("/login", {
        replace: true,
        state: {
          from: location,
          message: "Please log in to continue.",
        },
      });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (!roomId) {
      setError("No room ID provided.");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`https://hotelroombooking-jmh1.onrender.com/api/rooms/${roomId}`);
        if (!res.ok) throw new Error(`Failed to fetch room. Status: ${res.status}`);
        const data: Room = await res.json();
        setRoom(data);
      } catch (err: any) {
        setError(err.message || "Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const nights =
    checkInDate && checkOutDate
      ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
      : 0;

  const totalPrice =
    room && nights > 0 ? room.pricePerNight * nights * guests : 0;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId || !room) return;

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`https://hotelroombooking-jmh1.onrender.com/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          roomId: room.roomId,
          checkInDate,
          checkOutDate,
          guests,
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Booking failed.");
        return;
      }

      toast.success("✅ Booking created successfully! Redirecting to payment...");
      navigate(`/payment/${data.booking.bookingId}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading room details...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!room) return <p className="p-6 text-gray-600">Room not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{room.roomType}</h1>
      <p className="text-gray-700 mb-1">
        <strong>Price per night:</strong> ${room.pricePerNight}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Capacity:</strong> {room.capacity} guests
      </p>
      <p className="text-gray-700 mb-3">
        <strong>Amenities:</strong> {room.amenities}
      </p>
      <p className="text-gray-600">{room.description}</p>

      <form onSubmit={handleBook} className="mt-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Check-In Date
          </label>
          <input
            type="date"
            value={checkInDate}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Check-Out Date
          </label>
          <input
            type="date"
            value={checkOutDate}
            min={checkInDate || format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min={1}
            max={room.capacity}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {nights > 0 && (
          <div className="text-gray-800 text-lg font-medium">
            Total for {nights} {nights === 1 ? "night" : "nights"} & {guests}{" "}
            guest{guests > 1 ? "s" : ""}: ${totalPrice.toFixed(2)}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-lg"
        >
          {isSubmitting
            ? "Processing..."
            : `Book & Pay $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default BookRoomPage;
