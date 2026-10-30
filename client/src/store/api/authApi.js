import { createApi } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../slices/authSlice';
import { baseQuery } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['UserProfile'],
  baseQuery,
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
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['UserProfile'],
    }),
    updateMe: builder.mutation({
      query: (body) => ({
        url: '/auth/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useAdminLoginMutation, 
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation
} = authApi;
