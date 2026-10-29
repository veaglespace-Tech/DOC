'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  Award, 
  CreditCard, 
  Stethoscope,
  ExternalLink,
  ChevronRight,
  Info,
  Save,
  Check
} from 'lucide-react';
import { 
  useGetDoctorProfileQuery, 
  useUploadDoctorKycMutation,
  useUpdateDoctorProfileMutation,
  useAddDoctorSpecializationMutation,
  useRemoveDoctorSpecializationMutation
} from '@/store/api/doctorApi';

const DOC_TYPES = [
  {
    type: 'MEDICAL_LICENSE',
    title: 'State Medical Council License',
    description: 'Valid permanent or provisional registration certificate with MCI / State Council.',
    icon: Award,
    required: true
  },
  {
    type: 'DEGREE_CERTIFICATE',
    title: 'Degree Certificate (MBBS / MD / MS)',
    description: 'Degree diploma certificate from an NMC / MCI recognized university.',
    icon: Stethoscope,
    required: true
  },
  {
    type: 'ID_PROOF',
    title: 'Government Identity Proof',
    description: 'Aadhaar Card, Passport, or PAN card matching your medical registration.',
    icon: ShieldCheck,
    required: true
  },
  {
    type: 'CLINIC_REGISTRATION',
    title: 'Clinic / Establishment Certificate',
    description: 'Clinical Establishments Act registration certificate or hospital affiliation letter.',
    icon: Building2,
    required: false
  }
];

