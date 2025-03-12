import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (orderData) => ({
        url: "/payments/create-payment-intent",
        method: "POST",
        body: orderData,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments/confirm-payment",
        method: "POST",
        body: paymentData,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation, useConfirmPaymentMutation } = paymentApi;