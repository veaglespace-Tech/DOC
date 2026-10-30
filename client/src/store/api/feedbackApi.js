import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery,
  tagTypes: ['Complaint', 'Review'],
  endpoints: (builder) => ({
    getMyComplaints: builder.query({
      query: () => '/feedback/my-complaints',
      transformResponse: (response) => {
        if (response?.data) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Complaint'],
    }),
    submitComplaint: builder.mutation({
      query: (body) => ({
        url: '/feedback/complaint',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Complaint'],
    }),
    submitReview: builder.mutation({
      query: (body) => ({
        url: '/feedback/review',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Review'],
    }),
    getDoctorReviews: builder.query({
      query: (doctorId) => `/feedback/reviews/${doctorId}`,
      providesTags: (result, error, doctorId) => [{ type: 'Review', id: doctorId }],
    }),
  }),
});

export const {
  useGetMyComplaintsQuery,
  useSubmitComplaintMutation,
  useSubmitReviewMutation,
  useGetDoctorReviewsQuery,
} = feedbackApi;

