// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// type RoomDetail = {
//   roomId: number;
//   roomType: string;
//   pricePerNight: number;
//   capacity: number;
//   amenities: string;
//   isAvailable: boolean;
//   hotelName: string;
//   description?: string;
// };

// export default function RoomDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const [room, setRoom] = useState<RoomDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!id) return;

//     async function fetchRoom() {
//       try {
//         const res = await fetch(`http://localhost:8080/api/rooms/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch room details");
//         const data = await res.json();
//         setRoom(data);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRoom();
//   }, [id]);

//   if (!id) {
//     return <p className="text-center mt-10 text-red-500">Invalid room ID.</p>;
//   }
//   if (loading) {
//     return <p className="text-center mt-10">Loading room details...</p>;
//   }
//   if (error) {
//     return <p className="text-center mt-10 text-red-500">{error}</p>;
//   }
//   if (!room) {
//     return <p className="text-center mt-10 text-gray-500">Room not found.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-4">{room.roomType}</h1>
//       <p className="mb-2">Hotel: {room.hotelName}</p>
//       <p className="mb-2">Price per night: ${room.pricePerNight.toFixed(2)}</p>
//       <p className="mb-2">Capacity: {room.capacity} guests</p>
//       <p className="mb-2">Amenities: {room.amenities}</p>
//       <p className={room.isAvailable ? "text-green-600" : "text-red-600"}>
//         {room.isAvailable ? "Available" : "Not Available"}
//       </p>
//       {room.description && <p className="mt-4">{room.description}</p>}
//     </div>
//   );
// }
