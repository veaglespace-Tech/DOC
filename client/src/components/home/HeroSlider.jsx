'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, PlayCircle } from 'lucide-react';

export default function HeroSlider() {
  return (
    <section className="relative pt-20 pb-16 bg-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 pt-12">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="inline-block bg-white text-slate-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm border border-slate-100">
            Welcome to ViolaCare
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-800 leading-[1.15] mb-6">
            Premium Treatments for a <span className="text-slate-600">Healthy Lifestyle</span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Experience world-class medical care from the comfort of your home. Instantly book top-rated specialists, arrange emergency dispatches, and consult via HD video.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link href="/register" className="w-full sm:w-auto bg-slate-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-700 transition-colors shadow-md text-center">
              Book Appointment
            </Link>
            
            <div className="w-full sm:w-auto relative flex items-center">
              <input 
                type="text" 
                placeholder="Search doctors..." 
                className="w-full sm:w-64 bg-white border border-slate-200 rounded-full py-4 pl-6 pr-12 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-sm shadow-sm transition-all"
              />
              <button className="absolute right-2 h-10 w-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
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
