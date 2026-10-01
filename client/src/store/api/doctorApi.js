import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Mock Data for frontend scaffolding since backend is not fully integrated yet
const mockDoctors = [
  {
    id: 'DOC-01',
    name: 'Dr. Ramesh Sharma',
    specialty: 'Cardiologist',
    experience: '15 Years',
    distance: 2.4, // km
    fees: 1500,
    rating: 4.8,
    reviews: 124,
    availability: 'Available Today',
    isEmergencyAvailable: true,
    verificationStatus: 'Verified',
    image: 'https://i.pravatar.cc/150?u=DOC-01'
  },
  {
    id: 'DOC-02',
    name: 'Dr. Anjali Desai',
    specialty: 'Dermatologist',
    experience: '8 Years',
    distance: 5.1,
    fees: 800,
    rating: 4.6,
    reviews: 89,
    availability: 'Next Available: Tomorrow',
    isEmergencyAvailable: false,
    verificationStatus: 'Verified',
    image: 'https://i.pravatar.cc/150?u=DOC-02'
  },
  {
    id: 'DOC-03',
    name: 'Dr. Michael Chang',
    specialty: 'General Physician',
    experience: '20 Years',
    distance: 1.2,
    fees: 500,
    rating: 4.9,
    reviews: 342,
    availability: 'Available in 30 mins',
    isEmergencyAvailable: true,
    verificationStatus: 'Verified',
    image: 'https://i.pravatar.cc/150?u=DOC-03'
  },
  {
    id: 'DOC-04',
    name: 'Dr. Emily Rose',
    specialty: 'Pediatrician',
    experience: '12 Years',
    distance: 8.5,
    fees: 1200,
    rating: 4.7,
    reviews: 215,
    availability: 'Available Today',
    isEmergencyAvailable: false,
    verificationStatus: 'Verified',
    image: 'https://i.pravatar.cc/150?u=DOC-04'
  }
];

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
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
  endpoints: (builder) => ({
    searchDoctors: builder.query({
      query: (params) => ({
        url: '/search/doctors',
        params: params // This will automatically append ?specialty=All&maxFees=1500 to the URL
      })
    }),
    getDoctorDashboard: builder.query({
      query: () => '/doctors/dashboard',
    }),
  }),
});

export const { useSearchDoctorsQuery, useGetDoctorDashboardQuery } = doctorApi;
