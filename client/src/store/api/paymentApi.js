import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery,
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
    })
  }),
});

export const { 
  useInitiatePaymentMutation, 
  useVerifyPaymentMutation,
  useRequestRefundMutation
} = paymentApi;

