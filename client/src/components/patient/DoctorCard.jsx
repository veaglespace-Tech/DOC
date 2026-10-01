'use client';

import React from 'react';
import { ShieldCheck, Star, MapPin, Clock, IndianRupee, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorCard({ doctor }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 transition-all duration-300"
    >
      {/* Decorative gradient corner */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-teal-100 to-sky-50 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="p-8 relative z-10">
        <div className="flex gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.2rem] border-2 border-white shadow-md">
            {/* Standard img tag used as fallback for fast dev; normally use next/image */}
            <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
            {doctor.verificationStatus === 'Verified' && (
              <div className="absolute -bottom-1 -right-1 rounded-lg border-2 border-white bg-gradient-to-r from-teal-500 to-emerald-500 p-1 shadow-sm">
                <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 pt-1">
            <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">{doctor.name}</h3>
            <p className="font-bold text-sky-600 mb-2">{doctor.specialty}</p>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50 inline-flex px-3 py-1 rounded-lg">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> <span className="text-slate-700 font-bold">{doctor.rating}</span> ({doctor.reviews})</span>
              <span className="text-slate-300">•</span>
              <span>{doctor.experience}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-4 rounded-[1.5rem] bg-slate-50/80 p-5 text-sm font-medium border border-slate-100">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-slate-400"><MapPin className="h-4 w-4" /></div>
            <span className="font-bold">{doctor.distance} km</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-slate-400"><IndianRupee className="h-4 w-4" /></div>
            <span className="font-bold">₹{doctor.fees}</span>
          </div>
          <div className="col-span-2 flex items-center gap-3 text-slate-700 mt-1">
            <div className="bg-emerald-100/50 p-1.5 rounded-lg text-emerald-500"><Clock className="h-4 w-4" /></div>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">{doctor.availability}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:shadow-teal-500/50 hover:-translate-y-0.5">
            Book Visit
          </button>
          {doctor.isEmergencyAvailable && (
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-5 py-3.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700 shadow-sm" title="Request Emergency Dispatch">
              <PhoneCall className="h-5 w-5" />
              SOS
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
