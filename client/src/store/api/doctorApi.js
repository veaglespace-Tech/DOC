import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
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
  tagTypes: ['Doctor', 'Wallet', 'Handover', 'DoctorProfile'],
  endpoints: (builder) => ({
    searchDoctors: builder.query({
      query: (params) => ({
        url: '/search/doctors',
        params
      }),
      providesTags: ['Doctor']
    }),
    getDoctorDashboard: builder.query({
      query: () => '/doctors/dashboard',
      providesTags: ['Doctor', 'Wallet']
    }),
    getDoctorWallet: builder.query({
      query: () => '/wallet/my-wallet',
      providesTags: ['Wallet']
    }),
    requestWithdrawal: builder.mutation({
      query: (body) => ({
        url: '/wallet/withdraw',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Wallet']
    }),
    getDoctorHandovers: builder.query({
      query: () => '/handovers/my-handovers',
      providesTags: ['Handover']
    }),
    requestHandover: builder.mutation({
      query: (body) => ({
        url: '/handovers/request',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Handover']
    }),
    respondHandover: builder.mutation({
      query: ({ id, action }) => ({
        url: `/handovers/${id}/respond`,
        method: 'POST',
        body: { action }
      }),
      invalidatesTags: ['Handover']
    }),
    getDoctorById: builder.query({
      query: (id) => `/search/doctors/${id}`,
      providesTags: ['Doctor']
    }),
    getDoctorProfile: builder.query({
      query: () => '/doctors/profile',
      providesTags: ['DoctorProfile', 'Doctor']
    }),
    updateDoctorProfile: builder.mutation({
      query: (body) => ({
        url: '/doctors/profile',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['DoctorProfile', 'Doctor']
    }),
    uploadDoctorKyc: builder.mutation({
      query: (formData) => ({
        url: '/doctors/kyc',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['DoctorProfile']
    }),
    addDoctorSpecialization: builder.mutation({
      query: (body) => ({
        url: '/doctors/specializations',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DoctorProfile']
    }),
    removeDoctorSpecialization: builder.mutation({
      query: (id) => ({
        url: `/doctors/specializations/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['DoctorProfile']
    }),
    setDoctorAvailability: builder.mutation({
      query: (body) => ({
        url: '/doctors/availability',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DoctorProfile']
    }),
    deleteDoctorAvailability: builder.mutation({
      query: (id) => ({
        url: `/doctors/availability/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['DoctorProfile']
    }),
  }),
});

export const { 
  useSearchDoctorsQuery, 
  useGetDoctorDashboardQuery,
  useGetDoctorByIdQuery,
  useGetDoctorWalletQuery,
  useRequestWithdrawalMutation,
  useGetDoctorHandoversQuery,
  useRequestHandoverMutation,
  useRespondHandoverMutation,
  useGetDoctorProfileQuery,
  useUpdateDoctorProfileMutation,
  useUploadDoctorKycMutation,
  useAddDoctorSpecializationMutation,
  useRemoveDoctorSpecializationMutation,
  useSetDoctorAvailabilityMutation,
  useDeleteDoctorAvailabilityMutation,
} = doctorApi;
