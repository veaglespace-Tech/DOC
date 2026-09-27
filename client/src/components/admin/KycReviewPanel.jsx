'use client';

import React, { useState } from 'react';
import { FileCheck, FileX, CheckCircle, XCircle, Search, Eye, AlertCircle, ShieldCheck } from 'lucide-react';

const mockPendingDoctors = [
  {
    id: 'DOC-1029',
    name: 'Dr. Ramesh Sharma',
    specialty: 'Cardiologist',
    submittedAt: '2026-10-06T10:30:00Z',
    status: 'PENDING',
    documents: {
      license: { name: 'Medical_License_2026.pdf', status: 'PENDING' },
      idProof: { name: 'Aadhar_Card.pdf', status: 'PENDING' },
      degree: { name: 'MD_Certificate.pdf', status: 'PENDING' }
    }
  },
  {
    id: 'DOC-1030',
    name: 'Dr. Anjali Desai',
    specialty: 'Dermatologist',
    submittedAt: '2026-10-05T14:15:00Z',
    status: 'PENDING',
    documents: {
      license: { name: 'License_Cert.pdf', status: 'PENDING' },
      idProof: { name: 'Passport_Copy.pdf', status: 'PENDING' },
      degree: { name: 'MBBS_MD.pdf', status: 'PENDING' }
    }
  }
];

export default function KycReviewPanel() {
  const [selectedDoctor, setSelectedDoctor] = useState(mockPendingDoctors[0]);
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-6 lg:flex-row">
      {/* Left Column - List of Pending Doctors */}
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:w-1/3">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {mockPendingDoctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`w-full flex items-start justify-between rounded-xl p-3 text-left transition-colors ${
                selectedDoctor?.id === doc.id
                  ? 'bg-indigo-50 border border-indigo-100'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div>
                <p className="font-semibold text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.specialty}</p>
                <p className="mt-1 text-xs font-medium text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Needs Review
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(doc.submittedAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column - Document Review & Actions */}
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:w-2/3">
        {selectedDoctor ? (
          <>
            <div className="border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h2>
                <p className="text-sm text-gray-500">{selectedDoctor.specialty} • {selectedDoctor.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending KYC
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Submitted Documents</h3>
              
              <div className="space-y-4">
                {Object.entries(selectedDoctor.documents).map(([key, doc]) => (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-xs text-gray-500">{doc.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                        <Eye className="h-4 w-4" /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Background Verification</h4>
                    <p className="text-sm text-blue-700 mt-1">Please ensure the medical license number matches the national medical registry database before approving.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-white p-4 flex items-center justify-end gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <FileX className="h-4 w-4" /> Reject KYC
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700">
                <CheckCircle className="h-4 w-4" /> Approve Doctor
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <ShieldCheck className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium">Select a doctor to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
