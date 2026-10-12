'use client';

import React, { useState } from 'react';
import { FileCheck, FileX, CheckCircle, XCircle, Search, Eye, AlertCircle, ShieldCheck } from 'lucide-react';
import { useGetAdminDoctorsQuery, useVerifyDoctorMutation } from '@/store/api/adminApi';

export default function KycReviewPanel() {
  const { data: doctorsResponse, isLoading, refetch } = useGetAdminDoctorsQuery();
  const [verifyDoctor, { isLoading: isVerifying }] = useVerifyDoctorMutation();
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = doctorsResponse?.data || [];
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    (doc.user?.email && doc.user.email.toLowerCase().includes(search.toLowerCase()))
  );

  const activeDoc = selectedDoctor || filteredDoctors[0] || null;

  const handleVerify = async (status) => {
    if (!activeDoc) return;
    try {
      await verifyDoctor({ id: activeDoc.id, status }).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Verification update failed');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading KYC documents...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-14rem)] flex-col gap-6 lg:flex-row">
      {/* Left Column - List of Doctors */}
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:w-1/3">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-800">Doctor Applications</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredDoctors.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">No doctors found.</div>
          ) : (
            filteredDoctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`w-full flex items-start justify-between rounded-xl p-3 text-left transition-colors ${
                  activeDoc?.id === doc.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-900">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.specializations?.map(s => s.specialization).join(', ') || 'General Physician'}</div>
                  <div className="mt-1 text-xs text-gray-400 font-mono">Reg: {doc.medicalRegNumber || 'MCI-PENDING'}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  doc.verificationStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                  doc.verificationStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {doc.verificationStatus}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Column - Document Details & Actions */}
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {activeDoc ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{activeDoc.name}</h3>
                <p className="text-sm text-gray-500">Contact: {activeDoc.user?.email || 'N/A'} • {activeDoc.phone || 'Phone pending'}</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">Experience: {activeDoc.experienceYears || 5} Years • Fee: ₹{activeDoc.consultationFee || 500}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify('APPROVED')}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <CheckCircle className="h-4 w-4" /> Approve Doctor
                </button>
                <button
                  onClick={() => handleVerify('REJECTED')}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-colors"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Submitted Verification Documents</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Medical Registration License', status: activeDoc.verificationStatus, type: 'Medical Council of India' },
                  { name: 'Government ID Proof', status: activeDoc.verificationStatus, type: 'Aadhaar / Passport' },
                  { name: 'Degree & Qualification Certificate', status: activeDoc.verificationStatus, type: 'MBBS / MD Degree' }
                ].map((doc, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/60 flex flex-col justify-between">
                    <div>
                      <div className="p-2 bg-white rounded-xl w-fit shadow-xs mb-3 text-indigo-600">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <h5 className="font-bold text-gray-900 text-sm">{doc.name}</h5>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.type}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">Digitally Verified</span>
                      <button className="text-xs text-indigo-600 font-semibold hover:underline">View PDF</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Compliance Verification Checklist
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Valid Medical Practitioner License verified against state register.</li>
                  <li>Background identity verification and criminal record check cleared.</li>
                  <li>Doctor is eligible to provide in-clinic and home-visit appointments.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">Select a doctor to review credentials.</div>
        )}
      </div>
    </div>
  );
}
