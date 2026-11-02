'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Sparkles, Calendar, Stethoscope } from 'lucide-react';

export default function HeroSlider() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const popularSpecialties = ['Cardiology', 'Pediatrics', 'Dermatology', 'Neurology', 'Orthopedics'];

  return (
    <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-14 sm:pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Dynamic Background Glows & Mesh Gradients */}
      <div className="absolute top-10 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-br from-indigo-500/15 to-purple-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"></div>
      <div className="absolute top-32 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-br from-teal-500/15 to-sky-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 text-indigo-700 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold mb-4 sm:mb-6 shadow-xs">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-600" />
            <span>Next-Gen Unified Healthcare Network</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-6 tracking-tight">
            Healthcare on Demand,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
              Whenever You Need It.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 max-w-lg leading-relaxed font-medium">
            Book certified specialists, order rapid home consultations, or connect via high-definition video in minutes.
          </p>
          
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-5 sm:mb-6">
            <Link 
              href="/search" 
              className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-black transition-all shadow-lg sm:shadow-xl shadow-indigo-600/25 text-center flex items-center justify-center gap-2 group text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="h-4 w-4 text-white" />
              <span>Book Appointment</span>
            </Link>
            
            <form onSubmit={handleSearch} className="relative flex-1 flex items-center">
              <input 
                type="text" 
                placeholder="Search specialty, doctor or clinic..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-2xl py-3.5 sm:py-4 pl-4 sm:pl-5 pr-11 sm:pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm shadow-xs transition-all font-medium text-slate-800 placeholder-slate-400"
              />
              <button 
                type="submit" 
                className="absolute right-2 h-8 w-8 sm:h-10 sm:w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </form>
          </div>

          {/* Quick Specialty Filter Tags */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Trending:</span>
            {popularSpecialties.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => router.push(`/search?specialty=${encodeURIComponent(spec)}`)}
                className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all text-slate-600 shadow-2xs"
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Metrics Counters (2x2 on mobile, 4 in a row on sm+) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 sm:divide-x divide-slate-100 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
            <div className="p-2 sm:px-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">4,500+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Patients</p>
            </div>
            <div className="p-2 sm:px-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">25+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Specialties</p>
            </div>
            <div className="p-2 sm:px-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">500+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Docs</p>
            </div>
            <div className="p-2 sm:px-3 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                &lt; 15 <span className="text-sm font-bold text-emerald-600">min</span>
              </p>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Avg Response</p>
            </div>
          </div>
        </motion.div>

        {/* Right Dynamic Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 relative mt-4 lg:mt-0"
        >
          {/* Main rounded frame */}
          <div className="relative aspect-[4/3] sm:aspect-[4/5] max-h-[340px] sm:max-h-[540px] w-full max-w-sm sm:max-w-md mx-auto rounded-3xl sm:rounded-[3rem] overflow-hidden bg-slate-900 shadow-xl sm:shadow-2xl border-4 border-white shadow-indigo-500/10">
            <Image 
              src="/professional_doctor_tablet.jpg" 
              alt="Doctor On Call Specialist" 
              fill
              priority
              className="object-cover"
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

            {/* Bottom In-Image Live Status Pill */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black text-slate-900">MCI &amp; State Certified</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Digital Verification &amp; EHR Logged</p>
                </div>
              </div>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-black uppercase">
                Active Now
              </span>
            </div>
          </div>

          {/* Floating Top Badge - Home Consult (Visible on lg screens only to avoid mobile overlapping) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="hidden lg:flex absolute top-8 right-0 lg:-right-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl items-center gap-3.5 border border-slate-100"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">Doctor Home Visits</p>
              <p className="text-[11px] text-teal-600 font-bold">Top Verified Practitioners</p>
            </div>
          </motion.div>

          {/* Floating Left Badge - Verified Specialist (Visible on lg screens only to avoid mobile overlapping) */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:flex absolute bottom-28 left-0 lg:-left-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl items-center gap-3 border border-slate-100"
          >
            <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              Dr
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">Dr. Sarah Johnson, MD</p>
              <p className="text-[11px] text-indigo-600 font-semibold">Chief Cardiologist • 4.9 ★</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
