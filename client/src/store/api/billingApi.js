import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const billingApi = createApi({
  reducerPath: 'billingApi',
  baseQuery,
  tagTypes: ['Billing'],
  endpoints: (builder) => ({
    getAdminBillingReports: builder.query({
      query: () => '/billing/admin/reports',
      providesTags: ['Billing'],
    }),
    getPatientBillingHistory: builder.query({
      query: () => '/billing/patient/history',
      providesTags: ['Billing'],
    }),
    // Download Invoice is handled via a direct window.open or fetch because it returns a PDF buffer, not JSON
  }),
});

export const { 
  useGetAdminBillingReportsQuery,
  useGetPatientBillingHistoryQuery,
} = billingApi;
