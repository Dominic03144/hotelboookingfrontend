import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import api from "../lib/axios"; // ✅ Use your custom Axios instance!

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const token = localStorage.getItem("token");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooking(res.data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId, token]);

  const handlePay = async () => {
    if (!bookingId || !booking) return;

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe.js failed to load");
      return;
    }

    try {
      const res = await api.post(
        "/payments/create-checkout-session",
        {
          bookingId: bookingId,
          amount: booking.totalAmount * 100,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading booking...</div>;
  }

  if (!booking) {
    return <div className="p-8 text-center text-red-600 font-semibold">Booking not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Payment Details</h1>

      <div className="space-y-4 text-gray-700 text-lg">
        <div className="flex justify-between">
          <span className="font-semibold">Room ID:</span>
          <span>{booking.roomId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Check-in:</span>
          <span>{booking.checkInDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Check-out:</span>
          <span>{booking.checkOutDate}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-green-700 mt-4">
          <span>Total:</span>
          <span>${booking.totalAmount}</span>
        </div>
      </div>

      <button
        onClick={handlePay}
        className="mt-8 w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-3 px-4 rounded-xl text-lg font-semibold shadow-md"
      >
        Pay Now
      </button>
    </div>
  );
}
