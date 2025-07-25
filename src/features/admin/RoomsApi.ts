import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store"; // ✅ import RootState type

// Backend response shape — pricePerNight is string (numeric as string)
export interface Room {
  roomId: number;
  roomType: string;
  pricePerNight: string; // price comes as string from backend
  capacity: number;
  amenities: string;
  isAvailable: boolean;
  imageUrl: string;
  hotelId: number;

  hotelName: string;
  hotelLocation: string;
  hotelCity: string;
  hotelAddress: string;
  hotelContactPhone: string;
}

// Input shape for creating a new room (pricePerNight is number for input validation)
export interface CreateRoomInput {
  roomType: string;
  pricePerNight: number;
  capacity: number;
  amenities?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  hotelId: number;
}

// Input shape for updating a room - all optional except roomId
export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  roomId: number;
}

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    // GET all rooms
    getRooms: builder.query<Room[], void>({
      query: () => "/rooms",
      providesTags: ["Rooms"],
    }),

    // GET single room by ID
    getRoomById: builder.query<Room, number>({
      query: (id) => `/rooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Rooms", id }],
    }),

    // POST create new room
    createRoom: builder.mutation<Room, CreateRoomInput>({
      query: (newRoom) => ({
        url: "/rooms",
        method: "POST",
        body: newRoom,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // PUT update room by ID
    updateRoom: builder.mutation<Room, UpdateRoomInput>({
      query: ({ roomId, ...updatedRoom }) => ({
        url: `/rooms/${roomId}`,
        method: "PUT",
        body: updatedRoom,
      }),
      invalidatesTags: (_result, _error, { roomId }) => [
        { type: "Rooms", id: roomId },
        "Rooms",
      ],
    }),

    // DELETE room by ID
    deleteRoom: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
