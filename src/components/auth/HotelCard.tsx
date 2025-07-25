import { useNavigate } from "react-router-dom";

export interface Hotel {
  name(name: any): unknown;
  id: number;
  imageUrl: string;
  hotelId: number;
  hotelName: string;
  city: string;
  location: string;
  address: string;
  contactPhone?: string;
  category?: string;
  rating?: number; // changed to number for better type safety
  galleryImages?: string[];
}

interface HotelCardProps {
  hotel: Hotel;
  imageSrc?: string | null; // fallback image passed from HotelsPage
  onViewDetails: (id: number) => void;
}

export default function HotelCard({
  hotel,
  imageSrc,
  onViewDetails,
}: HotelCardProps) {
  const navigate = useNavigate();

  // ✅ Pick image: API `imageUrl` or fallback from props or placeholder
  const mainImage = imageSrc || "https://picsum.photos/seed/fallback/400/200";

  // ✅ Use gallery image for hover if available
  const hoverImage =
    hotel.galleryImages && hotel.galleryImages.length > 0
      ? hotel.galleryImages[0]
      : mainImage;

  const handleViewRooms = () => {
    navigate(`/hotels/${hotel.hotelId}/rooms`);
  };

  return (
    <div className="border rounded-lg shadow-md p-5 bg-white w-full max-w-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <h2 className="text-2xl font-bold mb-1">{hotel.hotelName}</h2>
      <p className="text-gray-600 mb-1">
        {hotel.city}, {hotel.location}
      </p>
      <p className="mb-2">{hotel.address}</p>

      <div className="relative w-full h-48 overflow-hidden rounded-lg mb-3">
        {mainImage ? (
          <>
            {/* ✅ Base image */}
            <img
              src={mainImage}
              alt={hotel.hotelName}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 hover:opacity-0"
            />
            {/* ✅ Hover image, different from base */}
            {hoverImage && hoverImage !== mainImage && (
              <img
                src={hoverImage}
                alt={`${hotel.hotelName} gallery`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {hotel.rating && (
        <p className="text-yellow-600 font-medium mb-4">
          ⭐ Rating: {hotel.rating.toFixed(1)}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onViewDetails(hotel.hotelId)}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
        >
          View Details
        </button>
        <button
          onClick={handleViewRooms}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
        >
          View Rooms
        </button>
      </div>
    </div>
  );
}
