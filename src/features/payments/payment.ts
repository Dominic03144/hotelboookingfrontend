import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/payments",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Payment"],

  endpoints: (builder) => ({
    // ✅ Create Stripe Checkout Session
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: "/create-checkout-session",
        method: "POST",
        body,
      }),
    }),

    // ✅ Stripe Webhook – You may not need to call this from frontend
    // skip exposing `/webhook` endpoint in frontend

    // ✅ Get logged-in user's payments
    getMyPayments: builder.query({
      query: () => "/my",
      providesTags: ["Payment"],
    }),

    // ✅ Get single payment receipt
    getMyPaymentReceipt: builder.query({
      query: (paymentId) => `/my/${paymentId}/receipt`,
    }),

    // ✅ Get all payments (Admin only)
    getAllPayments: builder.query({
      query: () => "/",
      providesTags: ["Payment"],
    }),

    // ✅ Get payment status by transaction ID
    getPaymentStatus: builder.query({
      query: (transactionId) => `/${transactionId}/status`,
    }),

    // ✅ Admin: Create manual payment
    createPayment: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    // ✅ Admin: Get payment by ID
    getPaymentById: builder.query({
      query: (id) => `/${id}`,
    }),

    // ✅ Admin: Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Payment"],
    }),

    // ✅ Admin: Delete payment
    deletePayment: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetMyPaymentsQuery,
  useGetMyPaymentReceiptQuery,
  useGetAllPaymentsQuery,
  useGetPaymentStatusQuery,
  useCreatePaymentMutation,
  useGetPaymentByIdQuery,
  useUpdatePaymentStatusMutation,
  useDeletePaymentMutation,
} = paymentApi;
