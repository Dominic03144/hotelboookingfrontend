// ✅ src/pages/AdminRoomsPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetRoomsQuery,
  useDeleteRoomMutation,
  type Room,
} from "../features/admin/RoomsApi";
import { useGetHotelsQuery } from "../features/admin/HotelApi"; // <-- you'll need this

export default function AdminRoomsPage() {
  const navigate = useNavigate();

  const { data: rooms, isLoading, isError } = useGetRoomsQuery();
  const [deleteRoom] = useDeleteRoomMutation();

  const { data: hotels, isLoading: isHotelsLoading } = useGetHotelsQuery();

  const handleAddRoom = (hotelId?: number) => {
    // Pass hotelId if available
    if (hotelId) {
      navigate(`/admin/hotels/${hotelId}/rooms/add`);
    } else {
      navigate("/admin/rooms/add");
    }
  };

  const handleEditRoom = (id: number) => navigate(`/admin/rooms/edit/${id}`);

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id).unwrap();
        toast.success("✅ Room deleted");
      } catch {
        toast.error("❌ Failed to delete room");
      }
    }
  };

  if (isLoading) return <p className="p-6 text-gray-500">Loading rooms...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading rooms.</p>;

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-blue-800">🛏️ Rooms</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* ✅ Optional select if you want to add for a hotel */}
          {!isHotelsLoading && hotels && (
            <select
              onChange={(e) => handleAddRoom(Number(e.target.value))}
              className="px-4 py-2 border rounded-md"
              defaultValue=""
            >
              <option value="" disabled>
                ➕ Add Room For...
              </option>
              {hotels.map((hotel) => (
                <option key={hotel.hotelId} value={hotel.hotelId}>
                  {hotel.name}
                </option>
              ))}
            </select>
          )}

          {/* ✅ Or fallback plain button */}
          <button
            onClick={() => handleAddRoom()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            ➕ Add Room
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Capacity</th>
              <th className="p-3 border">Hotel ID</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms?.map((room) => (
              <tr key={room.roomId} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{room.roomType}</td>
                <td className="border px-3 py-2">${room.pricePerNight}</td>
                <td className="border px-3 py-2">{room.capacity}</td>
                <td className="border px-3 py-2">{room.hotelId}</td>
                <td className="border px-3 py-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEditRoom(room.roomId)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.roomId)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
