'use client';

import React from 'react';
import PrescriptionBuilder from '@/components/doctor/PrescriptionBuilder';
import { FileSignature } from 'lucide-react';

export default function DoctorPrescriptionPage({ params }) {
  // Using React.use() to unwrap params if this was Next 15, but for Next 14 standard usage:
  const patientId = params?.id || 'PT-DEFAULT';

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
          <FileSignature className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Prescription Builder</h1>
          <p className="mt-1 text-gray-500">Draft, review, and digitally sign prescriptions.</p>
        </div>
      </div>

      <PrescriptionBuilder patientId={patientId} />
    </div>
  );
}
