'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  Activity, 
  ChevronRight, 
  MapPin, 
  AlertCircle, 
  HeartPulse,
  Bot,
  Pill,
  ArrowRight,
  ShieldCheck,
  Zap,
  PlusCircle,
  Video
} from 'lucide-react';

import { useGetPatientDashboardQuery } from '@/store/api/patientApi';

export default function PatientDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { data: dashboardResponse, isLoading } = useGetPatientDashboardQuery();
  const dashboardData = dashboardResponse?.data || {};

  const upcomingAppointments = dashboardData.upcomingAppointments || [];
  const recentVisits = dashboardData.recentMedicalRecords || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const patientDisplayName = user?.name || user?.email?.split('@')[0] || 'Patient';

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-40 left-0 w-80 h-80 bg-purple-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      {/* 🌟 HERO WELCOME BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-indigo-950/20 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Verified Patient Account
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-teal-200">{patientDisplayName}</span>
          </h1>
          <p className="text-slate-300 font-medium text-xs sm:text-sm mt-1.5 leading-relaxed">
            Manage your consultations, encrypted health vault, and 24/7 medical access.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link href="/patient/search">
            <button className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] text-xs sm:text-sm shadow-md cursor-pointer">
              <Stethoscope className="h-4 w-4 text-indigo-600" />
              Find Specialist
            </button>
          </Link>
          <Link href="/patient/appointments">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] text-xs sm:text-sm backdrop-blur-md cursor-pointer">
              <Calendar className="h-4 w-4 text-teal-300" />
              My Bookings
            </button>
          </Link>
        </div>
      </motion.div>

      {/* 🌟 QUICK ACTIONS GRID (100% RESPONSIVE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* AI Symptom Triage */}
        <Link 
          href="/patient/ai-chat" 
          className="group p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
          <div>
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
              <Bot className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-base leading-tight">AI Symptom Triage</h3>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">Instant AI-assisted clinical check</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            Check Symptoms <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        {/* EHR Prescriptions */}
        <Link 
          href="/patient/records" 
          className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300/80 hover:scale-[1.02] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">EHR Vault</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Download digitally signed Rx</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
            View Vault <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        {/* My Appointments */}
        <Link 
          href="/patient/appointments" 
          className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300/80 hover:scale-[1.02] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">My Bookings</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Track visits &amp; consult status</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            Manage Slots <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        {/* Payment Receipts */}
        <Link 
          href="/patient/wallet" 
          className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300/80 hover:scale-[1.02] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">Wallet &amp; Invoices</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">UPI &amp; Razorpay payment ledger</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            View Ledger <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

      </div>

      {/* 🌟 METRICS STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Visits</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {dashboardData.upcomingVisits || upcomingAppointments.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Consults</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {dashboardData.totalConsultations || recentVisits.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">EHR Prescriptions</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {dashboardData.newReports || 2}
            </p>
          </div>
        </div>

      </div>

      {/* 🌟 MAIN CONTENT: UPCOMING CONSULTATIONS & CLINICAL HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column: Upcoming Consultations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" /> 
              Upcoming Consultations
            </h2>
            <Link 
              href="/patient/appointments"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          
          <div className="space-y-3.5">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 text-center shadow-xs">
                <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-3">
                  <Calendar className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">No Upcoming Appointments</h3>
                <p className="text-slate-500 text-xs mt-1 mb-5 max-w-sm mx-auto">
                  Book an online video consult or request a nearby verified doctor to your doorstep.
                </p>
                <Link
                  href="/patient/search"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm shadow-indigo-600/20"
                >
                  <Stethoscope className="h-4 w-4" /> Book Consultation Now
                </Link>
              </div>
            ) : upcomingAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                      {apt.doctorName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{apt.doctorName}</h4>
                      <p className="text-xs font-bold text-indigo-600 mb-1.5">{apt.specialty}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {apt.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {apt.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${
                      apt.status === 'Confirmed' || apt.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {apt.status}
                    </span>
                    <Link 
                      href={`/patient/consultation/${apt.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-3.5 py-1.5 rounded-xl transition-colors shadow-xs"
                    >
                      <Video className="h-3.5 w-3.5" /> Enter Room
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clinical History & Vault (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" /> 
              Clinical Vault
            </h2>
            <Link 
              href="/patient/records"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              All Records &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
            {recentVisits.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <div className="h-12 w-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-2.5">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">No recent records yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Consultation summaries and lab tests will be securely archived here.</p>
              </div>
            ) : recentVisits.map((visit) => (
              <div key={visit.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{visit.doctorName}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{visit.date}</span>
                </div>
                <p className="text-xs font-semibold text-teal-600 mb-2">{visit.specialty}</p>
                <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-medium">
                  Diagnosis: {visit.diagnosis}
                </div>
              </div>
            ))}

            <div className="p-3.5 bg-slate-50/70 text-center">
              <Link 
                href="/patient/records"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5"
              >
                Open Full Medical Records Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
