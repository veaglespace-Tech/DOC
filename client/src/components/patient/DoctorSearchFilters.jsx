'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, selectFilters, resetFilters } from '@/store/slices/searchSlice';
import { SlidersHorizontal } from 'lucide-react';

export default function DoctorSearchFilters() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const specialties = ['All', 'Cardiologist', 'Dermatologist', 'General Physician', 'Pediatrician', 'Neurologist'];

  const handleChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <button 
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Specialty Filter */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-700">Specialty</label>
          <div className="flex flex-col gap-2">
            {specialties.map((spec) => (
              <label key={spec} className="flex cursor-pointer items-center gap-3">
                <input 
                  type="radio" 
                  name="specialty" 
                  checked={filters.specialty === spec}
                  onChange={() => handleChange('specialty', spec)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-sm text-gray-700">{spec}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">Distance</label>
            <span className="text-xs font-bold text-indigo-600">Up to {filters.maxDistance} km</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={filters.maxDistance}
            onChange={(e) => handleChange('maxDistance', Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
          />
        </div>

        {/* Fees Filter */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">Max Consultation Fee</label>
            <span className="text-xs font-bold text-indigo-600">₹{filters.maxFees}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="5000" 
            step="100"
            value={filters.maxFees}
            onChange={(e) => handleChange('maxFees', Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}
