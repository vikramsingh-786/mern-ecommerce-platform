import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/users/cart",
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/users/cart",
        method: "POST",
        body: data,
      }),
    }),
    updateCartItem: builder.mutation({
      query: (data) => ({
        url: "/users/cart/item",
        method: "PUT",
        body: data,
      }),
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/users/cart/clear",
        method: "DELETE",
      }),
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/users/cart/item/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
