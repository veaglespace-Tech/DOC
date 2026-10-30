import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery,
  tagTypes: ['ChatConversation'],
  endpoints: (builder) => ({
    getChatConversation: builder.query({
      query: (appointmentId) => `/chat/${appointmentId}`,
      transformResponse: (response) => {
        return response?.data?.conversation || response?.data || response;
      },
      providesTags: (result, error, appointmentId) => [{ type: 'ChatConversation', id: appointmentId }],
    }),
    sendChatMessage: builder.mutation({
      query: ({ appointmentId, content, type = 'TEXT', fileUrl }) => ({
        url: `/chat/${appointmentId}/send`,
        method: 'POST',
        body: { content, type, fileUrl },
      }),
      invalidatesTags: (result, error, { appointmentId }) => [{ type: 'ChatConversation', id: appointmentId }],
    }),
  }),
});

export const {
  useGetChatConversationQuery,
  useSendChatMessageMutation,
} = chatApi;
