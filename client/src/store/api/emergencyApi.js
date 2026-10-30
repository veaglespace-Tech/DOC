import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const emergencyApi = createApi({
  reducerPath: 'emergencyApi',
  baseQuery,
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
