import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";

export const orderApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/users/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (orderId) => `/users/orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/users/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    editOrderDetails: builder.mutation({
      query: ({ orderId, shippingAddress, items }) => ({
        url: `/users/orders/${orderId}/details`,
        method: "PUT",
        body: { shippingAddress, items },
      }),
      invalidatesTags: ["Order"],
    }),
    getMyOrders: builder.query({
      query: () => "/users/orders/myorders",
      providesTags: ["Order"],
    }),
    getAllOrders: builder.query({
      query: () => "/users/orders",
      providesTags: ["Order"],
    }),
    updateOrderToPaid: builder.mutation({
      query: (orderId) => ({
        url: `/users/orders/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/users/orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderToPaidMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useEditOrderDetailsMutation,
} = orderApi;