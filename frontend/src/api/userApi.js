import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/auth/users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `/auth/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/auth/users/${userId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/auth/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery, 
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
