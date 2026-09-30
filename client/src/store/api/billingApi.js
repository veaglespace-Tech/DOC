import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const billingApi = createApi({
  reducerPath: 'billingApi',
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
