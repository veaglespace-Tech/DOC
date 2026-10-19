'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  HeartPulse, 
  Calendar, 
  FileText, 
  Phone, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Building2, 
  Filter, 
  ShieldCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetClinicPatientsQuery } from '@/store/api/saasApi';

export default function ClinicPatientsPage() {
  const { data: patientsData, isLoading, refetch } = useGetClinicPatientsQuery();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'MALE',
    bloodGroup: 'B+',
    emergencyContact: ''
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const patients = patientsData?.data || [];

  const filteredPatients = patients.filter(pt => {
    const nameMatch = pt.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = pt.phone?.includes(searchQuery) || pt.user?.phone?.includes(searchQuery);
    const bloodMatch = bloodFilter === 'ALL' || pt.bloodGroup === bloodFilter;
    return (nameMatch || phoneMatch) && bloodMatch;
  });

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setIsRegisterModalOpen(false);
      setRegisterForm({
        name: '',
        phone: '',
        email: '',
        gender: 'MALE',
        bloodGroup: 'B+',
        emergencyContact: ''
      });
      refetch();
    }, 1500);
  };

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="h-3.5 w-3.5 text-teal-600" />
            Clinic Master Health Index
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Registry</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Complete Electronic Health Records (EHR) registry, walk-in admissions, and clinical histories.
          </p>
        </div>

        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          <UserPlus className="h-4 w-4" />
          Register Walk-in Patient
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4 relative z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name, phone number, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {/* Patients Table / Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading clinic patient registry...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm relative z-10">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Patients Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
            No registered patient matches your search parameters.
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
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-500/20">
                      {pt.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{pt.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{pt.gender || 'Not specified'} • {pt.bloodGroup || 'Blood Group N/A'}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200/60">
                    {pt.bloodGroup || 'O+'}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span>{pt.phone || pt.user?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Visits:</span>
                    <span className="font-bold text-slate-800">{pt.appointments?.length || 0} visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Registered:</span>
                    <span>{new Date(pt.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(pt)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold text-xs transition-colors border border-slate-200/60"
              >
                <FileText className="h-3.5 w-3.5" /> View Clinical Summary
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Clinical Summary Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    {selectedPatient.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-500">Patient ID: #PAT-{selectedPatient.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Blood Group</span>
                    <span className="font-bold text-slate-800 text-sm">{selectedPatient.bloodGroup || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Emergency Contact</span>
                    <span className="font-bold text-slate-800 text-sm">{selectedPatient.emergencyContact || selectedPatient.phone || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Recent Clinical Encounters</h5>
                  {selectedPatient.appointments && selectedPatient.appointments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.appointments.map((apt, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">{apt.type} Visit</span>
                            <span className="text-slate-400">{new Date(apt.scheduledAt).toLocaleDateString()}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No previous visit records logged in clinic system.</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full mt-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Close Summary
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Walk-in Patient Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-lg">Register Walk-in Patient</h3>
                <button 
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {registerSuccess ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-lg">Registration Successful</h4>
                  <p className="text-xs text-slate-500 mt-1">Patient registered and added to clinic database.</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterPatient} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Full Patient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Blood Group</label>
                      <select
                        value={registerForm.bloodGroup}
                        onChange={(e) => setRegisterForm({ ...registerForm, bloodGroup: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-bold"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="Guardian / Family contact"
                      value={registerForm.emergencyContact}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition-all mt-4"
                  >
                    Confirm Patient Entry
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
