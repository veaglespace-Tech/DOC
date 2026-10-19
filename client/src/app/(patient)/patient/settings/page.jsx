'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Save, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Phone, 
  User, 
  Mail, 
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function PatientSettingsPage() {
  const { user } = useSelector((state) => state.auth);

  const [settings, setSettings] = useState({
    smsAlerts: true,
    emailAlerts: true,
    whatsappAlerts: true,
    language: 'English',
    emergencyContact: '+91 98220 12345',
    shareRecordsWithDoctors: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 pb-24 max-w-4xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Settings className="h-3.5 w-3.5 text-indigo-600" />
          Patient Account & App Settings
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Preferences</span>
        </h1>
        <p className="text-slate-500 font-medium text-base mt-1">
          Customize notifications, emergency dispatch protocols, and privacy controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 relative z-10">
        
        {/* Notification Settings */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Communication & Alerts</h3>
              <p className="text-xs text-slate-500 font-medium">Select how you want to receive appointment and visit updates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">WhatsApp Notifications</h5>
                <p className="text-xs text-slate-500 mt-0.5">Receive booking confirmations and doctor ETA on WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, whatsappAlerts: !settings.whatsappAlerts })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.whatsappAlerts ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  settings.whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">SMS Direct Alerts</h5>
                <p className="text-xs text-slate-500 mt-0.5">Instant OTP and emergency dispatch status via SMS.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, smsAlerts: !settings.smsAlerts })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.smsAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  settings.smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Email Invoices & Prescriptions</h5>
                <p className="text-xs text-slate-500 mt-0.5">Receive copy of prescription and GST tax invoice via email.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.emailAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  settings.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & EHR Sharing */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Health Data Privacy & Consent</h3>
              <p className="text-xs text-slate-500 font-medium">Manage healthcare record visibility for attending doctors</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Automated Medical History Sharing</h5>
              <p className="text-xs text-slate-500 mt-0.5">Allow booked doctors to view recent vitals and past prescriptions.</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, shareRecordsWithDoctors: !settings.shareRecordsWithDoctors })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.shareRecordsWithDoctors ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                settings.shareRecordsWithDoctors ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-400 font-bold text-sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Preferences Saved Successfully!
                </motion.div>
              )}
            </AnimatePresence>
            {!saved && (
              <span className="text-xs text-slate-400">Your preferences apply across Web and Mobile Patient apps.</span>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>

      </form>

    </div>
  );
}
