'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Settings, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MapPin, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMyClinicQuery, useUpdateClinicSettingsMutation } from '@/store/api/saasApi';
import Link from 'next/link';

export default function ClinicSettingsPage() {
  const { data: clinicData, refetch } = useGetMyClinicQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateClinicSettingsMutation();

  const clinic = clinicData?.data?.organization || {};
  const usage = clinicData?.data?.usage || {};

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    phone: '+91 98765 43210',
    address: '4th Floor, Health Tower, Senapati Bapat Road, Pune',
    operatingHours: '08:00 AM - 10:00 PM',
    emergencyEnabled: true,
    autoAcceptAppointments: true
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (clinic.name) {
      setFormData(prev => ({
        ...prev,
        name: clinic.name || 'City Care Health Clinic',
        subdomain: clinic.subdomain || 'citycare'
      }));
    }
  }, [clinic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({
        name: formData.name,
        subdomain: formData.subdomain
      }).unwrap();
      
      setSaveSuccess(true);
      refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err?.data?.message || 'Failed to update settings');
    }
  };

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="h-3.5 w-3.5 text-blue-600" />
            Clinic HQ Configuration
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Settings</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Manage multi-tenant branding, facility hours, subdomain routing, and emergency protocols.
          </p>
        </div>

        <Link
          href="/clinic"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
        >
          View Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        
        {/* Clinic Identity & Subdomain */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Organization Profile & Subdomain</h3>
              <p className="text-xs text-slate-500 font-medium">Public facing clinic name and unique URL identifier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Official Clinic Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Clinic Subdomain
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl font-bold text-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <span className="px-4 py-3 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-xs font-bold text-slate-500 select-none">
                  .careconnect.in
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Facility Logistics */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Facility Location & Operating Hours</h3>
              <p className="text-xs text-slate-500 font-medium">OPD reception contact and patient walk-in timings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Reception Helpline
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Daily Operating Hours
              </label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Physical Facility Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Operational Policies & Protocol Toggles */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">System Protocols & Dispatch Policies</h3>
              <p className="text-xs text-slate-500 font-medium">Automatic dispatch and emergency SOS handling</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Emergency SOS Dispatch Node</h5>
                <p className="text-xs text-slate-500 mt-0.5">Participate in nearby 5km emergency doctor dispatch requests.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, emergencyEnabled: !formData.emergencyEnabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  formData.emergencyEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  formData.emergencyEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Instant Token Generation</h5>
                <p className="text-xs text-slate-500 mt-0.5">Automatically confirm online bookings and assign OPD token numbers.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, autoAcceptAppointments: !formData.autoAcceptAppointments })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  formData.autoAcceptAppointments ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  formData.autoAcceptAppointments ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
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
                  Clinic Settings Saved Successfully!
                </motion.div>
              )}
            </AnimatePresence>
            {!saveSuccess && (
              <span className="text-xs text-slate-400">Remember to save after making changes to your clinic configuration.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

      </form>

    </div>
  );
}
