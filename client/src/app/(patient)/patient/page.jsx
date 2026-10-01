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
  User as UserIcon
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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Premium Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-sky-400/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-500">{user?.name || 'Patient'}</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Here is your health overview for today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/patient/sos">
            <button className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-1">
              <AlertCircle className="h-5 w-5" />
              Emergency SOS
            </button>
          </Link>
          <Link href="/patient/search">
            <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1">
              <Stethoscope className="h-5 w-5" />
              Book Appointment
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex items-center gap-5 hover:scale-[1.02] transition-transform">
          <div className="h-16 w-16 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner">
            <Calendar className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Upcoming Visits</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{dashboardData.upcomingVisits || 0}</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex items-center gap-5 hover:scale-[1.02] transition-transform">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Activity className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Consultations</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{dashboardData.totalConsultations || 0}</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex items-center gap-5 hover:scale-[1.02] transition-transform">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">New Reports</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{dashboardData.newReports || 0}</p>
          </div>
        </div>
      </motion.div>

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
              <Calendar className="h-6 w-6 text-teal-500" /> Upcoming Appointments
            </h2>
            <button className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-xl transition-colors">View All</button>
          </div>
          
          <div className="space-y-5">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white/50 border border-dashed border-slate-300 rounded-[2rem] p-10 text-center">
                <p className="text-slate-500 font-medium">No upcoming appointments found.</p>
              </div>
            ) : upcomingAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-teal-500/10 transition-all hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="h-14 w-14 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 rounded-[1.2rem] flex items-center justify-center text-slate-400 shrink-0">
                      <UserIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{apt.doctorName}</h3>
                      <p className="text-sm font-bold text-teal-600 mb-2">{apt.specialty}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl">
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {apt.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" /> {apt.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full gap-4">
                    <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl ${apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {apt.status}
                    </span>
                    <button className="flex items-center gap-1 text-sm font-bold text-white bg-slate-900 hover:bg-teal-600 px-4 py-2 rounded-xl transition-colors">
                      Details <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar: Recent Visits & Records */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-500" /> Recent Records
          </h2>
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            {recentVisits.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500 font-medium">No recent records.</p>
              </div>
            ) : recentVisits.map((visit) => (
              <div key={visit.id} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{visit.doctorName}</h4>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{visit.date}</span>
                </div>
                <p className="text-sm font-bold text-sky-600 mb-3">{visit.specialty}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                  <FileText className="h-4 w-4 text-teal-500" />
                  <span className="font-medium truncate">Diagnosis: {visit.diagnosis}</span>
                </div>
              </div>
            ))}
            {recentVisits.length > 0 && (
              <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-sm font-bold text-teal-600 hover:text-teal-700 w-full py-2 hover:bg-teal-50 rounded-xl transition-colors">
                  View Complete History
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

