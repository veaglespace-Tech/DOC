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
          // RTK Query handles error state in the hook; no need to log to console
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
          // RTK Query handles error state in the hook; no need to log to console
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
        try {
          await queryFulfilled;
        } catch (err) {
          // Handled by UI component
        }
      }
    }),
  }),
});

export const { useLoginMutation, useAdminLoginMutation, useRegisterMutation } = authApi;
