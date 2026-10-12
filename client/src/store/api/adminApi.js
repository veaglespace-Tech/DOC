import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
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
  tagTypes: ['AdminStats', 'AdminDoctors', 'AdminWithdrawals', 'AdminComplaints'],
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
} = adminApi;
