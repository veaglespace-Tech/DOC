import React from 'react';
import Link from 'next/link';
import { ShieldAlert, MapPin, Activity, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PatientSOSTriggerPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden relative z-10">
        <div className="bg-red-600 p-8 text-center text-white">
          <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShieldAlert className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Emergency SOS</h1>
          <p className="mt-2 text-red-100 font-medium">Instantly dispatch the nearest available doctor to your location.</p>
        </div>

        <div className="p-8">
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100 mb-8 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">
              Use this only in case of a genuine medical emergency. Our PostGIS routing system will alert all doctors within a 5km radius immediately.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                <option>Cardiac Arrest / Chest Pain</option>
                <option>Severe Trauma / Bleeding</option>
                <option>Respiratory Distress</option>
                <option>Stroke Symptoms</option>
                <option>Other Medical Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Your Current Location</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="text-slate-600 font-medium truncate">Detecting precise GPS coordinates...</span>
                <Activity className="h-4 w-4 text-emerald-500 animate-pulse ml-auto" />
              </div>
            </div>
          </div>

          <Link href="/patient/sos/tracking" className="mt-10 group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-red-600 hover:bg-red-700 focus:outline-none shadow-xl shadow-red-600/30 transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-rose-500 group-hover:scale-105 transition-transform duration-500"></div>
            <span className="relative flex items-center gap-2">
              TRIGGER EMERGENCY DISPATCH <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
          
          <button className="mt-4 w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
