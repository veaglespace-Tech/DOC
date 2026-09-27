'use client';

import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import VitalsCard from '@/components/patient/VitalsCard';
import AllergiesCard from '@/components/patient/AllergiesCard';
import MedicalRecordsCard from '@/components/patient/MedicalRecordsCard';

export default function PatientProfilePage() {
  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header Section */}
      <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
        <div className="h-32 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-8 pb-8">
          <div className="-mt-12 flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gray-100 shadow-md">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-900">Alex Johnson</h1>
                <p className="font-medium text-gray-500">Patient ID: PAT-849201</p>
              </div>
            </div>
            <button className="mb-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg">
              Edit Profile
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              alex.johnson@example.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              Mumbai, Maharashtra
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Vitals & Allergies */}
        <div className="space-y-8 lg:col-span-1">
          <VitalsCard />
          <AllergiesCard />
        </div>

        {/* Right Column - Medical History / EHR */}
        <div className="lg:col-span-2">
          <MedicalRecordsCard />
        </div>
      </div>
    </div>
  );
}
