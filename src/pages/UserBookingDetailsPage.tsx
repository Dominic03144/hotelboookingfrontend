// ✅ src/pages/BookingDetailsPage.tsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Booking {
  bookingId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
  status: string;
  room: {
    name: string;
    description?: string;
    price: number;
    amenities?: string[];
  };
}

export default function BookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const { data, isLoading, error } = useQuery<Booking>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8080/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      return res.data.booking; // adjust if your API shape is different
    },
    enabled: !!bookingId && !!token,
  });

  if (!token) {
    navigate("/login");
    return null;
  }

  if (isLoading) return <div className="p-4">Loading booking details...</div>;
  if (error) return <div className="p-4">Failed to load booking.</div>;
  if (!data) return <div className="p-4">Booking not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>

      <h2 className="text-xl font-semibold mb-2">
        Room: {data.room.name}
      </h2>
      {data.room.description && (
        <p className="mb-2">{data.room.description}</p>
      )}

      <p>
        <strong>Check-in:</strong> {data.checkInDate}
      </p>
      <p>
        <strong>Check-out:</strong> {data.checkOutDate}
      </p>
      <p>
        <strong>Guests:</strong> {data.guests}
      </p>
      <p>
        <strong>Total Amount:</strong> ${data.totalAmount}
      </p>
      {data.specialRequests && (
        <p>
          <strong>Special Requests:</strong> {data.specialRequests}
        </p>
      )}
      <p className="text-sm text-gray-500">
        Booked on: {new Date(data.createdAt).toLocaleString()}
      </p>
      <p
        className={`mt-2 font-semibold ${
          data.status === "cancelled"
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        Status: {data.status}
      </p>

      {data.room.amenities && (
        <div className="mt-4">
          <strong>Amenities:</strong>
          <ul className="list-disc list-inside">
            {data.room.amenities.map((amenity, idx) => (
              <li key={idx}>{amenity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
