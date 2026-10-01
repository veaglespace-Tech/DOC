import React from 'react';
import { Users, Calendar, TrendingUp, Activity, Plus, ArrowUpRight, DollarSign, Clock, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClinicDashboardPage() {
  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Premium Background Blurs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Here is what's happening at your facility today.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-white text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200/40 hover:scale-105">
            Download Report
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-teal-500/30 hover:-translate-y-1">
            <Plus className="h-5 w-5" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
        
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600 flex items-center justify-center shadow-inner">
              <Users className="h-8 w-8" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-xl shadow-sm border border-emerald-100">
              <TrendingUp className="h-4 w-4 mr-1" /> +12%
            </span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 mb-1">42</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Doctors</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
              <Calendar className="h-8 w-8" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-xl shadow-sm border border-emerald-100">
              <TrendingUp className="h-4 w-4 mr-1" /> +5%
            </span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 mb-1">1,248</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Appointments (Month)</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <DollarSign className="h-8 w-8" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-xl shadow-sm border border-emerald-100">
              <TrendingUp className="h-4 w-4 mr-1" /> +18%
            </span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 mb-1">₹4.2L</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
              <Clock className="h-8 w-8" />
            </div>
            <span className="flex items-center text-slate-600 text-xs font-black uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-xl shadow-sm border border-slate-200">
              Pending
            </span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 mb-1">14</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Leave Requests</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-teal-500" /> Patient Volume
            </h2>
            <select className="bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 transition-shadow cursor-pointer">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="h-[300px] w-full flex items-end justify-between gap-4 md:gap-8 pt-4 border-b border-slate-100 pb-4">
            {[40, 70, 45, 90, 65, 85, 30].map((height, i) => (
              <div key={i} className="w-full relative group flex flex-col justify-end h-full cursor-pointer hover:scale-105 transition-transform origin-bottom">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {height * 3}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-sky-100 to-sky-50 rounded-t-xl group-hover:from-sky-200 group-hover:to-sky-100 transition-colors relative overflow-hidden" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-teal-500 to-sky-400 rounded-t-xl opacity-90 shadow-inner" style={{ height: '70%' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full mt-6 text-xs font-black text-slate-400 uppercase tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Side Panel: Today's Schedule */}
        <div className="bg-teal-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
            <Activity className="h-64 w-64 -translate-y-10 translate-x-10 text-teal-400" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-teal-950 to-transparent pointer-events-none"></div>
          
          <h2 className="text-2xl font-black text-white mb-8 relative z-10 flex items-center gap-2">
            <Clock className="h-6 w-6 text-teal-400" /> Today's Highlights
          </h2>
          
          <div className="space-y-8 relative z-10">
            <div className="flex items-start gap-5">
              <div className="mt-1 h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] border-2 border-teal-900"></div>
              <div>
                <p className="font-bold text-lg mb-1">Dr. Sharma arrived</p>
                <p className="text-sm text-teal-200/70 font-medium bg-white/5 inline-block px-2 py-1 rounded-lg">08:45 AM • Orthopedics</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="mt-1 h-4 w-4 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] border-2 border-teal-900"></div>
              <div>
                <p className="font-bold text-lg mb-1">5 New Appointments</p>
                <p className="text-sm text-teal-200/70 font-medium bg-white/5 inline-block px-2 py-1 rounded-lg">09:30 AM • Online Booking</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="mt-1 h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] border-2 border-teal-900 animate-pulse"></div>
              <div>
                <p className="font-bold text-lg mb-1">Dr. Patel requested leave</p>
                <p className="text-sm text-amber-200/90 font-medium bg-amber-400/10 inline-block px-2 py-1 rounded-lg">Pending Approval • Cardiology</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="mt-1 h-4 w-4 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.8)] border-2 border-teal-900 animate-ping"></div>
              <div>
                <p className="font-bold text-lg mb-1 text-rose-300">Emergency Case</p>
                <p className="text-sm text-rose-200/80 font-medium bg-rose-500/20 inline-block px-2 py-1 rounded-lg">Just now • Trauma Center</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 py-4 rounded-xl font-bold transition-colors relative z-10">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
