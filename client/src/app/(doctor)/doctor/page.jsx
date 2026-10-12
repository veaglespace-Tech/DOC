'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileText,
  CreditCard,
  ArrowRightLeft,
  PhoneCall,
  ShieldAlert
} from 'lucide-react';

import { useGetDoctorDashboardQuery } from '@/store/api/doctorApi';
import { useRespondEmergencyMutation } from '@/store/api/emergencyApi';
import { getClientSocket } from '@/utils/socket';

export default function DoctorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [isAvailable, setIsAvailable] = useState(true);
  const { data: dashboardResponse, isLoading } = useGetDoctorDashboardQuery();
  const [respondEmergency] = useRespondEmergencyMutation();
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState(null);

  const dashboardData = dashboardResponse?.data || {};

  useEffect(() => {
    // Listen for live emergency dispatch via Socket.IO
    const socket = getClientSocket();
    if (socket) {
      if (user?.id) {
        socket.emit('join:user', user.id);
      }

      socket.on('emergency:new_dispatch', (alertData) => {
        setActiveEmergencyAlert(alertData);
      });
    }
  }, [user]);

  const handleEmergencyResponse = async (action) => {
    if (!activeEmergencyAlert) return;
    try {
      await respondEmergency({
        assignmentId: activeEmergencyAlert.assignmentId,
        action
      }).unwrap();

      if (action === 'ACCEPT') {
        alert('Emergency accepted! Patient notified. Please head to patient coordinates immediately.');
      }
      setActiveEmergencyAlert(null);
    } catch (err) {
      alert(err?.data?.message || 'Error processing response');
    }
  };

  const stats = [
    { label: "Today's Appointments", value: dashboardData.todaysAppointments || '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/80' },
    { label: 'Pending Requests', value: dashboardData.pendingRequests || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/80' },
    { label: "Today's Earnings", value: `₹ ${dashboardData.todaysEarnings || 0}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50/80' },
    { label: 'Emergency Alerts', value: activeEmergencyAlert ? '1 ACTIVE' : (dashboardData.emergencyAlerts || '0'), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50/80' }
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

      {/* Real-time Emergency SOS Alert Banner */}
      <AnimatePresence>
        {activeEmergencyAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl shadow-red-600/40 border border-red-400/40 relative z-20 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl animate-pulse">
                  <ShieldAlert className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                      CRITICAL SOS ALERT
                    </span>
                    <span className="text-xs text-red-100 font-bold">
                      {activeEmergencyAlert.distanceKm} km away from your location
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mt-1">Patient: {activeEmergencyAlert.patientName}</h3>
                  <p className="text-red-100 text-sm mt-0.5 font-medium">
                    Needs: <span className="underline">{activeEmergencyAlert.medicalNeeds}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEmergencyResponse('REJECT')}
                  className="px-5 py-3 rounded-xl bg-black/30 hover:bg-black/40 text-white font-bold text-sm transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleEmergencyResponse('ACCEPT')}
                  className="px-6 py-3 rounded-xl bg-white text-red-600 hover:bg-red-50 font-black text-sm shadow-xl transition-transform hover:scale-105"
                >
                  ACCEPT & DISPATCH NOW
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <Link href="/doctor/availability" className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-xl transition-colors">
              Manage Calendar
            </Link>
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
                        <Link href={`/doctor/consultation/${apt.id}`} className="text-sm font-bold text-white bg-slate-900 hover:bg-teal-600 px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1">
                          Open <ChevronRight className="h-4 w-4 inline" />
                        </Link>
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
          {/* Quick Actions */}
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" /> Core Modules
          </h2>
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-4 flex flex-col gap-3">
            
            <Link href="/doctor/wallet" className="flex items-center gap-4 w-full p-4 hover:bg-teal-50 rounded-2xl transition-colors group">
              <div className="h-12 w-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-teal-700">Wallet & Settlements</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">24h hold & bank payouts</div>
              </div>
            </Link>

            <Link href="/doctor/availability" className="flex items-center gap-4 w-full p-4 hover:bg-sky-50 rounded-2xl transition-colors group">
              <div className="h-12 w-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-sky-700">Update Availability</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Working hours & leaves</div>
              </div>
            </Link>

            <Link href="/doctor/handovers" className="flex items-center gap-4 w-full p-4 hover:bg-amber-50 rounded-2xl transition-colors group">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-amber-700">Case Handovers</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Transfer cases & incoming requests</div>
              </div>
            </Link>

            <Link href="/doctor/prescription" className="flex items-center gap-4 w-full p-4 hover:bg-purple-50 rounded-2xl transition-colors group">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-purple-700">Prescription Pad</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Generate digital Rx PDF</div>
              </div>
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
