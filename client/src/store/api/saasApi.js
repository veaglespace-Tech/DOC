import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const saasApi = createApi({
  reducerPath: 'saasApi',
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
  tagTypes: ['ClinicSaaS', 'Plans', 'ClinicAppointments', 'ClinicPatients', 'ClinicBilling'],
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query({
      query: () => '/saas/plans',
      providesTags: ['Plans']
    }),
    getMyClinic: builder.query({
      query: () => '/saas/my-clinic',
      providesTags: ['ClinicSaaS']
    }),
    subscribePlan: builder.mutation({
      query: (body) => ({
        url: '/saas/subscribe',
        method: 'POST',
        body
      }),
      invalidatesTags: ['ClinicSaaS']
    }),
    getClinicAppointments: builder.query({
      query: () => '/saas/appointments',
      providesTags: ['ClinicAppointments']
    }),
    getClinicPatients: builder.query({
      query: () => '/saas/patients',
      providesTags: ['ClinicPatients']
    }),
    getClinicBilling: builder.query({
      query: () => '/saas/billing',
      providesTags: ['ClinicBilling']
    }),
    updateClinicSettings: builder.mutation({
      query: (body) => ({
        url: '/saas/settings',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['ClinicSaaS']
    })
  })
});

export const {
  useGetSubscriptionPlansQuery,
  useGetMyClinicQuery,
  useSubscribePlanMutation,
  useGetClinicAppointmentsQuery,
  useGetClinicPatientsQuery,
  useGetClinicBillingQuery,
  useUpdateClinicSettingsMutation
} = saasApi;
