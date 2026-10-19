'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Calendar, 
  FileText, 
  HeartPulse, 
  ChevronRight, 
  Stethoscope, 
  Building2, 
  CheckCircle2, 
  Clock,
  Pill,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMyAppointmentsQuery } from '@/store/api/appointmentApi';
import Link from 'next/link';

export default function DoctorPatientsPage() {
  const { data: appointmentsResponse, isLoading } = useGetMyAppointmentsQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const appointments = appointmentsResponse?.data || [];

  // Deduplicate patients from appointments
  const patientsMap = new Map();
  appointments.forEach(apt => {
    if (apt.patient && !patientsMap.has(apt.patientId)) {
      patientsMap.set(apt.patientId, {
        id: apt.patientId,
        name: apt.patient.name,
        phone: apt.patient.phone || 'Phone on file',
        bloodGroup: apt.patient.bloodGroup || 'O+',
        lastVisit: apt.scheduledAt,
        totalVisits: 1,
        latestAppointmentId: apt.id
      });
    } else if (apt.patient) {
      const existing = patientsMap.get(apt.patientId);
      existing.totalVisits += 1;
    }
  });

  const patients = Array.from(patientsMap.values());

  const filteredPatients = patients.filter(pt =>
    pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.phone.includes(searchQuery)
  );

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="h-3.5 w-3.5 text-purple-600" />
            Clinical Practice Cohort
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Patient Roster</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Complete registry of patients who have consulted with you, their medical logs and encounter histories.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 relative z-10 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roster by patient name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading clinical patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm relative z-10">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Patients in Roster Yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
            Patients who book appointments or consultations with you will automatically be registered here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {filteredPatients.map((pt, i) => (
            <motion.div
              key={pt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-500/20">
                      {pt.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{pt.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">Patient #{pt.id}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200/60">
                    {pt.bloodGroup}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span>{pt.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Consults:</span>
                    <span className="font-bold text-slate-800">{pt.totalVisits} visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Consultation:</span>
                    <span>{new Date(pt.lastVisit).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <Link
                  href={`/doctor/prescription/${pt.latestAppointmentId}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" /> Prescriptions
                </Link>
                <Link
                  href={`/doctor/consultation/${pt.latestAppointmentId}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  <Activity className="h-3.5 w-3.5" /> Encounter
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
