import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const patientApi = createApi({
  reducerPath: 'patientApi',
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
  tagTypes: ['Patient', 'PatientProfile', 'MedicalRecord'],
  endpoints: (builder) => ({
    getPatientDashboard: builder.query({
      query: () => '/patients/dashboard',
      providesTags: ['Patient']
    }),
    getPatientProfile: builder.query({
      query: () => '/patients/profile',
      providesTags: ['PatientProfile']
    }),
    updatePatientProfile: builder.mutation({
      query: (data) => ({
        url: '/patients/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PatientProfile', 'Patient']
    }),
    getMedicalRecords: builder.query({
      query: () => '/patients/medical-records',
      providesTags: ['MedicalRecord']
    }),
    addMedicalRecord: builder.mutation({
      query: (formData) => ({
        url: '/patients/medical-records',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['MedicalRecord']
    }),
  }),
});

export const { 
  useGetPatientDashboardQuery,
  useGetPatientProfileQuery,
  useUpdatePatientProfileMutation,
  useGetMedicalRecordsQuery,
  useAddMedicalRecordMutation,
} = patientApi;
