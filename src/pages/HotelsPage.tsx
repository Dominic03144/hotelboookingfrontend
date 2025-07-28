import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelCard, { type Hotel } from "../components/auth/HotelCard";

// ✅ Import local hotel images
import grandPlazaImg from "../assets/hotels/grand-plaza.jpg";
import coastalParadiseImg from "../assets/hotels/coastal-paradise.jpg";
import westonHotelImg from "../assets/hotels/weston-hotel.jpg";
import hustlerHotelImg from "../assets/hotels/hustler-hotel.jpg";

// ✅ Map hotel names to images
const hotelImages: Record<string, string> = {
  "Grand Plaza Hotel": grandPlazaImg,
  "Coastal Paradise Resort": coastalParadiseImg,
  "Weston Hotel": westonHotelImg,
  "Hustler Hotel": hustlerHotelImg,
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/hotels`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: Hotel[] = await res.json();
        setHotels(data);
      } catch (err) {
        console.error("❌ Failed to fetch hotels:", err);
        setError("Failed to load hotels.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleViewDetails = (hotelId: number) => {
    navigate(`/hotels/${hotelId}`);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-20 text-lg animate-pulse">
        Loading hotels...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 mt-20 text-lg">{error}</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center drop-shadow-sm">
          🏨 Available Hotels
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          {hotels.map((hotel) => {
            const imageSrc =
              hotelImages[hotel.hotelName] ||
              "https://picsum.photos/seed/defaultfallback/400/200";

            return (
              <div
                key={hotel.hotelId}
                className="transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl w-full"
              >
                <HotelCard
                  hotel={hotel}
                  imageSrc={imageSrc}
                  onViewDetails={handleViewDetails}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
