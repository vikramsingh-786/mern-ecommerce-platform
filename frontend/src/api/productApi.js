import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    fetchProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    createProduct: builder.mutation({
      query: (productData) => {
        const formData = new FormData();
        Object.keys(productData).forEach((key) => {
          if (key === "images") {
            productData[key].forEach((file) => formData.append("images", file));
          } else {
            formData.append(key, productData[key]);
          }
        });
        return {
          url: "/products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
