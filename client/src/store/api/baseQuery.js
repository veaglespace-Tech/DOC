import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    let token = getState().auth?.token;
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
  },
});

