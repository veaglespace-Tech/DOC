import React from 'react';
import { Users, Calendar, TrendingUp, Activity, Plus, ArrowUpRight, DollarSign, Clock } from 'lucide-react';

export default function ClinicDashboardPage() {
  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinic Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Here is what's happening at Apollo Hospital today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 shadow-sm">
            Download Report
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5">
            <Plus className="h-5 w-5" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="h-3 w-3 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-1">42</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Doctors</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="h-3 w-3 mr-1" /> +5%
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-1">1,248</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Appointments (Month)</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="h-3 w-3 mr-1" /> +18%
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-1">₹4.2L</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <span className="flex items-center text-slate-600 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md">
              Pending
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-1">14</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Leave Requests</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-900">Patient Volume (This Week)</h2>
            <select className="bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="h-[300px] w-full flex items-end justify-between gap-2 md:gap-6 pt-4 border-b border-slate-100 pb-2">
            {[40, 70, 45, 90, 65, 85, 30].map((height, i) => (
              <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {height * 3}
                </div>
                <div 
                  className="w-full bg-blue-100 rounded-t-xl group-hover:bg-blue-200 transition-colors relative overflow-hidden" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-xl" style={{ height: '60%' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full mt-4 text-xs font-bold text-slate-400 uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Side Panel: Today's Schedule */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Activity className="h-64 w-64 -translate-y-10 translate-x-10" />
          </div>
          
          <h2 className="text-lg font-bold text-white mb-6 relative z-10">Today's Highlights</h2>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
              <div>
                <p className="font-bold">Dr. Sharma arrived</p>
                <p className="text-xs text-slate-400 mt-1">08:45 AM • Orthopedics</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-blue-400"></div>
              <div>
                <p className="font-bold">5 New Appointments</p>
                <p className="text-xs text-slate-400 mt-1">09:30 AM • Online Booking</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-amber-400"></div>
              <div>
                <p className="font-bold">Dr. Patel requested leave</p>
                <p className="text-xs text-slate-400 mt-1">Pending Approval • Cardiology</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"></div>
              <div>
                <p className="font-bold text-red-300">SOS Triggered - Room 102</p>
                <p className="text-xs text-slate-400 mt-1">Immediate action required</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-10 bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl text-sm font-bold transition-colors backdrop-blur-md relative z-10">
            View Complete Log
          </button>
        </div>

      </div>
    </div>
  );
}
