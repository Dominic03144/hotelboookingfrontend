import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

// ----------------------
// TYPES
// ----------------------

export interface User {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  contactPhone?: string;
  address?: string;
  isVerified: boolean;
}

export interface Ticket {
  ticketId: number;
  subject: string;
  description: string;
  status: "Open" | "Resolved";
  createdAt: string;
  user: {
    userId: number;
    firstname: string;
    lastname: string;
    email: string;
  };
}

interface UpdateRolePayload {
  userId: number;
  role: string;
}

interface AddUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  password: string;
}

// ----------------------
// API
// ----------------------

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["Users", "Tickets"],

  endpoints: (builder) => ({
    // ✅ USERS -----------------------------
    getAllUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation<void, UpdateRolePayload>({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    addUser: builder.mutation<void, AddUserPayload>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ TICKETS -----------------------------
    getAllTickets: builder.query<Ticket[], void>({
      query: () => "/tickets",
      providesTags: ["Tickets"],
    }),

    updateTicketStatus: builder.mutation<void, { ticketId: number; status: "Resolved" }>({
      query: ({ ticketId, status }) => ({
        url: `/tickets/${ticketId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

// ----------------------
// EXPORT HOOKS
// ----------------------

export const {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useAddUserMutation,
  useGetAllTicketsQuery,
  useUpdateTicketStatusMutation,
} = adminApi;
