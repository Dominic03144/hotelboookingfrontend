// src/components/admin/AddHotelForm.tsx
import React, { useState } from "react";
import axios from "axios";

export default function AddHotelForm() {
  const [formData, setFormData] = useState({
    hotelName: "",
    city: "",
    location: "",
    address: "",
    contactPhone: "",
    category: "",
    rating: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // For numeric rating: parse to number
      const payload = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
      };

      await axios.post("/api/hotels", payload);
      setMessage("✅ Hotel added successfully!");
      setFormData({
        hotelName: "",
        city: "",
        location: "",
        address: "",
        contactPhone: "",
        category: "",
        rating: "",
        imageUrl: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="hotelName"
          placeholder="Hotel Name"
          value={formData.hotelName}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          name="contactPhone"
          placeholder="Contact Phone"
          value={formData.contactPhone}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating (e.g. 4.5)"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Hotel"}
        </button>
      </form>
    </div>
  );
}