export default function DoctorKycPage() {
  const { data: profileResponse, isLoading, refetch } = useGetDoctorProfileQuery();
  const [uploadKyc, { isLoading: isUploading }] = useUploadDoctorKycMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateDoctorProfileMutation();
  const [addSpec, { isLoading: isAddingSpec }] = useAddDoctorSpecializationMutation();
  const [removeSpec] = useRemoveDoctorSpecializationMutation();

  const doctor = profileResponse?.data || {};
  const documents = doctor.documents || [];
  const specializations = doctor.specializations || [];

  const [activeUploadType, setActiveUploadType] = useState(null);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });
  const [newSpecName, setNewSpecName] = useState('');

  // Practice & Profile state (derived from loaded doctor profile)
  const [customBio, setCustomBio] = useState(null);
  const [customExp, setCustomExp] = useState(null);
  const [customFee, setCustomFee] = useState(null);
  const [customEmergency, setCustomEmergency] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const bio = customBio !== null ? customBio : (doctor.bio || '');
  const experienceYears = customExp !== null ? customExp : (doctor.experienceYears || 0);
  const consultationFee = customFee !== null ? customFee : (doctor.consultationFee || 500);
  const isEmergencyAvailable = customEmergency !== null ? customEmergency : (doctor.isEmergencyAvailable || false);

  const handleFileUpload = async (type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage({ text: 'File size must be less than 10MB', type: 'error' });
      return;
    }

    try {
      setActiveUploadType(type);
      setUploadMessage({ text: 'Uploading document securely...', type: 'info' });

      const form = new FormData();
      form.append('type', type);
      form.append('file', file);

      await uploadKyc(form).unwrap();
      setUploadMessage({ text: 'Document submitted for verification successfully!', type: 'success' });
      refetch();
    } catch (err) {
      setUploadMessage({ text: err?.data?.message || 'Failed to upload document. Please try again.', type: 'error' });
    } finally {
      setActiveUploadType(null);
      setTimeout(() => setUploadMessage({ text: '', type: '' }), 6000);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        bio,
        experienceYears: Number(experienceYears),
        consultationFee: Number(consultationFee),
        isEmergencyAvailable: Boolean(isEmergencyAvailable)
      }).unwrap();

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Error updating profile details');
    }
  };

  const handleAddSpecialization = async (e) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;

    try {
      await addSpec({ specialization: newSpecName.trim() }).unwrap();
      setNewSpecName('');
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Failed to add specialization');
    }
  };

  const handleRemoveSpecialization = async (spec) => {
    if (!confirm(`Remove ${typeof spec === 'string' ? spec : spec.name} specialization?`)) return;
    try {
      // Find id if available
      const specObj = doctor.doctorSpecializations?.find(ds => ds.specialization?.name === (typeof spec === 'string' ? spec : spec.name));
      if (specObj) {
        await removeSpec(specObj.specializationId).unwrap();
        refetch();
      }
    } catch (err) {
      alert(err?.data?.message || 'Failed to remove specialization');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const isVerifiedDoctor = doctor.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-60 left-0 w-[450px] h-[450px] bg-teal-400/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl mb-10 border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-300 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Doctor Credential Verification & Compliance
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              KYC & Practice Credentials
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Upload your Medical Council Registration, degree certificates, and identity documents for institutional compliance and verification badge on search results.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-start sm:items-end gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Account Verification</span>
            <div className="flex items-center gap-2">
              {isVerifiedDoctor ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Verified Medical Practitioner
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Verification Pending Review
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-400">License No: <span className="font-mono text-white font-bold">{doctor.licenseNumber || 'Not provided'}</span></span>
          </div>
        </div>
      </div>

      {/* Global Alert Notification */}
      <AnimatePresence>
        {uploadMessage.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border ${
              uploadMessage.type === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : uploadMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {uploadMessage.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : uploadMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <span>{uploadMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: KYC Documents Upload Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" /> Required KYC Documents
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {documents.length} of {DOC_TYPES.length} Submitted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {DOC_TYPES.map((docDef) => {
              const uploadedDoc = documents.find(d => d.type === docDef.type);
              const isUploadingThis = isUploading && activeUploadType === docDef.type;
              const Icon = docDef.icon;

              return (
                <div
                  key={docDef.type}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-slate-100 flex flex-col justify-between hover:border-purple-300 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      {uploadedDoc ? (
                        getStatusBadge(uploadedDoc.status)
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                          {docDef.required ? 'Mandatory' : 'Optional'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{docDef.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {docDef.description}
                      </p>
                    </div>

                    {uploadedDoc && (
                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="text-slate-400 font-medium block">Uploaded on</span>
                          <span className="font-semibold text-slate-700">
                            {new Date(uploadedDoc.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <a
                          href={uploadedDoc.fileUrl.startsWith('http') ? uploadedDoc.fileUrl : `http://localhost:5000${uploadedDoc.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold inline-flex items-center gap-1 transition-colors shrink-0"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <label className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                      isUploadingThis
                        ? 'bg-purple-200 text-purple-800 cursor-not-allowed'
                        : uploadedDoc
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20'
                    }`}>
                      <Upload className="w-4 h-4" />
                      {isUploadingThis ? 'Uploading...' : uploadedDoc ? 'Replace Document' : 'Upload File (PDF/Image)'}
                      <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/jpg"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleFileUpload(docDef.type, e)}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Specializations Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg shadow-slate-100 space-y-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-purple-600" /> Medical Specializations
            </h2>

            <div className="flex flex-wrap gap-2">
              {specializations.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No specializations added yet.</p>
              ) : (
                specializations.map((spec, i) => {
                  const specName = typeof spec === 'string' ? spec : spec.name;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-50 text-purple-700 font-bold text-sm border border-purple-200"
                    >
                      {specName}
                    </span>
                  );
                })
              )}
            </div>

            <form onSubmit={handleAddSpecialization} className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Cardiologist, Pediatrician, Neurologist"
                value={newSpecName}
                onChange={(e) => setNewSpecName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
              <button
                type="submit"
                disabled={isAddingSpec || !newSpecName.trim()}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-purple-600/20 transition-all"
              >
                Add Specialization
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Practice Profile Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg shadow-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" /> Practice Info
              </h2>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Professional Bio
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  placeholder="Share a brief overview of your clinical experience, achievements, and patient approach..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    value={experienceYears}
                    onChange={(e) => setCustomExp(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Standard Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={consultationFee}
                    onChange={(e) => setCustomFee(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
              </div>



              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-purple-600 text-white font-bold text-sm shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Saving Changes...' : 'Save Practice Details'}
              </button>
            </form>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-3xl p-6 border border-purple-100 text-purple-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              Compliance Note
            </div>
            <p className="text-xs leading-relaxed text-purple-800">
              In accordance with Telemedicine Practice Guidelines issued by the Ministry of Health & Family Welfare, doctors must have verified credentials on file before issuing digital prescriptions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
