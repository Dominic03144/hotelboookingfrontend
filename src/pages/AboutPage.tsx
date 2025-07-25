
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/about-bg.jpg"; // adjust path as needed

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Lighter overlay for readability */}
      <div className="absolute inset-0 bg-white opacity-60"></div>

      <section className="relative max-w-4xl mx-auto px-6 py-16 text-black">
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
        >
          ← Back
        </button>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          ABOUT <span className="text-blue-600">HotelBook</span>
        </h1>

        <p className="text-lg leading-relaxed text-center">
          HotelBook is a modern hotel reservation platform designed to help you find and book the
          best stays across Kenya and beyond. We aim to make your travel experience easier,
          affordable, and stress-free.
        </p>

        <p className="text-lg leading-relaxed mt-6 text-center">
          Whether you're booking for business, vacation, or a weekend getaway, HotelBook ensures
          you have access to top-rated hotels with verified reviews and secure payments.
        </p>

        <div className="mt-10 border-t border-black/30 pt-8">
          <p className="text-center text-base text-black/70">
            Founded in <strong>2025</strong>, HotelBook is committed to innovation, trust, and
            excellent customer service—for both travelers and hoteliers alike.
          </p>
        </div>
      </section>
    </div>
  );
}
