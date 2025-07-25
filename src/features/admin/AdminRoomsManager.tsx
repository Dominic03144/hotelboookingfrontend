import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  type Room,
} from "../../features/admin/RoomsApi";

export default function AdminRoomsPage() {
  const { data: rooms, isLoading, isError } = useGetRoomsQuery();
  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  // State for Add Room form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    roomType: "",
    pricePerNight: "",
    capacity: 1,
    amenities: "",
    isAvailable: true,
    imageUrl: "",
    hotelId: 0,
  });

  // State for Edit Room
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Handlers for adding, updating, deleting rooms

  const handleAddRoom = async () => {
    // Simple validation
    if (
      !newRoom.roomType ||
      !newRoom.pricePerNight ||
      !newRoom.capacity ||
      !newRoom.hotelId
    ) {
      toast.error("Please fill all required fields (type, price, capacity, hotel)");
      return;
    }

    try {
      await createRoom(newRoom).unwrap();
      toast.success("✅ Room added successfully");
      setNewRoom({
        roomType: "",
        pricePerNight: "",
        capacity: 1,
        amenities: "",
        isAvailable: true,
        imageUrl: "",
        hotelId: 0,
      });
      setShowAddForm(false);
    } catch {
      toast.error("❌ Failed to add room");
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;

    if (
      !editingRoom.roomType ||
      !editingRoom.pricePerNight ||
      !editingRoom.capacity ||
      !editingRoom.hotelId
    ) {
      toast.error("Please fill all required fields (type, price, capacity, hotel)");
      return;
    }

    try {
      await updateRoom(editingRoom).unwrap();
      toast.success("✅ Room updated successfully");
      setEditingRoom(null);
    } catch {
      toast.error("❌ Failed to update room");
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId).unwrap();
        toast.success("✅ Room deleted successfully");
      } catch {
        toast.error("❌ Failed to delete room");
      }
    }
  };

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p>Error loading rooms.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🛏️ Admin Rooms Manager</h1>

      {!showAddForm && !editingRoom && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Room
        </button>
      )}

      {/* Add Room Form */}
      {showAddForm && (
        <div className="border p-4 rounded bg-gray-50 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Room</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Room Type"
              value={newRoom.roomType ?? ""}
              onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Price Per Night"
              value={newRoom.pricePerNight ?? ""}
              onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              min={1}
              placeholder="Capacity"
              value={newRoom.capacity ?? ""}
              onChange={(e) =>
                setNewRoom({ ...newRoom, capacity: Number(e.target.value) })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Amenities (comma separated)"
              value={newRoom.amenities ?? ""}
              onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newRoom.imageUrl ?? ""}
              onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              min={1}
              placeholder="Hotel ID"
              value={newRoom.hotelId ?? ""}
              onChange={(e) =>
                setNewRoom({ ...newRoom, hotelId: Number(e.target.value) })
              }
              className="border p-2 rounded"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleAddRoom}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Room
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Room Form */}
      {editingRoom && (
        <div className="border p-4 rounded bg-yellow-50 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Room</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Room Type"
              value={editingRoom.roomType}
              onChange={(e) =>
                setEditingRoom({ ...editingRoom, roomType: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Price Per Night"
              value={editingRoom.pricePerNight}
              onChange={(e) =>
                setEditingRoom({ ...editingRoom, pricePerNight: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              min={1}
              placeholder="Capacity"
              value={editingRoom.capacity}
              onChange={(e) =>
                setEditingRoom({
                  ...editingRoom,
                  capacity: Number(e.target.value),
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Amenities (comma separated)"
              value={editingRoom.amenities}
              onChange={(e) =>
                setEditingRoom({ ...editingRoom, amenities: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingRoom.imageUrl}
              onChange={(e) =>
                setEditingRoom({ ...editingRoom, imageUrl: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              min={1}
              placeholder="Hotel ID"
              value={editingRoom.hotelId}
              onChange={(e) =>
                setEditingRoom({ ...editingRoom, hotelId: Number(e.target.value) })
              }
              className="border p-2 rounded"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleUpdateRoom}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingRoom(null)}
              className="bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <table className="min-w-full border-collapse border border-gray-300 bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Room Type</th>
            <th className="border p-2">Price/Night</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Amenities</th>
            <th className="border p-2">Available</th>
            <th className="border p-2">Hotel ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms?.map((room) => (
            <tr key={room.roomId} className="border-b">
              <td className="border p-2 text-center">
                {room.imageUrl ? (
                  <img
                    src={room.imageUrl}
                    alt={room.roomType}
                    className="w-20 h-auto rounded mx-auto"
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td className="border p-2">{room.roomType}</td>
              <td className="border p-2">${room.pricePerNight}</td>
              <td className="border p-2 text-center">{room.capacity}</td>
              <td className="border p-2">{room.amenities}</td>
              <td className="border p-2 text-center">
                {room.isAvailable ? "Yes" : "No"}
              </td>
              <td className="border p-2 text-center">{room.hotelId}</td>
              <td className="border p-2 space-x-2 text-center">
                <button
                  onClick={() => setEditingRoom(room)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.roomId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
