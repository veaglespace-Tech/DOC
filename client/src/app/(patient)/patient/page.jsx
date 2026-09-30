'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  Activity, 
  ChevronRight,
  MapPin,
  AlertCircle
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
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here is your health overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/patient/sos">
            <button className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5">
              <AlertCircle className="h-5 w-5" />
              Emergency SOS
            </button>
          </Link>
          <Link href="/patient/search">
            <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5">
              <Stethoscope className="h-5 w-5" />
              Book Appointment
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-14 w-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
            <Calendar className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Upcoming Visits</p>
            <p className="text-2xl font-extrabold text-slate-900">{dashboardData.upcomingVisits || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Consultations</p>
            <p className="text-2xl font-extrabold text-slate-900">{dashboardData.totalConsultations || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">New Reports</p>
            <p className="text-2xl font-extrabold text-slate-900">{dashboardData.newReports || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
            <button className="text-sm font-bold text-teal-600 hover:text-teal-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-sm font-medium text-teal-600">{apt.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {apt.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {apt.status}
                    </span>
                    <button className="mt-4 sm:mt-0 flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">
                      Details <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Recent Visits & Records */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Medical Records</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {recentVisits.map((visit) => (
              <div key={visit.id} className="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900">{visit.doctorName}</h4>
                  <span className="text-xs font-medium text-slate-400">{visit.date}</span>
                </div>
                <p className="text-sm font-medium text-teal-600 mb-2">{visit.specialty}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="font-medium truncate">Diagnosis: {visit.diagnosis}</span>
                </div>
              </div>
            ))}
            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <button className="text-sm font-bold text-teal-600 hover:text-teal-700">View Complete History</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal placeholder user icon
function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
