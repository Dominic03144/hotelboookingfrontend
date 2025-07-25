// src/features/user/UserApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

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

export const userApi = createApi({
  reducerPath: "userApi",
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
  endpoints: (builder) => ({
    // ✅ GET /api/users/me
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
    }),

    // ✅ GET /api/users/:id
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
} = userApi;
