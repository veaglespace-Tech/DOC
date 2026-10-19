'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, PlayCircle, AlertTriangle, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

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

  return (
    <section className="relative pt-20 pb-16 bg-slate-50 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-32 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 pt-12">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            CareConnect Healthcare Platform
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] mb-6 tracking-tight">
            Healthcare on Demand, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Whenever You Need It.</span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
            Book verified specialists, order home visits, or dispatch an emergency doctor within a 5km radius in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Link href="/patient/sos" className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-red-600 text-white px-7 py-4 rounded-full font-bold hover:from-rose-700 hover:to-red-700 transition-all shadow-lg shadow-rose-600/30 text-center flex items-center justify-center gap-2 group">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              Emergency SOS (5km)
            </Link>
            
            <form onSubmit={handleSearch} className="w-full sm:w-auto relative flex items-center">
              <input 
                type="text" 
                placeholder="Search specialty, doctor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 bg-white border border-slate-200 rounded-full py-4 pl-6 pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-sm transition-all font-medium"
              />
              <button type="submit" className="absolute right-2 h-10 w-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 divide-x divide-slate-200">
            <div className="px-2">
              <p className="text-3xl font-extrabold text-slate-800">4500+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Patients</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-extrabold text-slate-800">20+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Specialties</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-extrabold text-slate-800">500+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Doctors</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-extrabold text-slate-800">25+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Awards</p>
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:w-1/2 relative"
        >
          {/* Main rounded container */}
          <div className="relative aspect-[4/5] max-h-[600px] w-full max-w-md mx-auto rounded-[3rem] overflow-hidden bg-slate-200 shadow-2xl">
            <Image 
              src="/professional_doctor_tablet.jpg" 
              alt="Doctor" 
              fill
              priority
              className="object-cover"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
              <button className="h-16 w-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/50">
                <PlayCircle className="h-8 w-8" />
              </button>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-12 right-0 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
          >
            <div className="h-10 w-10 bg-slate-100 rounded-full overflow-hidden relative">
              <Image src="/images/doctor-tablet.jpg" alt="Avatar" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Dr. Sarah Johnson</p>
              <p className="text-xs text-slate-500 font-medium">Chief Cardiologist</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
