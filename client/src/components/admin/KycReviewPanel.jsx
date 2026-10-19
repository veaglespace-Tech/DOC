'use client';

import React, { useState } from 'react';
import { 
  FileCheck, 
  FileX, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Eye, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  Award,
  Stethoscope,
  Building2,
  Clock,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { useGetAdminDoctorsQuery, useVerifyDoctorMutation } from '@/store/api/adminApi';

const DOC_TYPE_META = {
  MEDICAL_LICENSE: { title: 'State Medical Council License', icon: Award, color: 'text-purple-600 bg-purple-50' },
  DEGREE_CERTIFICATE: { title: 'Degree Diploma (MBBS / MD / MS)', icon: Stethoscope, color: 'text-blue-600 bg-blue-50' },
  ID_PROOF: { title: 'Government ID Proof', icon: ShieldCheck, color: 'text-teal-600 bg-teal-50' },
  CLINIC_REGISTRATION: { title: 'Clinic / Establishment Certificate', icon: Building2, color: 'text-amber-600 bg-amber-50' }
};

export default function KycReviewPanel() {
  const { data: doctorsResponse, isLoading, refetch } = useGetAdminDoctorsQuery();
  const [verifyDoctor, { isLoading: isVerifying }] = useVerifyDoctorMutation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });

  const doctors = doctorsResponse?.data || [];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      (doc.user?.email && doc.user.email.toLowerCase().includes(search.toLowerCase())) ||
      (doc.licenseNumber && doc.licenseNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'PENDING' && (doc.verificationStatus === 'PENDING' || !doc.verificationStatus)) ||
      doc.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeDoc = doctors.find(d => d.id === selectedDoctorId) || filteredDoctors[0] || null;

  const handleVerify = async (status) => {
    if (!activeDoc) return;
    try {
      setActionFeedback({ text: `Processing ${status === 'APPROVED' ? 'approval' : 'rejection'}...`, type: 'info' });
      await verifyDoctor({ 
        id: activeDoc.id, 
        status, 
        reviewNote: reviewNote.trim() || (status === 'APPROVED' ? 'Approved by Admin' : 'Rejected after verification')
      }).unwrap();

      setActionFeedback({ 
        text: `Doctor ${activeDoc.name} marked as ${status}!`, 
        type: 'success' 
      });
      setReviewNote('');
      refetch();
      setTimeout(() => setActionFeedback({ text: '', type: '' }), 4000);
    } catch (err) {
      setActionFeedback({ 
        text: err?.data?.message || 'Verification update failed', 
        type: 'error' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const documents = activeDoc?.documents || [];

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col gap-6 lg:flex-row">
      
      {/* Left Column - List of Doctors */}
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 lg:w-96 shrink-0">
        <div className="border-b border-slate-100 p-5 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Doctor Applications</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {filteredDoctors.length}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, reg no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredDoctors.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">No doctors match your filter.</div>
          ) : (
            filteredDoctors.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              const docCount = doc.documents?.length || 0;
              const isApproved = doc.verificationStatus === 'APPROVED';
              const isRejected = doc.verificationStatus === 'REJECTED';

              return (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedDoctorId(doc.id); setReviewNote(''); }}
                  className={`w-full flex items-start justify-between rounded-2xl p-3.5 text-left transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/80 border-2 border-indigo-500/40 shadow-sm' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="space-y-1 truncate pr-2">
                    <div className="font-extrabold text-slate-900 text-sm">{doc.name}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {doc.specializations?.map(s => s.specialization || s.name).join(', ') || 'General Physician'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Lic: {doc.licenseNumber || 'Not provided'}</span>
                      <span>•</span>
                      <span>{docCount} Docs</span>
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    isApproved ? 'bg-emerald-100 text-emerald-800' :
                    isRejected ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {doc.verificationStatus || 'PENDING'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column - Document Details & Actions */}
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
        {activeDoc ? (
          <div className="flex h-full flex-col">
            
            {/* Doctor Profile Summary Header */}
            <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900">{activeDoc.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                    activeDoc.verificationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    activeDoc.verificationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {activeDoc.verificationStatus || 'PENDING'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Email: <span className="font-bold text-slate-700">{activeDoc.user?.email || 'N/A'}</span> • 
                  Phone: <span className="font-bold text-slate-700">{activeDoc.user?.phone || 'N/A'}</span> • 
                  MCI Reg: <span className="font-mono font-bold text-slate-700">{activeDoc.licenseNumber || 'N/A'}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold">
                    Fee: ₹{activeDoc.consultationFee || 500}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold">
                    Experience: {activeDoc.experienceYears || 0} Years
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl font-bold ${
                    activeDoc.isEmergencyAvailable ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    SOS: {activeDoc.isEmergencyAvailable ? 'Available' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => handleVerify('APPROVED')}
                  disabled={isVerifying || activeDoc.verificationStatus === 'APPROVED'}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve Doctor
                </button>
                <button
                  onClick={() => handleVerify('REJECTED')}
                  disabled={isVerifying || activeDoc.verificationStatus === 'REJECTED'}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 font-bold text-xs transition-colors"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>

            {/* Notification Feedback */}
            {actionFeedback.text && (
              <div className={`mx-6 mt-4 p-3 rounded-2xl text-xs font-bold text-center ${
                actionFeedback.type === 'error' ? 'bg-rose-50 text-rose-700' :
                actionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {actionFeedback.text}
              </div>
            )}

            {/* Scrollable Document Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Review Note Input */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Review Assessment Note (Audit Logged)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified with Maharashtra Medical Council register, valid up to 2029"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Uploaded Verification Files ({documents.length})
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">Click to inspect in browser</span>
                </div>

                {documents.length === 0 ? (
                  <div className="p-8 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
                    <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                    <h5 className="font-bold text-slate-700 text-sm">No Documents Uploaded Yet</h5>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      The practitioner has registered their account but has not yet uploaded their medical license or degree certificates.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => {
                      const meta = DOC_TYPE_META[doc.type] || { title: doc.type, icon: FileCheck, color: 'text-slate-600 bg-slate-50' };
                      const Icon = meta.icon;
                      const fileHref = doc.fileUrl?.startsWith('http') ? doc.fileUrl : `http://localhost:5000${doc.fileUrl}`;

                      return (
                        <div
                          key={doc.id}
                          className="border border-slate-200/80 rounded-2xl p-4 bg-white shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className={`p-2.5 rounded-xl ${meta.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                                doc.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {doc.status}
                              </span>
                            </div>

                            <div>
                              <h5 className="font-extrabold text-slate-900 text-sm">{meta.title}</h5>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.type}</p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Uploaded: {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-medium">Compliance Document</span>
                            <a
                              href={fileHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                            >
                              Open File <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bio & Clinical Summary */}
              {activeDoc.bio && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Doctor Bio</h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeDoc.bio}</p>
                </div>
              )}

              {/* Compliance Checklist */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs mb-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" /> Ministry Telemedicine & NMC Guidelines
                </div>
                <ul className="text-xs text-indigo-900/80 space-y-1 list-disc list-inside">
                  <li>Verify practitioner identity against MCI / State Medical Council digital registry.</li>
                  <li>Ensures only approved doctors can generate verifiable digital prescriptions.</li>
                  <li>All verification status modifications write immutable audit entries.</li>
                </ul>
              </div>

            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">Select a doctor from the list to review documents.</div>
        )}
      </div>

    </div>
  );
}
