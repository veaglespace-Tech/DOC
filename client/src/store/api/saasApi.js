import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const saasApi = createApi({
  reducerPath: 'saasApi',
  baseQuery,
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
