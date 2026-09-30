import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../slices/authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const payload = response.data.data;
          if (payload && payload.accessToken) {
            dispatch(setCredentials({
              user: payload.user,
              token: payload.accessToken,
              role: payload.user?.roles?.[0] || 'PATIENT'
            }));
          }
        } catch (err) {
          console.error("Login failed:", err);
        }
      }
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const payload = response.data.data;
          if (payload && payload.accessToken) {
            dispatch(setCredentials({
              user: payload.user,
              token: payload.accessToken,
              role: payload.user?.roles?.[0] || 'SUPERADMIN'
            }));
          }
        } catch (err) {
          console.error("Admin Login failed:", err);
        }
      }
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Registration currently requires manual login afterwards in the backend
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Registration failed:", err);
        }
      }
    }),
  }),
});

export const { useLoginMutation, useAdminLoginMutation, useRegisterMutation } = authApi;
