'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  Power,
  FileText
} from 'lucide-react';

import { useGetDoctorDashboardQuery } from '@/store/api/doctorApi';

export default function DoctorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [isAvailable, setIsAvailable] = useState(true);
  const { data: dashboardResponse, isLoading } = useGetDoctorDashboardQuery();
  const dashboardData = dashboardResponse?.data || {};

  const stats = [
    { label: "Today's Appointments", value: dashboardData.todaysAppointments || '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/80' },
    { label: 'Pending Requests', value: dashboardData.pendingRequests || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/80' },
    { label: "Today's Earnings", value: `₹ ${dashboardData.todaysEarnings || 0}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50/80' },
    { label: 'Emergency Alerts', value: dashboardData.emergencyAlerts || '0', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50/80' }
  ];

  const todayAppointments = dashboardData.schedule || [];

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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-teal-400/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Dr. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-500">{user?.name || 'Doctor'}</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Here is your practice overview for today.</p>
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-xl shadow-slate-200/40 border border-white">
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900 tracking-wide uppercase">Current Status</span>
            <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isAvailable ? 'Available for Walk-ins & Emergencies' : 'Offline / Do Not Disturb'}
            </span>
          </div>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`ml-4 h-14 w-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105 shadow-inner ${
              isAvailable 
                ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600' 
                : 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400'
            }`}
          >
            <Power className="h-7 w-7" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10"
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform">
            <div className={`h-16 w-16 rounded-[1.2rem] flex items-center justify-center shadow-inner ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Main Content: Today's Schedule */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-teal-500" /> Today's Schedule
            </h2>
            <button className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-xl transition-colors">Manage Calendar</button>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-6 text-xs font-black uppercase tracking-wider text-slate-500">Patient</th>
                    <th className="p-6 text-xs font-black uppercase tracking-wider text-slate-500">Time</th>
                    <th className="p-6 text-xs font-black uppercase tracking-wider text-slate-500">Type</th>
                    <th className="p-6 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                    <th className="p-6 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.length === 0 ? (
                     <tr>
                       <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">No appointments scheduled for today.</td>
                     </tr>
                  ) : todayAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                      <td className="p-6">
                        <div className="font-black text-slate-900">{apt.patientName}</div>
                      </td>
                      <td className="p-6 font-bold text-teal-600 bg-teal-50/30">{apt.time}</td>
                      <td className="p-6">
                        <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                          {apt.type === 'Virtual Consult' ? <Activity className="h-4 w-4 text-indigo-500" /> : <Stethoscope className="h-4 w-4 text-teal-500" />}
                          {apt.type}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl ${
                          apt.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                          apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-sm font-bold text-white bg-slate-900 hover:bg-teal-600 px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1">Open <ChevronRight className="h-4 w-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Sidebar: Emergency & Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {dashboardData.latestEmergency && (
            <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-[2rem] p-8 shadow-2xl shadow-rose-500/30 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
              <AlertTriangle className="absolute -bottom-6 -right-6 h-40 w-40 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 bg-white rounded-full animate-ping"></div>
                  <h3 className="font-black text-lg tracking-wide uppercase">Emergency SOS</h3>
                </div>
                <p className="font-medium text-rose-100 mb-1 opacity-80 uppercase text-xs tracking-wider">Patient</p>
                <p className="font-black text-2xl mb-4">{dashboardData.latestEmergency.patientName}</p>
                
                <p className="font-medium text-rose-100 mb-1 opacity-80 uppercase text-xs tracking-wider">Location</p>
                <p className="font-bold text-lg mb-6 truncate">{dashboardData.latestEmergency.location}</p>
                
                <button className="w-full bg-white text-rose-600 py-3 rounded-xl font-black hover:bg-rose-50 transition-colors shadow-lg">
                  Acknowledge & Respond
                </button>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 pt-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" /> Quick Actions
          </h2>
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-4 flex flex-col gap-3">
            <button className="flex items-center gap-4 w-full p-4 hover:bg-teal-50 rounded-2xl transition-colors group">
              <div className="h-12 w-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-teal-700">Write Prescription</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Create new Rx</div>
              </div>
            </button>
            <button className="flex items-center gap-4 w-full p-4 hover:bg-sky-50 rounded-2xl transition-colors group">
              <div className="h-12 w-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-sky-700">Update Availability</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Set work hours</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
