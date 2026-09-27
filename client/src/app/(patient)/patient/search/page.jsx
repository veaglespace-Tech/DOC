'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilters } from '@/store/slices/searchSlice';
import { useSearchDoctorsQuery } from '@/store/api/doctorApi';
import DoctorSearchFilters from '@/components/patient/DoctorSearchFilters';
import DoctorCard from '@/components/patient/DoctorCard';
import { Search } from 'lucide-react';

export default function DoctorSearchPage() {
  const filters = useSelector(selectFilters);
  const { data: doctors, isLoading, isError } = useSearchDoctorsQuery(filters);

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="mt-2 text-gray-500">Search and book verified healthcare professionals near you.</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <DoctorSearchFilters />
          </div>
        </div>

        {/* Results Area */}
        <div className="w-full flex-1">
          {/* Search Bar & Sorting */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name or clinic..."
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option>Recommended</option>
                <option>Distance (Nearest First)</option>
                <option>Fees (Low to High)</option>
                <option>Rating (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Grid Results */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : isError ? (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
              Error loading doctors. Please try again later.
            </div>
          ) : doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or increasing the distance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
