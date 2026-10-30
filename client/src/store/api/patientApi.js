import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery,
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
