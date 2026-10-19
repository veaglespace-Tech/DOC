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
  User as UserIcon,
  HeartPulse,
  Bot,
  Pill,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none z-0"></div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            Verified Patient Account
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.name || 'Patient'}</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">Here is your live health overview and upcoming consultations.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/patient/sos">
            <button className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105 text-sm">
              <AlertCircle className="h-4 w-4 animate-pulse" />
              Emergency SOS (5km)
            </button>
          </Link>
          <Link href="/patient/search">
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 text-sm">
              <Stethoscope className="h-4 w-4" />
              Find Specialist
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Action Feature Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
        <Link href="/patient/ai-chat" className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all group relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
          <Bot className="h-8 w-8 mb-3 text-indigo-100 group-hover:scale-110 transition-transform" />
          <h4 className="font-black text-lg leading-tight">AI Symptom Triage</h4>
          <p className="text-xs text-indigo-100 mt-1">Instant medical AI consultation & diagnosis</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            Check Symptoms <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link href="/patient/records" className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-105 transition-all group">
          <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">EHR Prescriptions</h4>
          <p className="text-xs text-slate-500 mt-1">Download digitally signed PDFs</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
            View Vault <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link href="/patient/appointments" className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-105 transition-all group">
          <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">My Bookings</h4>
          <p className="text-xs text-slate-500 mt-1">Track visits & consult status</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            Manage Slots <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link href="/patient/wallet" className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-105 transition-all group">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Payment Receipts</h4>
          <p className="text-xs text-slate-500 mt-1">GST invoices & Razorpay receipts</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            View Ledger <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10"
      >
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Calendar className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Visits</p>
            <p className="text-3xl font-black text-slate-900 mt-0.5">{dashboardData.upcomingVisits || upcomingAppointments.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Consultations</p>
            <p className="text-3xl font-black text-slate-900 mt-0.5">{dashboardData.totalConsultations || recentVisits.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-14 w-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
            <Pill className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">EHR Prescriptions</p>
            <p className="text-3xl font-black text-slate-900 mt-0.5">{dashboardData.newReports || 2}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Appointments & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        
        {/* Main Content: Upcoming Appointments */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-600" /> Upcoming Consultations
            </h2>
            <Link 
              href="/patient/appointments"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center shadow-sm">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-base">No Upcoming Appointments</h4>
                <p className="text-slate-500 text-xs mt-1 mb-4">Book an appointment with certified specialists at your convenience.</p>
                <Link
                  href="/patient/search"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm shadow-indigo-600/20"
                >
                  <Stethoscope className="h-3.5 w-3.5" /> Book Consultation
                </Link>
              </div>
            ) : upcomingAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-indigo-500/20">
                      {apt.doctorName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-xs font-bold text-indigo-600 mb-2">{apt.specialty}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {apt.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {apt.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end justify-between gap-3">
                    <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-xl border ${
                      apt.status === 'Confirmed' || apt.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {apt.status}
                    </span>
                    <Link 
                      href={`/patient/consultation/${apt.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      Enter Room <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar: Recent Health Records */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-teal-600" /> Clinical History
            </h2>
            <Link 
              href="/patient/records"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              Vault
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
            {recentVisits.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No recent records yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Consultation notes will be archived here.</p>
              </div>
            ) : recentVisits.map((visit) => (
              <div key={visit.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{visit.doctorName}</h4>
                  <span className="text-[11px] font-bold text-slate-400">{visit.date}</span>
                </div>
                <p className="text-xs font-bold text-teal-600 mb-2">{visit.specialty}</p>
                <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-medium">
                  Diagnosis: {visit.diagnosis}
                </div>
              </div>
            ))}

            <div className="p-4 bg-slate-50/70 text-center">
              <Link 
                href="/patient/records"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                Open Full Medical Records Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
