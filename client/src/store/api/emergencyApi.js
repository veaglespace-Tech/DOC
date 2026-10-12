import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emergencyApi = createApi({
  reducerPath: 'emergencyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || (typeof window !== 'undefined' ? (localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token')) : null);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Emergency'],
  endpoints: (builder) => ({
    triggerEmergency: builder.mutation({
      query: (data) => ({
        url: '/emergency/dispatch',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Emergency']
    }),
    getEmergencyStatus: builder.query({
      query: (id) => `/emergency/${id}/status`,
      providesTags: ['Emergency']
    }),
    respondEmergency: builder.mutation({
      query: (body) => ({
        url: '/emergency/respond',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Emergency']
    }),
    getDoctorAlerts: builder.query({
      query: () => '/emergency/alerts',
    }),
    updateLocation: builder.mutation({
      query: (data) => ({
        url: '/emergency/location',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useTriggerEmergencyMutation,
  useGetEmergencyStatusQuery,
  useRespondEmergencyMutation,
  useGetDoctorAlertsQuery,
  useUpdateLocationMutation,
} = emergencyApi;
