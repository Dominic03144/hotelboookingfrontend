// ✅ src/components/admin/EditHotelForm.tsx

import { useState } from "react";
import { toast } from "react-toastify";
import type { Hotel } from "../../types/hotel";  // adjust path if needed

interface EditHotelFormProps {
  hotel: Hotel;
  token: string;
  onClose: () => void;
  onSave: (updatedHotel: Hotel) => void;
}

export default function EditHotelForm({
  hotel,
  token,
  onClose,
  onSave,
}: EditHotelFormProps) {
  const [form, setForm] = useState<Hotel>({ ...hotel });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      hotelName: form.hotelName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      location: form.location.trim(),
      contactPhone: form.contactPhone?.trim() || null,
      category: form.category?.trim() || null,
      rating: form.rating ?? 0,
      imageUrl: form.imageUrl.trim(),
    };

    try {
      const res = await fetch(`http://localhost:8080/api/hotels/${hotel.hotelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to update hotel");

      toast.success("✅ Hotel updated");
      onSave(result.hotel);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update hotel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 border p-4 rounded shadow bg-yellow-50">
      <h2 className="text-xl mb-2 font-semibold">✏️ Edit Hotel</h2>
      <input
        type="text"
        value={form.hotelName}
        onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="Hotel Name"
      />
      <input
        type="text"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="Address"
      />
      <input
        type="text"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="City"
      />
      <input
        type="text"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="Location"
      />
      <input
        type="text"
        value={form.contactPhone ?? ""}
        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="Contact Phone"
      />
      <input
        type="text"
        value={form.category ?? ""}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="Category"
      />
      <input
        type="number"
        step="0.1"
        value={form.rating ?? 0}
        onChange={(e) =>
          setForm({
            ...form,
            rating: e.target.value === "" ? 0 : Number(e.target.value),
          })
        }
        className="border p-2 rounded w-full mb-2"
        placeholder="Rating"
      />
      <input
        type="text"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className="border p-2 rounded w-full mb-2"
        placeholder="Image URL"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
