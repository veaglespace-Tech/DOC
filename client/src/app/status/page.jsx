'use client';
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Activity } from 'lucide-react';

export default function SystemStatusPage() {
  const systems = [
    { name: 'Patient Portal', status: 'Operational', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: 'Doctor Dashboard', status: 'Operational', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: 'EHR Database', status: 'Operational', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: 'Video Consultations', status: 'Operational', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: 'Payment Gateway', status: 'Operational', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: 'Ambulance Dispatch API', status: 'Operational', color: 'text-emerald-500', bg: 'bg-emerald-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-800 selection:text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
            <Activity className="h-8 w-8 text-slate-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">System Status</h1>
          <p className="text-lg text-slate-600">Real-time status of ViolaCare services and APIs.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-12 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-emerald-900 font-bold text-xl">All Systems Operational</h3>
              <p className="text-emerald-700">Last updated: Just now.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Core Services</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {systems.map((sys, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-700">{sys.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${sys.color}`}>{sys.status}</span>
                    <div className={`h-2 w-2 rounded-full ${sys.bg}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 prose prose-slate max-w-none">
            <h3>Past Incidents</h3>
            <p className="text-slate-500 italic">No incidents reported in the last 90 days.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
