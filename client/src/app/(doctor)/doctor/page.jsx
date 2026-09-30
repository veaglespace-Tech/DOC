'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  Power
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [isAvailable, setIsAvailable] = useState(true);

  const stats = [
    { label: "Today's Appointments", value: '8', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Requests', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: "Today's Earnings", value: '₹ 4,500', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Emergency Alerts', value: '1', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  const todayAppointments = [
    { id: 1, patientName: 'Rahul Sharma', time: '10:00 AM', type: 'Clinic Visit', status: 'Completed' },
    { id: 2, patientName: 'Neha Gupta', time: '11:30 AM', type: 'Virtual Consult', status: 'In Progress' },
    { id: 3, patientName: 'Amit Verma', time: '02:00 PM', type: 'Clinic Visit', status: 'Upcoming' },
    { id: 4, patientName: 'Suresh Patil', time: '04:15 PM', type: 'Home Visit', status: 'Upcoming' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dr. {user?.name || 'Doctor'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here is your practice overview for today.</p>
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Current Status</span>
            <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isAvailable ? 'Available for Walk-ins & Emergencies' : 'Offline / Do Not Disturb'}
            </span>
          </div>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`ml-4 h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
              isAvailable 
                ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Power className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
            <button className="text-sm font-bold text-teal-600 hover:text-teal-700">Manage Calendar</button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-sm font-bold text-slate-500">Patient</th>
                    <th className="p-4 text-sm font-bold text-slate-500">Time</th>
                    <th className="p-4 text-sm font-bold text-slate-500">Type</th>
                    <th className="p-4 text-sm font-bold text-slate-500">Status</th>
                    <th className="p-4 text-sm font-bold text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{apt.patientName}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-600">{apt.time}</td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                          {apt.type === 'Virtual Consult' ? <Activity className="h-4 w-4 text-indigo-500" /> : <Stethoscope className="h-4 w-4 text-teal-500" />}
                          {apt.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          apt.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                          apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-sm font-bold text-teal-600 hover:text-teal-700">Open <ChevronRight className="h-4 w-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Emergency & Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 shadow-lg shadow-rose-500/20 text-white relative overflow-hidden">
            <AlertTriangle className="absolute -bottom-6 -right-6 h-32 w-32 text-white opacity-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Emergency Request</h3>
              </div>
              <h4 className="text-xl font-extrabold mb-1">Cardiac Arrest Suspected</h4>
              <p className="text-rose-100 font-medium text-sm mb-4">Location: 2.4 km away (Andheri East)</p>
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-white text-rose-600 font-bold py-2.5 rounded-xl hover:bg-rose-50 transition-colors">Accept</button>
                <button className="flex-1 bg-rose-700 text-white font-bold py-2.5 rounded-xl hover:bg-rose-800 transition-colors">Decline</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold transition-colors">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Mark Leaves</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold transition-colors">
                <span className="flex items-center gap-2"><IndianRupee className="h-5 w-5" /> Withdraw Earnings</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
