import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
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

