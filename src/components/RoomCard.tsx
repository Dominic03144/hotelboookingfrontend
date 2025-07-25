import React from "react";
import { useNavigate } from "react-router-dom";
import type { Room } from "../types/room";

// ✅ Existing room images
import deluxeRoomImg from "../assets/rooms/deluxe-room.jpg";
import suiteRoomImg from "../assets/rooms/suite-room.jpg";
import oceanViewImg from "../assets/rooms/ocean-view.jpg";
import familyVillaImg from "../assets/rooms/family-villa.jpg";

// ✅ Newly added room images
import rivielaRetreatImg from "../assets/rooms/riviela-retreat.jpg";
import villaVeronaImg from "../assets/rooms/villa-verona.jpg";
import urbanVeinsImg from "../assets/rooms/urban-veins.jpg";
import costaCoralImg from "../assets/rooms/costa-coral.jpg";

interface RoomCardProps {
  room: Room;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const roomImages: Record<string, string> = {
    Deluxe: deluxeRoomImg,
    Suite: suiteRoomImg,
    "Ocean View": oceanViewImg,
    "Family Villa": familyVillaImg,
    "Riviela Retreat": rivielaRetreatImg,
    "Villa Verona": villaVeronaImg,
    "Urban Veins": urbanVeinsImg,
    "Costa Coral": costaCoralImg,
  };

  const imageSrc = roomImages[room.roomType] || null;

  const handleBook = () => {
    navigate(`/rooms/${room.roomId}`);
  };

  const price = Number(room.pricePerNight);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center">
      {imageSrc ? (
        <img src={imageSrc} alt={room.roomType} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2">{room.roomType}</h2>
        <p className="mb-1 text-gray-700">
          <strong>Price:</strong>{" "}
          {isNaN(price) ? "N/A" : `$${price.toFixed(2)}`} / night
        </p>
        <p className="mb-1 text-gray-700">
          <strong>Capacity:</strong> {room.capacity} people
        </p>
        <p className="mb-4 text-gray-700">
          <strong>Amenities:</strong> {room.amenities}
        </p>

        <div className="mt-auto flex flex-wrap justify-center gap-2">
          <button
            onClick={handleBook}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Book Now
          </button>

          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
