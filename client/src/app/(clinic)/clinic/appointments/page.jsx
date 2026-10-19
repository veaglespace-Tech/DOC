'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Building2, 
  Stethoscope, 
  User, 
  Phone, 
  MapPin, 
  Activity,
  Layers,
  ChevronRight,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetClinicAppointmentsQuery } from '@/store/api/saasApi';
import { useUpdateAppointmentStatusMutation } from '@/store/api/appointmentApi';
import Link from 'next/link';

export default function ClinicAppointmentsPage() {
  const { data: appointmentsData, isLoading, refetch } = useGetClinicAppointmentsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const appointments = appointmentsData?.data || [];

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateStatus({
        id: appointmentId,
        status: newStatus
      }).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Status update failed');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const patientName = apt.patient?.name?.toLowerCase() || '';
    const doctorName = apt.doctor?.name?.toLowerCase() || '';
    const matchesSearch = patientName.includes(searchQuery.toLowerCase()) || 
                          doctorName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || apt.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const scheduledCount = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length;
  const inProgressCount = appointments.filter(a => a.status === 'IN_PROGRESS').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="h-3.5 w-3.5 text-blue-600" />
            Clinic Operations Hub
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Appointments & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Token Queue</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Real-time OPD patient stream, check-in verification, and doctor room allocations.
          </p>
        </div>

        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
        >
          <Activity className="h-4 w-4 text-blue-600" />
          Refresh Stream
        </button>
      </div>

      {/* Live Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{appointments.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Waiting / Scheduled</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{scheduledCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock3 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">In Consultation</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{inProgressCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Completed Visits</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{completedCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4 relative z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, doctor, or token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Visit Types</option>
            <option value="CLINIC_VISIT">In-Clinic OPD</option>
            <option value="HOME_VISIT">Home Visit</option>
            <option value="ONLINE">Teleconsult</option>
          </select>
        </div>
      </div>

      {/* Appointments List / Queue Cards */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Syncing clinic appointment stream...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm relative z-10">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Appointments Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
            There are no appointments matching your current search or status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {filteredAppointments.map((apt, index) => {
            const isCompleted = apt.status === 'COMPLETED';
            const isInProgress = apt.status === 'IN_PROGRESS';
            const isCancelled = apt.status === 'CANCELLED';

            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Token & Patient Info */}
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Token</span>
                    <span className="text-xl font-black leading-none">#{apt.tokenNumber || (index + 1)}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-slate-900">{apt.patient?.name || 'Walk-in Patient'}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                        isInProgress ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                        isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        isCancelled ? 'bg-rose-50 border-rose-200 text-rose-700' :
                        'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mt-1.5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(apt.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                        Dr. {apt.doctor?.name || 'Assigned Specialist'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px]">
                        {apt.type || 'IN-CLINIC'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  {apt.status !== 'IN_PROGRESS' && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'IN_PROGRESS')}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Activity className="h-3.5 w-3.5" /> Call In
                    </button>
                  )}

                  {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete Visit
                    </button>
                  )}

                  {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'CANCELLED')}
                      disabled={isUpdating}
                      className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {isCompleted && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl">
                      <CheckCircle2 className="h-4 w-4" /> Consultation Finalized
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
