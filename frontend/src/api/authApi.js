import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";

export const authApi = createApi({
  reducerPath: "authApi",
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
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response;
      },
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response;
      },
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/users/profile",
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response) => {
        localStorage.setItem("user", JSON.stringify(response));
        return response;
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (passwords) => ({
        url: "/users/profile/password",
        method: "PUT",
        body: passwords,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      },
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    contactUs: builder.mutation({
      query: (contactData) => ({
        url: "/auth/contact",
        method: "POST",
        body: contactData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useContactUsMutation,
} = authApi;
