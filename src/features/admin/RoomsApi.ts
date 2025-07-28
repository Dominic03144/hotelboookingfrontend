import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

// ✅ Room interface matches backend response
export interface Room {
  roomId: number;
  roomType: string;
  pricePerNight: string; // received as string from backend
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

// ✅ Shape for creating a room
export interface CreateRoomInput {
  roomType: string;
  pricePerNight: number;
  capacity: number;
  amenities?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  hotelId: number;
}

// ✅ Shape for updating a room
export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  roomId: number;
}

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`, // ✅ Uses env var
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.user?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    // ✅ Get all rooms
    getRooms: builder.query<Room[], void>({
      query: () => "/rooms",
      providesTags: ["Rooms"],
    }),

    // ✅ Get one room by ID
    getRoomById: builder.query<Room, number>({
      query: (roomId) => `/rooms/${roomId}`,
      providesTags: (_result, _error, id) => [{ type: "Rooms", id }],
    }),

    // ✅ Create a new room
    createRoom: builder.mutation<Room, CreateRoomInput>({
      query: (room) => ({
        url: "/rooms",
        method: "POST",
        body: room,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // ✅ Update room by ID
    updateRoom: builder.mutation<Room, UpdateRoomInput>({
      query: ({ roomId, ...data }) => ({
        url: `/rooms/${roomId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { roomId }) => [
        { type: "Rooms", id: roomId },
        "Rooms",
      ],
    }),

    // ✅ Delete room by ID
    deleteRoom: builder.mutation<{ success: boolean; id: number }, number>({
      query: (roomId) => ({
        url: `/rooms/${roomId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Rooms", id },
        "Rooms",
      ],
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
