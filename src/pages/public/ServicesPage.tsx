import { useNavigate } from "react-router-dom";

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
        >
          ← Back
        </button>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-12">
          🛎️ Our Services
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* 🔹 Hotel Booking */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">🏨</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Hotel Booking
            </h2>
            <p className="text-gray-600">
              Book hotels across Kenya and beyond with real-time availability and affordable pricing.
            </p>
          </div>

          {/* 🔹 Customer Support */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">📞</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Customer Support
            </h2>
            <p className="text-gray-600">
              Get 24/7 help for bookings, payments, or account-related issues from our support team.
            </p>
          </div>

          {/* 🔹 Secure Payments */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">💳</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Secure Payments
            </h2>
            <p className="text-gray-600">
              Make payments safely using M-Pesa, bank cards, and mobile banking options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
