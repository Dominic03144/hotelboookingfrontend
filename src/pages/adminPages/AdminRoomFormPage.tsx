import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  useCreateRoomMutation,
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
  type Room,
} from "../../features/admin/RoomsApi";

// Hotel interface matching backend response
interface Hotel {
  hotelId: number;
  name: string; // we map hotelName -> name
}

export default function AdminRoomFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data, isLoading } = useGetRoomByIdQuery(Number(id), {
    skip: !id,
  });

  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();

  const [hotels, setHotels] = useState<Hotel[]>([]);

  // Use Partial<Room> to allow partial form state
  const [form, setForm] = useState<Partial<Room>>({
    roomType: "",
    pricePerNight: "", // keep as string for input control
    capacity: 1,
    amenities: "",
    isAvailable: true,
    imageUrl: "",
    hotelId: undefined,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        pricePerNight: String(data.pricePerNight), // string for input
      });
    }
  }, [data]);

  // Fetch hotels to populate dropdown
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("/api/hotels");
        const mapped = res.data.map((h: any) => ({
          hotelId: h.hotelId,
          name: h.hotelName,
        }));
        setHotels(mapped);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load hotels");
      }
    };
    fetchHotels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.roomType || !form.pricePerNight || !form.hotelId) {
      toast.error("❌ Please fill all required fields");
      return;
    }

    const payload = {
      roomType: form.roomType,
      pricePerNight: Number(form.pricePerNight), // ✅ convert string -> number here
      capacity: Number(form.capacity),
      amenities: form.amenities ?? "",
      isAvailable: form.isAvailable ?? true,
      imageUrl: form.imageUrl ?? "",
      hotelId: Number(form.hotelId),
    };

    console.log("Submitting payload:", payload);

    try {
      if (isEdit) {
        await updateRoom({ ...payload, roomId: Number(id) }).unwrap();
        toast.success("✅ Room updated");
      } else {
        await createRoom(payload).unwrap();
        toast.success("✅ Room created");
      }
      navigate("/admin/rooms");
    } catch (error: any) {
      console.error("API error response:", error);

      if (error?.data?.errors) {
        const errors = error.data.errors;
        const messages = Object.entries(errors)
          .map(([field, msgs]) =>
            `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
          )
          .join("\n");
        toast.error(`❌ Validation errors:\n${messages}`);
      } else if (error?.data?.message) {
        toast.error(`❌ Error: ${error.data.message}`);
      } else {
        toast.error(`❌ Failed to ${isEdit ? "update" : "create"} room`);
      }
    }
  };

  if (isEdit && isLoading) return <p>Loading room...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4">
        {isEdit ? "✏️ Edit Room" : "➕ Add Room"}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="flex flex-col">
          <span className="mb-1">Room Type</span>
          <input
            type="text"
            placeholder="Room Type"
            value={form.roomType ?? ""}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1">Price Per Night</span>
          <input
            type="number"
            placeholder="Price Per Night"
            value={form.pricePerNight ?? ""}
            onChange={(e) =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
            className="border p-2 rounded"
            step="0.01"
            min="0"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1">Capacity</span>
          <input
            type="number"
            placeholder="Capacity"
            min={1}
            value={form.capacity ?? 1}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1">Hotel</span>
          <select
            value={form.hotelId ?? ""}
            onChange={(e) =>
              setForm({ ...form, hotelId: Number(e.target.value) })
            }
            className="border p-2 rounded"
          >
            <option value="">Select a hotel</option>
            {hotels.length === 0 ? (
              <option disabled>No hotels found</option>
            ) : (
              hotels.map((hotel) => (
                <option key={hotel.hotelId} value={hotel.hotelId}>
                  {hotel.name}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="mb-1">Amenities</span>
          <input
            type="text"
            placeholder="Amenities"
            value={form.amenities ?? ""}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1">Image URL</span>
          <input
            type="text"
            placeholder="Image URL"
            value={form.imageUrl ?? ""}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isAvailable ?? false}
            onChange={(e) =>
              setForm({ ...form, isAvailable: e.target.checked })
            }
          />
          Available
        </label>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Save Changes" : "Create Room"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/rooms")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
