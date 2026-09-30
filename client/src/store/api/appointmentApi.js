import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
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
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getMyAppointments: builder.query({
      query: () => '/appointments/my',
      providesTags: ['Appointment']
    }),
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: '/appointments',
        method: 'POST',
        body: appointmentData,
      }),
      invalidatesTags: ['Appointment']
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status, cancelReason }) => ({
        url: `/appointments/${id}/status`,
        method: 'PATCH',
        body: { status, cancelReason },
      }),
      invalidatesTags: ['Appointment']
    }),
    startVisit: builder.mutation({
      query: ({ id, location }) => ({
        url: `/appointments/${id}/start-visit`,
        method: 'POST',
        body: location,
      }),
      invalidatesTags: ['Appointment']
    }),
    completeVisit: builder.mutation({
      query: ({ id, data }) => ({
        url: `/appointments/${id}/complete-visit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointment']
    }),
  }),
});

export const { 
  useGetMyAppointmentsQuery, 
  useCreateAppointmentMutation, 
  useUpdateAppointmentStatusMutation,
  useStartVisitMutation,
  useCompleteVisitMutation
} = appointmentApi;
