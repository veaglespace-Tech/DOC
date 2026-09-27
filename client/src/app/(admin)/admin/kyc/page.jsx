'use client';

import React from 'react';
import KycReviewPanel from '@/components/admin/KycReviewPanel';

export default function AdminKycPage() {
  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">KYC & Document Verification</h1>
        <p className="mt-2 text-gray-500">Review and approve doctor registrations and licenses.</p>
      </div>

      <KycReviewPanel />
    </div>
  );
}
