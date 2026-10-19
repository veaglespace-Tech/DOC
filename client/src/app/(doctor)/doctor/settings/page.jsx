'use client';

import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Settings, 
  IndianRupee, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MapPin, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  CreditCard,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetDoctorProfileQuery, useUpdateDoctorProfileMutation } from '@/store/api/doctorApi';

export default function DoctorSettingsPage() {
  const { data: profileResponse, isLoading, refetch } = useGetDoctorProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateDoctorProfileMutation();

  const doctor = profileResponse?.data || {};

  const [formData, setFormData] = useState({
    bio: '',
    consultationFee: 500,
    homeVisitFee: 1200,
    emergencyFee: 2000,
    serviceRadiusKm: 10,
    isEmergencyAvailable: true,
    bankAccountNumber: '',
    bankIfsc: '',
    bankAccountName: ''
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (doctor.id) {
      setFormData({
        bio: doctor.bio || '',
        consultationFee: Number(doctor.consultationFee) || 500,
        homeVisitFee: Number(doctor.homeVisitFee) || 1200,
        emergencyFee: Number(doctor.emergencyFee) || 2000,
        serviceRadiusKm: Number(doctor.serviceRadiusKm) || 10,
        isEmergencyAvailable: doctor.isEmergencyAvailable ?? true,
        bankAccountNumber: doctor.bankAccountNumber || '',
        bankIfsc: doctor.bankIfsc || '',
        bankAccountName: doctor.bankAccountName || ''
      });
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        bio: formData.bio,
        consultationFee: Number(formData.consultationFee),
        homeVisitFee: Number(formData.homeVisitFee),
        emergencyFee: Number(formData.emergencyFee),
        serviceRadiusKm: Number(formData.serviceRadiusKm),
        isEmergencyAvailable: formData.isEmergencyAvailable,
        bankAccountNumber: formData.bankAccountNumber,
        bankIfsc: formData.bankIfsc,
        bankAccountName: formData.bankAccountName
      }).unwrap();

      setSaveSuccess(true);
      refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err?.data?.message || 'Failed to update profile settings');
    }
  };

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Settings className="h-3.5 w-3.5 text-purple-600" />
          Clinical Practice Configuration
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Practice & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Fee Settings</span>
        </h1>
        <p className="text-slate-500 font-medium text-base mt-1">
          Configure consultation fees, emergency response radius, and bank settlement details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        
        {/* Practice Bio */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Clinical Biography & Credentials</h3>
              <p className="text-xs text-slate-500 font-medium">Shown on your public verified doctor card</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Professional Bio & Experience
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="e.g. Senior Consultant Cardiologist with 12+ years clinical experience in interventional cardiology and preventive healthcare..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Pricing & Fee Structure */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Consultation & Visit Fee Structure</h3>
              <p className="text-xs text-slate-500 font-medium">Set charges for in-clinic, home visits, and emergency responses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                OPD / Virtual Consult Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Doctor Home Visit Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={formData.homeVisitFee}
                onChange={(e) => setFormData({ ...formData, homeVisitFee: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Emergency SOS Dispatch Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={formData.emergencyFee}
                onChange={(e) => setFormData({ ...formData, emergencyFee: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-base focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Dispatch & Radius */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Emergency Dispatch Radius & Availability</h3>
              <p className="text-xs text-slate-500 font-medium">Configure geolocation dispatch boundaries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Service Radius: {formData.serviceRadiusKm} km
              </label>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={formData.serviceRadiusKm}
                onChange={(e) => setFormData({ ...formData, serviceRadiusKm: e.target.value })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1">
                <span>2 km (Local)</span>
                <span>15 km (Citywide)</span>
                <span>30 km (Metropolitan)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Emergency SOS Participation</h5>
                <p className="text-xs text-slate-500 mt-0.5">Receive immediate high-priority emergency notifications.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isEmergencyAvailable: !formData.isEmergencyAvailable })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  formData.isEmergencyAvailable ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  formData.isEmergencyAvailable ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Bank & Payout Details */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Bank Account for Payouts</h3>
              <p className="text-xs text-slate-500 font-medium">Used for automated 24-hour settlement transfers (BRD Sec 11)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Bank Account Number
              </label>
              <input
                type="text"
                placeholder="987654321012"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="HDFC0001234"
                value={formData.bankIfsc}
                onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm uppercase focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Account Holder Name
              </label>
              <input
                type="text"
                placeholder="Dr. Rajesh Sharma"
                value={formData.bankAccountName}
                onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-400 font-bold text-sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Practice Settings Saved Successfully!
                </motion.div>
              )}
            </AnimatePresence>
            {!saveSuccess && (
              <span className="text-xs text-slate-400">Remember to save after updating your practice parameters.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Practice Profile'}
          </button>
        </div>

      </form>

    </div>
  );
}
