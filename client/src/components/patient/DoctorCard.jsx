'use client';

import React from 'react';
import { ShieldCheck, Star, MapPin, Clock, IndianRupee, PhoneCall } from 'lucide-react';
import Image from 'next/image';

export default function DoctorCard({ doctor }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
            {/* Standard img tag used as fallback for fast dev; normally use next/image */}
            <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
            {doctor.verificationStatus === 'Verified' && (
              <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-500 p-0.5">
                <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{doctor.name}</h3>
            <p className="font-medium text-indigo-600">{doctor.specialty}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {doctor.rating} ({doctor.reviews})</span>
              <span>•</span>
              <span>{doctor.experience}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-2 rounded-xl bg-gray-50 p-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{doctor.distance} km away</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <IndianRupee className="h-4 w-4 text-gray-400" />
            <span className="font-medium">₹{doctor.fees}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-gray-700">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-emerald-600">{doctor.availability}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700">
            Book Visit
          </button>
          {doctor.isEmergencyAvailable && (
            <button className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700" title="Request Emergency Dispatch">
              <PhoneCall className="h-4 w-4" />
              SOS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
