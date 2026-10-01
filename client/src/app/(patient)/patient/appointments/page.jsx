'use client';

import React from 'react';
import { useGetMyAppointmentsQuery } from '@/store/api/appointmentApi';
import { Calendar, Clock, MapPin, ChevronRight, Stethoscope, Video, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { data: response, isLoading } = useGetMyAppointmentsQuery();
  const appointments = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-slate-500 font-medium mt-1">Track and manage your upcoming and past visits.</p>
        </div>
        <Link href="/patient/search">
          <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5">
            <Stethoscope className="h-5 w-5" />
            Book New Appointment
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
            <div className="h-20 w-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h3>
            <p className="text-slate-500 font-medium mb-6">You don't have any upcoming or past appointments.</p>
            <Link href="/patient/search">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                Find a Doctor
              </button>
            </Link>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 bg-slate-100 rounded-full overflow-hidden shrink-0">
                    <img 
                      src={apt.doctor?.user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(apt.doctor?.name || "Doctor") + "&background=0D8ABC&color=fff"} 
                      alt="Doctor"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{apt.doctor?.name || "Doctor"}</h3>
                    <p className="text-sm font-bold text-teal-600 mb-3">{apt.doctor?.specializations?.[0]?.specialization || "General Physician"}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(apt.scheduledAt))}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(apt.scheduledAt))}</span>
                      <span className="flex items-center gap-1.5">
                        {apt.serviceType === 'VIRTUAL' ? <Video className="h-4 w-4 text-indigo-400" /> : apt.serviceType === 'HOME_VISIT' ? <Navigation className="h-4 w-4 text-amber-400" /> : <MapPin className="h-4 w-4 text-rose-400" />} 
                        {apt.serviceType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 md:items-end md:flex-col h-full justify-between">
                  <div className="w-full sm:w-auto text-center">
                    <span className={`px-4 py-1.5 text-sm font-bold rounded-full inline-block w-full ${
                      apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                      apt.status === 'REQUESTED' ? 'bg-amber-100 text-amber-700' : 
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      apt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <button className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
