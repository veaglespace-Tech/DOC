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
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  endpoints: (builder) => ({
    searchDoctors: builder.query({
      // We simulate an API call here for UI scaffolding
      queryFn: (arg) => {
        const { specialty, maxDistance, maxFees } = arg;
        
        let filtered = [...mockDoctors];
        
        if (specialty && specialty !== 'All') {
          filtered = filtered.filter(d => d.specialty === specialty);
        }
        if (maxDistance) {
          filtered = filtered.filter(d => d.distance <= maxDistance);
        }
        if (maxFees) {
          filtered = filtered.filter(d => d.fees <= maxFees);
        }

        return { data: filtered };
      },
    }),
  }),
});

export const { useSearchDoctorsQuery } = doctorApi;
