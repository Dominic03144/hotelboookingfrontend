import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // ✅ use your AuthContext!

interface PaymentStatus {
  paymentStatus: string;
  bookingStatus: string;
}

export default function PaymentSuccessPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(search).get("session_id")?.trim() || "";

  // ✅ Pull token + rehydrated from your AuthContext
  const { token, rehydrated } = useAuth();

  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Fetch payment status from backend using valid token
  const fetchPaymentStatus = useCallback(async () => {
    if (!sessionId) {
      setError("Missing or invalid session ID in URL.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("You must be logged in to view payment status.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/payments/${sessionId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (res.status === 404) {
          setError("Payment or booking not found. Please contact support.");
        } else {
          setError(`Server responded with status ${res.status}`);
        }
        setStatus(null);
      } else {
        const data = await res.json();
        setStatus(data);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to verify payment. Check your connection and try again.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId, token]);

  // ✅ Wait for auth to rehydrate before fetching
  useEffect(() => {
    if (!rehydrated) return; // Don't run until ready!

    fetchPaymentStatus();

    const intervalId = setInterval(() => {
      fetchPaymentStatus();
    }, 10000); // Poll every 10s

    return () => clearInterval(intervalId);
  }, [fetchPaymentStatus, rehydrated, retryCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 flex flex-col justify-center items-center px-6 py-12 text-white font-sans">
      {loading && (
        <p className="text-lg animate-pulse select-none" role="status" aria-live="polite">
          🔄 Verifying your payment...
        </p>
      )}

      {error && (
        <div className="bg-red-700 bg-opacity-80 rounded-lg p-6 max-w-md text-center shadow-lg" role="alert">
          <p className="text-xl font-semibold mb-4">❌ {error}</p>
          <button
            className="mt-2 inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded shadow transition duration-300 font-medium"
            onClick={() => {
              setRetryCount((c) => c + 1);
              setError(null);
            }}
          >
            Retry
          </button>
          <button
            className="mt-2 ml-4 inline-block px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded shadow transition duration-300 font-medium"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      )}

      {status && !loading && !error && (
        <div
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-10 max-w-lg w-full shadow-xl text-center"
          role="main"
          aria-live="polite"
        >
          <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-green-500 bg-opacity-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-md">
            ✅ Payment Successful!
          </h1>
          <p className="text-xl mb-2">
            Your payment status:{" "}
            <span className="font-semibold">{status.paymentStatus}</span>
          </p>
          <p className="text-xl mb-6">
            Your booking status:{" "}
            <span className="font-semibold">{status.bookingStatus || "Pending"}</span>
          </p>

          <p className="mb-6 text-lg">
            🎉 Please check your email for your booking confirmation and details.
          </p>

          <button
            onClick={() => {
              navigator.clipboard.writeText(sessionId);
              alert("Session ID copied to clipboard!");
            }}
            className="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow font-semibold transition"
            aria-label="Copy session ID"
            title="Copy session ID"
          >
            📋 Copy Session ID
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition duration-300"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
