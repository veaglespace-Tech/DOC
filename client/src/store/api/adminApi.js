import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth.token;
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
        if (!token) {
          try {
            const raw = localStorage.getItem('careconnect_auth');
            if (raw) token = JSON.parse(raw)?.token;
          } catch (e) {}
        }
      }
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: [
    'AdminStats', 
    'AdminDoctors', 
    'AdminWithdrawals', 
    'AdminComplaints', 
    'AdminSettings', 
    'AdminPatients', 
    'AdminClinics', 
    'AdminTransactions'
  ],
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats']
    }),
    getAdminDoctors: builder.query({
      query: (params) => ({
        url: '/admin/doctors',
        params
      }),
      providesTags: ['AdminDoctors']
    }),
    verifyDoctor: builder.mutation({
      query: ({ id, status, reviewNote }) => ({
        url: `/admin/doctors/${id}/verify`,
        method: 'PATCH',
        body: { status, reviewNote }
      }),
      invalidatesTags: ['AdminDoctors', 'AdminStats']
    }),
    getAdminWithdrawals: builder.query({
      query: (params) => ({
        url: '/admin/withdrawals',
        params
      }),
      providesTags: ['AdminWithdrawals']
    }),
    updateWithdrawalStatus: builder.mutation({
      query: ({ id, status, utrNumber, rejectReason }) => ({
        url: `/admin/withdrawals/${id}`,
        method: 'PATCH',
        body: { status, utrNumber, rejectReason }
      }),
      invalidatesTags: ['AdminWithdrawals', 'AdminStats']
    }),
    getAdminComplaints: builder.query({
      query: (params) => ({
        url: '/admin/complaints',
        params
      }),
      providesTags: ['AdminComplaints']
    }),
    updateComplaintStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/complaints/${id}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['AdminComplaints']
    }),
    getAdminAuditLogs: builder.query({
      query: () => '/admin/audit-logs'
    }),
    getAdminEmergencyDispatches: builder.query({
      query: () => '/admin/emergency',
      providesTags: ['AdminStats']
    }),
    getAdminSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['AdminSettings']
    }),
    updateAdminSettings: builder.mutation({
      query: (updates) => ({
        url: '/admin/settings',
        method: 'PATCH',
        body: { updates }
      }),
      invalidatesTags: ['AdminSettings']
    }),
    getFinancialReport: builder.query({
      query: (params) => ({
        url: '/admin/reports/financials',
        params
      }),
      providesTags: ['AdminStats']
    }),
    getAdminRefunds: builder.query({
      query: () => '/payments/refunds',
      providesTags: ['AdminStats']
    }),
    getAdminPatients: builder.query({
      query: (params) => ({
        url: '/admin/patients',
        params
      }),
      providesTags: ['AdminPatients']
    }),
    getAdminClinics: builder.query({
      query: (params) => ({
        url: '/admin/clinics',
        params
      }),
      providesTags: ['AdminClinics']
    }),
    getAdminTransactions: builder.query({
      query: (params) => ({
        url: '/admin/transactions',
        params
      }),
      providesTags: ['AdminTransactions', 'AdminStats']
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminDoctorsQuery,
  useVerifyDoctorMutation,
  useGetAdminWithdrawalsQuery,
  useUpdateWithdrawalStatusMutation,
  useGetAdminComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useGetAdminAuditLogsQuery,
  useGetAdminEmergencyDispatchesQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetFinancialReportQuery,
  useGetAdminRefundsQuery,
  useGetAdminPatientsQuery,
  useGetAdminClinicsQuery,
  useGetAdminTransactionsQuery,
} = adminApi;

