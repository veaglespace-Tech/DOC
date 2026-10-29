'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Stethoscope, 
  ExternalLink,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMyClinicQuery } from '@/store/api/saasApi';
import { useSearchDoctorsQuery } from '@/store/api/doctorApi';
import Link from 'next/link';

export default function ClinicDoctorsPage() {
  const { data: clinicData, refetch: refetchClinic } = useGetMyClinicQuery();
  const { data: doctorsData, isLoading: isDoctorsLoading } = useSearchDoctorsQuery({});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [addDoctorForm, setAddDoctorForm] = useState({
    name: '',
    email: '',
    specialty: 'Cardiologist',
    licenseNumber: '',
    fees: 600
  });
  const [addSuccess, setAddSuccess] = useState(false);

  const clinic = clinicData?.data?.organization || {
    name: 'Doctor On Call Multi-Speciality Clinic',
    subdomain: 'citycare',
    plan: {
      name: 'Clinic Professional',
      doctorLimit: 15
    }
  };

  const usage = clinicData?.data?.usage || {
    currentDoctors: 4,
    maxDoctors: 15
  };

  const doctorsList = doctorsData?.data || [];
  const maxLimit = usage.maxDoctors || 15;
  const currentCount = usage.currentDoctors || doctorsList.length;
  const isQuotaReached = currentCount >= maxLimit;

  const filteredDoctors = doctorsList.filter(doc => {
    const matchesName = doc.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesName && matchesSpec;
  });

  const handleAddDoctorSubmit = (e) => {
    e.preventDefault();
    if (isQuotaReached) {
      alert('Cannot add doctor: Clinic SaaS quota reached. Please upgrade your subscription tier.');
      return;
    }

    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setIsAddDoctorModalOpen(false);
      setAddDoctorForm({ name: '', email: '', specialty: 'Cardiologist', licenseNumber: '', fees: 600 });
      alert(`Doctor invitation sent to ${addDoctorForm.email}!`);
    }, 1200);
  };

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/10 blur-[130px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="h-3.5 w-3.5 text-teal-600" />
            {clinic.name}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Clinic Doctors & Staff Roster
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Manage your facility&apos;s practitioners, schedule allotments, and credential verifications.
          </p>
        </div>

        <button
          onClick={() => setIsAddDoctorModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg text-sm ${
            isQuotaReached
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/25 hover:-translate-y-0.5'
          }`}
        >
          <Plus className="h-4 w-4" /> Add Doctor to Clinic
        </button>
      </div>

      {/* Capacity & Quota Alert Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 mb-8 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">SaaS Doctor Capacity</h3>
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {clinic.plan?.name || 'Clinic Professional'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Currently utilizing <span className="font-bold text-slate-800">{currentCount}</span> of <span className="font-bold text-slate-800">{maxLimit}</span> authorized practitioner seats.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-40 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isQuotaReached ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(Math.round((currentCount / maxLimit) * 100), 100)}%` }}
            ></div>
          </div>
          <Link
            href="/clinic"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 underline shrink-0"
          >
            Manage Tier
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctors by name or credential..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          {['All', 'Cardiologist', 'Neurologist', 'Pediatrician'].map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                selectedSpecialty === spec
                  ? 'bg-slate-900 text-white shadow-slate-900/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between hover:border-teal-200 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                      {doc.name}
                    </h3>
                    <span className="text-xs font-bold text-teal-600 flex items-center gap-1 mt-0.5">
                      <Stethoscope className="w-3.5 h-3.5" /> {doc.specialty}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-4">
                <div>
                  <span className="text-slate-400 font-medium block">Experience</span>
                  <span className="font-bold text-slate-800">{doc.experience}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Standard Fee</span>
                  <span className="font-bold text-slate-800">₹{doc.fees}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Home Visits</span>
                  <span className="font-bold text-emerald-600">
                    {doc.isEmergencyAvailable ? 'Available' : 'Clinic Only'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Rating</span>
                  <span className="font-bold text-amber-600">★ {doc.rating}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{doc.availability}</span>
              <Link
                href={`/doctors/${doc.id}`}
                target="_blank"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
              >
                Profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {isAddDoctorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-wider mb-2">
                  <Plus className="w-3.5 h-3.5 text-teal-600" />
                  Staff Onboarding
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Add Doctor to Facility
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Onboard an affiliated medical practitioner to your clinic roster.
                </p>
              </div>

              {isQuotaReached ? (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    Doctor Limit Reached
                  </div>
                  <p className="text-xs leading-relaxed">
                    Your clinic has reached its limit of {maxLimit} practitioners under the {clinic.plan?.name} plan.
                    Upgrade to Enterprise for unlimited practitioners.
                  </p>
                  <Link
                    href="/clinic"
                    className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                  >
                    Upgrade Plan Now
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
                  {addSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
                      Doctor added successfully!
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Doctor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Kulkarni"
                      value={addDoctorForm.name}
                      onChange={(e) => setAddDoctorForm({ ...addDoctorForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Email Address (Login ID)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh.k@hospital.com"
                      value={addDoctorForm.email}
                      onChange={(e) => setAddDoctorForm({ ...addDoctorForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Specialization
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Cardiologist"
                        value={addDoctorForm.specialty}
                        onChange={(e) => setAddDoctorForm({ ...addDoctorForm, specialty: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        MCI License No
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MCI-2024-8841"
                        value={addDoctorForm.licenseNumber}
                        onChange={(e) => setAddDoctorForm({ ...addDoctorForm, licenseNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Consultation Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      step="50"
                      value={addDoctorForm.fees}
                      onChange={(e) => setAddDoctorForm({ ...addDoctorForm, fees: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-teal-500/20 transition-all"
                    >
                      Onboard Doctor
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
