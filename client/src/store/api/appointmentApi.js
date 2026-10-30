import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery,
  tagTypes: ['Appointment', 'Prescription'],
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
    getPrescription: builder.query({
      query: (appointmentId) => `/appointments/${appointmentId}/prescription`,
      providesTags: ['Prescription']
    }),
    createPrescription: builder.mutation({
      query: ({ appointmentId, data }) => ({
        url: `/appointments/${appointmentId}/prescription`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Prescription', 'Appointment']
    }),
    getPatientPrescriptions: builder.query({
      query: () => '/patients/prescriptions',
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ['Prescription']
    }),
  }),
});

export const { 
  useGetMyAppointmentsQuery, 
  useCreateAppointmentMutation, 
  useUpdateAppointmentStatusMutation,
  useStartVisitMutation,
  useCompleteVisitMutation,
  useGetPrescriptionQuery,
  useCreatePrescriptionMutation,
  useGetPatientPrescriptionsQuery
} = appointmentApi;
