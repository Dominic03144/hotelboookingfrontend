import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import type { Hotel } from "../types/hotel";

export default function AdminHotelsPage() {
  const { token } = useAuth();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newHotel, setNewHotel] = useState<
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

  const [editingHotel, setEditingHotel] = useState<
    (Hotel & { imageFile?: File }) | null
  >(null);

  // ✅ Fetch all hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/hotels");
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // ✅ Add Hotel
  const handleAddHotel = async () => {
    console.log("🚀 [handleAddHotel] Submitting:", newHotel);

    if (
      !newHotel.hotelName ||
      !newHotel.address ||
      !newHotel.city ||
      !newHotel.location
    ) {
      toast.error("Hotel name, address, city, and location are required");
      return;
    }

    const formData = new FormData();
    formData.append("hotelName", newHotel.hotelName.trim());
    formData.append("address", newHotel.address.trim());
    formData.append("city", newHotel.city.trim());
    formData.append("location", newHotel.location.trim());
    if (newHotel.contactPhone)
      formData.append("contactPhone", newHotel.contactPhone.trim());
    if (newHotel.category) formData.append("category", newHotel.category.trim());
    if (newHotel.rating != null)
      formData.append("rating", newHotel.rating.toString());
    if (newHotel.imageFile) formData.append("image", newHotel.imageFile);

    try {
      const res = await fetch("http://localhost:8080/api/hotels", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      console.log("✅ [handleAddHotel] API Response:", result);

      if (!res.ok) throw new Error(result.message || "Failed to create hotel");

      setHotels((prev) => [...prev, result.hotel]);

      // ✅ Reset form
      setNewHotel({
        hotelName: "",
        address: "",
        city: "",
        location: "",
        contactPhone: "",
        category: "",
        rating: undefined,
        imageUrl: "",
      });
      setShowAddForm(false);

      toast.success("✅ Hotel added successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add hotel");
    }
  };

  // ✅ Update Hotel
  const handleUpdateHotel = async () => {
    if (!editingHotel) return;

    console.log("🚀 [handleUpdateHotel] Updating:", editingHotel);

    const formData = new FormData();
    formData.append("hotelName", editingHotel.hotelName.trim());
    formData.append("address", editingHotel.address.trim());
    formData.append("city", editingHotel.city.trim());
    formData.append("location", editingHotel.location.trim());
    if (editingHotel.contactPhone)
      formData.append("contactPhone", editingHotel.contactPhone.trim());
    if (editingHotel.category)
      formData.append("category", editingHotel.category.trim());
    if (editingHotel.rating != null)
      formData.append("rating", editingHotel.rating.toString());
    if (editingHotel.imageFile)
      formData.append("image", editingHotel.imageFile);

    try {
      const res = await fetch(
        `http://localhost:8080/api/hotels/${editingHotel.hotelId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const updated = await res.json();
      console.log("✅ [handleUpdateHotel] API Response:", updated);

      if (!res.ok) throw new Error(updated.message || "Failed to update hotel");

      setHotels((prev) =>
        prev.map((h) =>
          h.hotelId === updated.hotel.hotelId ? updated.hotel : h
        )
      );
      setEditingHotel(null);
      toast.success("✅ Hotel updated");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update hotel");
    }
  };

  // ✅ Delete Hotel
  const handleDeleteHotel = async (hotelId: number) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="mb-2 font-medium">⚠️ Confirm delete?</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:8080/api/hotels/${hotelId}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (!res.ok) throw new Error("Failed to delete hotel");
                  setHotels((prev) =>
                    prev.filter((h) => h.hotelId !== hotelId)
                  );
                  toast.success("✅ Hotel deleted");
                } catch (err) {
                  console.error(err);
                  toast.error("❌ Failed to delete hotel");
                } finally {
                  closeToast();
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  if (loading) return <p className="p-6 text-gray-500">Loading hotels...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">
        🏨 Hotels Manager
      </h1>

      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
        >
          ➕ Add New Hotel
        </button>
      ) : (
        <div className="border p-6 rounded-lg shadow bg-gray-50 mb-6">
          <h2 className="text-2xl mb-4 font-semibold">New Hotel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Hotel Name", "hotelName"],
              ["Address", "address"],
              ["City", "city"],
              ["Location", "location"],
              ["Contact Phone", "contactPhone"],
              ["Category", "category"],
            ].map(([label, key]) => (
              <input
                key={key}
                type="text"
                placeholder={label}
                value={(newHotel as any)[key] ?? ""}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, [key]: e.target.value })
                }
                className="border p-3 rounded w-full"
              />
            ))}
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={newHotel.rating ?? ""}
              onChange={(e) =>
                setNewHotel({
                  ...newHotel,
                  rating:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="border p-3 rounded w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewHotel({ ...newHotel, imageFile: e.target.files?.[0] })
              }
              className="border p-3 rounded w-full"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => {
                console.log("✅ [UI] Save Hotel button clicked");
                handleAddHotel();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
            >
              ✅ Save Hotel
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-400 hover:bg-gray-500 px-5 py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Location</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.hotelId} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{hotel.hotelName}</td>
                <td className="border px-3 py-2">{hotel.address}</td>
                <td className="border px-3 py-2">{hotel.city}</td>
                <td className="border px-3 py-2">{hotel.location}</td>
                <td className="border px-3 py-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingHotel(hotel)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteHotel(hotel.hotelId)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingHotel && (
        <div className="mt-8 border p-6 rounded-lg shadow bg-yellow-50">
          <h2 className="text-2xl mb-4 font-semibold">Edit Hotel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Hotel Name", "hotelName"],
              ["Address", "address"],
              ["City", "city"],
              ["Location", "location"],
              ["Contact Phone", "contactPhone"],
              ["Category", "category"],
            ].map(([label, key]) => (
              <input
                key={key}
                type="text"
                placeholder={label}
                value={(editingHotel as any)[key] ?? ""}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, [key]: e.target.value })
                }
                className="border p-3 rounded w-full"
              />
            ))}
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={editingHotel.rating ?? ""}
              onChange={(e) =>
                setEditingHotel({
                  ...editingHotel,
                  rating:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                })
              }
              className="border p-3 rounded w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditingHotel({
                  ...editingHotel,
                  imageFile: e.target.files?.[0],
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleUpdateHotel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
            >
              ✅ Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingHotel(null)}
              className="bg-gray-400 hover:bg-gray-500 px-5 py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
