import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types/room";
import { motion } from "framer-motion";

type Hotel = {
  hotelId: number;
  hotelName: string;
};

export default function HotelRoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        setLoading(true);

        const hotelRes = await fetch(`https://hotelroombooking-jmh1.onrender.com/api/hotels`);
        if (!hotelRes.ok) throw new Error("Failed to fetch hotels");
        const hotelData: Hotel[] = await hotelRes.json();
        const currentHotel = hotelData.find(h => h.hotelId === Number(hotelId));
        if (!currentHotel) throw new Error("Hotel not found");
        setHotel(currentHotel);

        const roomRes = await fetch(`https://hotelroombooking-jmh1.onrender.com/api/rooms`);
        if (!roomRes.ok) throw new Error("Failed to fetch rooms");
        const allRooms: any[] = await roomRes.json();

        const filtered = allRooms
          .filter(r => r.hotelId === Number(hotelId))
          .map(r => ({
            ...r,
            pricePerNight: Number(r.pricePerNight),
          }));

        setRooms(filtered as Room[]);
      } catch (err: any) {
        console.error("❌ Error fetching data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelAndRooms();
    }
  }, [hotelId]);

  useEffect(() => {
    let updated = [...rooms];

    if (search.trim()) {
      updated = updated.filter((room) =>
        room.roomType.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (maxPrice !== null) {
      updated = updated.filter((room) => room.pricePerNight <= maxPrice);
    }

    updated.sort((a, b) =>
      sortOrder === "asc"
        ? a.pricePerNight - b.pricePerNight
        : b.pricePerNight - a.pricePerNight
    );

    setFilteredRooms(updated);
  }, [rooms, search, maxPrice, sortOrder]);

  if (loading) return <p className="p-6 text-gray-300">Loading rooms...</p>;
  if (error) return <p className="p-6 text-red-400">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-300">
          Rooms at {hotel?.hotelName}
        </h1>
        <button
          onClick={() => navigate("/hotels")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ⬅ Back to All Hotels
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by room type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : null)
          }
          className="p-2 rounded text-black"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="p-2 rounded text-black"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {filteredRooms.length === 0 ? (
        <p className="text-gray-400">No rooms match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.map((room) => (
            <motion.div
              key={room.roomId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
