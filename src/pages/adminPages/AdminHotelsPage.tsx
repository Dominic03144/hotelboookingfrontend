import { useEffect, useState } from "react";
import API from "../../utils/axios";
import type { Hotel } from "../../types/hotel";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [, setShowAddModal] = useState(false);

  const [] = useState<Omit<Hotel, "hotelId"> & { imageFile?: File }>({
    hotelName: "",
    address: "",
    city: "",
    location: "",
    contactPhone: "",
    category: "",
    rating: undefined,
    imageUrl: "",
  });

  const [] = useState<(Hotel & { imageFile?: File }) | null>(null);

  // ✅ Fetch all hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await API.get("/hotels");
        setHotels(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Hotels Page</h2>

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add New Hotel
      </button>

      {hotels.length === 0 ? (
        <p>No hotels available.</p>
      ) : (
        <ul className="space-y-4">
          {hotels.map((hotel) => (
            <li key={hotel.hotelId} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
              <p>{hotel.city} - {hotel.address}</p>
              <p>Category: {hotel.category}</p>
              <p>Contact: {hotel.contactPhone}</p>
              <p>Rating: {hotel.rating}</p>
              {hotel.imageUrl && (
                <img src={hotel.imageUrl} alt={hotel.hotelName} className="w-48 mt-2 rounded" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
