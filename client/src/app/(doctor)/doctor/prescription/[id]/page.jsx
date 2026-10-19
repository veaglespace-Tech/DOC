'use client';

import React, { use } from 'react';
import PrescriptionBuilder from '@/components/doctor/PrescriptionBuilder';
import { FileSignature, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DoctorPrescriptionPage({ params }) {
  const unwrappedParams = use(params);
  const appointmentId = unwrappedParams?.id || '1';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
            <FileSignature className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Digital Prescription Builder</h1>
            <p className="mt-1 text-sm text-gray-500">Draft, digitally sign, and issue verified prescriptions to patient EHR.</p>
          </div>
        </div>

        <Link
          href={`/doctor/consultation/${appointmentId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Consultation Room
        </Link>
      </div>

      <PrescriptionBuilder appointmentId={appointmentId} />
    </div>
  );
}
