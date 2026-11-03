import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery,
  tagTypes: ['Payment', 'Subscription'],
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/initiate',
        method: 'POST',
        body: paymentData,
      })
    }),
    verifyPayment: builder.mutation({
      query: (verificationData) => ({
        url: '/payments/verify',
        method: 'POST',
        body: verificationData,
      })
    }),
    requestRefund: builder.mutation({
      query: (refundData) => ({
        url: '/payments/refund',
        method: 'POST',
        body: refundData,
      })
    }),

    // PayU India Test / Sandbox Integration endpoints
    initiatePayUSubscription: builder.mutation({
      query: (subData) => ({
        url: '/payments/payu/subscribe',
        method: 'POST',
        body: subData,
      }),
      invalidatesTags: ['Subscription']
    }),
    initiatePayUAppointment: builder.mutation({
      query: (aptData) => ({
        url: '/payments/payu/initiate',
        method: 'POST',
        body: aptData,
      }),
      invalidatesTags: ['Payment']
    }),
    verifyPayUPayment: builder.mutation({
      query: (verifyData) => ({
        url: '/payments/payu/verify',
        method: 'POST',
        body: verifyData,
      }),
      invalidatesTags: ['Subscription', 'Payment']
    })
  }),
});

export const { 
  useInitiatePaymentMutation, 
  useVerifyPaymentMutation,
  useRequestRefundMutation,
  useInitiatePayUSubscriptionMutation,
  useInitiatePayUAppointmentMutation,
  useVerifyPayUPaymentMutation
} = paymentApi;
