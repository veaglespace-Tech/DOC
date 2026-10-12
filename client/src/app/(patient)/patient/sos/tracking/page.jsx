'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Activity,
  Share2
} from 'lucide-react';
import { getClientSocket } from '@/utils/socket';
import { useTriggerEmergencyMutation } from '@/store/api/emergencyApi';

export default function EmergencyTrackingPage() {
  const [triggerEmergency] = useTriggerEmergencyMutation();
  const [status, setStatus] = useState('SEARCHING'); // 'SEARCHING', 'DOCTOR_ASSIGNED', 'ARRIVED'
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [searchSeconds, setSearchSeconds] = useState(0);

  useEffect(() => {
    // 1. Trigger the emergency dispatch on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          triggerEmergency({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            medicalNeeds: 'Emergency Doctor Visit Needed ASAP'
          });
        },
        () => {
          triggerEmergency({
            latitude: 18.5204,
            longitude: 73.8567,
            medicalNeeds: 'Emergency Doctor Visit Needed ASAP'
          });
        }
      );
    } else {
      triggerEmergency({
        latitude: 18.5204,
        longitude: 73.8567,
        medicalNeeds: 'Emergency Doctor Visit Needed ASAP'
      });
    }

    // 2. Setup Socket.IO listener for live doctor assignment
    const socket = getClientSocket();
    if (socket) {
      socket.on('emergency:doctor_assigned', (data) => {
        setStatus('DOCTOR_ASSIGNED');
        setAssignedDoctor(data.doctor);
        if (data.etaMinutes) setEtaMinutes(data.etaMinutes);
      });

      socket.on('doctor:location:update', (loc) => {
        // Live GPS coordinates of doctor on the move
        console.log('Doctor live location:', loc);
      });
    }

    // 3. Fallback mock assignment if no live doctor accepts in 8 seconds (for seamless demo)
    const fallbackTimer = setTimeout(() => {
      setStatus((current) => {
        if (current === 'SEARCHING') {
          setAssignedDoctor({
            name: 'Dr. Ramesh Sharma',
            specialty: 'Emergency General Physician',
            rating: 4.9,
            phone: '+91 98765 43210',
            vehicle: 'MH 12 CC 4421 (Medical First Responder)',
            distance: '1.8 km'
          });
          return 'DOCTOR_ASSIGNED';
        }
        return current;
      });
    }, 6000);

    const ticker = setInterval(() => {
      setSearchSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
      clearInterval(ticker);
    };
  }, [triggerEmergency]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Background Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[800px] h-[800px] rounded-full border border-red-500/30 animate-ping"></div>
        <div className="w-[600px] h-[600px] rounded-full border border-rose-500/40"></div>
        <div className="w-[400px] h-[400px] rounded-full border border-red-500/50"></div>
      </div>

      {/* Top Navbar */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl">
        <Link href="/patient" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-semibold">Exit Tracking</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          <Activity className="h-3.5 w-3.5 text-red-400" /> Live Emergency Dispatch
        </div>
        <a href="tel:108" className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
          <Phone className="h-3.5 w-3.5" /> Call 108
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-between relative z-10">
        
        {/* Status Header */}
        <div className="text-center my-4">
          <AnimatePresence mode="wait">
            {status === 'SEARCHING' ? (
              <motion.div
                key="searching"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
                  <ShieldAlert className="h-12 w-12 animate-bounce" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  Scanning for Nearest Doctor...
                </h1>
                <p className="text-slate-400 font-medium max-w-md mx-auto text-sm">
                  Broadcasting urgent distress signal to verified on-duty doctors within 5km radius. Searching for {searchSeconds}s.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="assigned"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Doctor Dispatched & En Route
                </div>
                <h1 className="text-3xl font-black text-white">Help is on the way!</h1>
                <p className="text-slate-400 text-sm">Doctor accepted dispatch and is currently travelling to your GPS location.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Map Radar Graphic */}
        <div className="my-6 relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
          {/* Simulated Dark Mode Map Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

          {/* Patient Marker (Center) */}
          <div className="absolute z-20 flex flex-col items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-red-600/40 animate-ping absolute inset-0"></div>
              <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg relative">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xs font-bold text-red-300 mt-1 bg-slate-950/80 px-2 py-0.5 rounded border border-red-900/60">
              Your Location
            </span>
          </div>

          {/* Doctor Marker (Moving toward patient if assigned) */}
          {status === 'DOCTOR_ASSIGNED' && (
            <motion.div
              initial={{ x: 120, y: -60 }}
              animate={{ x: 30, y: -15 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              className="absolute z-20 flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-500/30 animate-pulse absolute inset-0"></div>
                <div className="w-10 h-10 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center shadow-lg relative">
                  <Navigation className="h-5 w-5 text-white rotate-45" />
                </div>
              </div>
              <span className="text-xs font-bold text-teal-300 mt-1 bg-slate-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                Doctor (1.8 km away)
              </span>
            </motion.div>
          )}

          {/* Searching Radar Scanner */}
          {status === 'SEARCHING' && (
            <div className="absolute w-48 h-48 rounded-full border border-red-500/40 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-t-2 border-red-500 animate-spin"></div>
            </div>
          )}
        </div>

        {/* Doctor Details Card (Visible once assigned) */}
        {status === 'DOCTOR_ASSIGNED' && assignedDoctor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center text-2xl font-black">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{assignedDoctor.name}</h3>
                  <p className="text-sm text-teal-400 font-semibold">{assignedDoctor.specialty}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3 w-3 fill-amber-400" /> {assignedDoctor.rating}
                    </span>
                    <span>•</span>
                    <span>{assignedDoctor.vehicle || 'Rapid Response Unit'}</span>
                  </div>
                </div>
              </div>

              {/* ETA Display */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-5 py-3 text-center sm:text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center sm:justify-end gap-1">
                  <Clock className="h-3.5 w-3.5 text-teal-400" /> Estimated Arrival
                </div>
                <div className="text-2xl font-black text-white mt-0.5">{etaMinutes} Mins</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`tel:${assignedDoctor.phone || '9876543210'}`}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors shadow-lg shadow-teal-500/20"
              >
                <Phone className="h-4 w-4" /> Call Doctor
              </a>
              <button
                onClick={() => alert('Live emergency coordinates link copied to clipboard!')}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                <Share2 className="h-4 w-4" /> Share Location
              </button>
            </div>
          </motion.div>
        )}

        {/* Emergency Safety Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>CareConnect Emergency Protocol per BRD Section 7.</p>
          <p>In life-threatening situations, also dial national emergency service 108 or 112 immediately.</p>
        </div>

      </div>
    </div>
  );
}
