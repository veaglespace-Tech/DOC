import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Phone, CheckCircle, ShieldAlert } from 'lucide-react';

export default function SOSTrackingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
      
      {/* Fake Map Background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-800/80 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Emergency Active</h1>
            <p className="text-xs text-red-400 font-bold uppercase tracking-wider">DO NOT CLOSE THIS APP</p>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative z-10 flex items-center justify-center">
        {/* Radar Effect */}
        <div className="absolute h-96 w-96 border border-teal-500/20 rounded-full animate-ping duration-[3000ms]"></div>
        <div className="absolute h-64 w-64 border border-teal-500/30 rounded-full animate-ping duration-[2000ms]"></div>
        
        <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_50px_rgba(20,184,166,0.8)]">
          <MapPin className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Tracking Card */}
      <div className="relative z-20 bg-white text-slate-900 rounded-t-[3rem] shadow-2xl p-8 pt-10">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border border-white/10">
          ETA: 4 MINS
        </div>

        <div className="flex items-center gap-5 mb-8">
          <div className="h-16 w-16 bg-slate-100 rounded-full overflow-hidden border-2 border-teal-500">
            <img src="https://i.pravatar.cc/150?img=11" alt="Doctor" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-slate-900">Dr. Rahul Sharma</h3>
            <p className="text-sm font-semibold text-slate-500">Trauma Specialist • 1.2 km away</p>
          </div>
          <button className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors">
            <Phone className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">SOS Triggered</p>
              <p className="text-xs text-slate-500">12:42 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Doctor Dispatched</p>
              <p className="text-xs text-slate-500">12:43 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-teal-100 border-2 border-teal-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
              <Navigation className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-teal-600">En Route to Location</p>
              <p className="text-xs text-slate-500">Currently arriving via Swift Emergency Unit</p>
            </div>
          </div>
        </div>

        <Link href="/patient" className="w-full block text-center py-4 rounded-2xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors">
          Dismiss Tracking Screen
        </Link>
      </div>

    </div>
  );
}
