import { useEffect, useState } from "react";
import API from "../utils/axios"; // ✅ use your axios instance!
import type { Hotel } from "../types/hotel";

export default function AdminHotelsPage() {
  const [, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [] = useState(false);

  const [] = useState<
    Omit<Hotel, "hotelId"> & { imageFile?: File }
  >({
    hotelName: "",
    address: "",
    city: "",
    location: "",
    contactPhone: "",
    category: "",
    rating: undefined,
    imageUrl: "",
  });

  const [] = useState<
    (Hotel & { imageFile?: File }) | null
  >(null);

  // ✅ Fetch all hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await API.get("/api/hotels");
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
    <div> {/* Keep your UI as is here */} </div>
  );
}
