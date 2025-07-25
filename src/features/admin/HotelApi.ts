// ✅ src/features/admin/HotelsApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Hotel {
  hotelId: number;
  name: string;
  address: string;
  description: string;
  // Add other fields if needed
}

export const HotelsApi = createApi({
  reducerPath: "HotelsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/hotels", // Adjust to your backend route!
  }),
  tagTypes: ["Hotels"],
  endpoints: (builder) => ({
    // ✅ GET all hotels
    getHotels: builder.query<Hotel[], void>({
      query: () => `/`,
      providesTags: ["Hotels"],
    }),

    // ✅ GET single hotel by ID
    getHotelById: builder.query<Hotel, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Hotels", id }],
    }),

    // ✅ Create hotel
    createHotel: builder.mutation<Hotel, Partial<Hotel>>({
      query: (newHotel) => ({
        url: `/`,
        method: "POST",
        body: newHotel,
      }),
      invalidatesTags: ["Hotels"],
    }),

    // ✅ Update hotel
    updateHotel: builder.mutation<Hotel, Partial<Hotel> & { hotelId: number }>({
      query: ({ hotelId, ...rest }) => ({
        url: `/${hotelId}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: "Hotels", id: hotelId },
      ],
    }),

    // ✅ Delete hotel
    deleteHotel: builder.mutation<{ success: boolean }, number>({
      query: (hotelId) => ({
        url: `/${hotelId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, hotelId) => [
        { type: "Hotels", id: hotelId },
      ],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = HotelsApi;
