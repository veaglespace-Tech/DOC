'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HeartPulse, Stethoscope, Microscope, Activity, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const clinicalHighlights = [
  { 
    title: 'Advanced Cardiology', 
    icon: HeartPulse, 
    desc: 'State-of-the-art heart screening, ECG reviews, and emergency cardiac interventions.',
    accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-400/60'
  },
  { 
    title: 'Emergency Medical Triage', 
    icon: Activity, 
    desc: '24/7 rapid medical assistance with GPS doctor dispatch and critical care monitoring.',
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-400/60'
  },
  { 
    title: 'Diagnostic Ophthalmology', 
    icon: Microscope, 
    desc: 'High-precision eye evaluations and telemedicine consultations by expert ophthalmologists.',
    accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:border-sky-400/60'
  },
  { 
    title: 'Pediatric & Family Care', 
    icon: Stethoscope, 
    desc: 'Specialized healthcare, immunization tracking, and developmental care for infants & youth.',
    accent: 'text-teal-400 bg-teal-500/10 border-teal-500/20 group-hover:border-teal-400/60'
  }
];

export default function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      {/* Background Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              World-Class Clinical Standards
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] mb-5 tracking-tight text-white">
              Precision Healthcare Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                You and Your Family
              </span>
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base mb-7 leading-relaxed font-medium">
              Doctor On Call combines certified medical specialists, rapid bedside home consultations, and encrypted health records into one cohesive, patient-first ecosystem.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Verified State & Medical Council credentials',
                'HIPAA & ABDM compliant 256-bit data encryption',
                'Seamless continuity between video, clinic & home visits'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link 
              href="/#specialist"
              className="inline-flex items-center gap-2.5 bg-white text-slate-900 px-7 py-3.5 rounded-2xl font-black hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-white/10 text-xs sm:text-sm group"
            >
              <span>Explore Certified Specialists</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {clinicalHighlights.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-slate-800 hover:border-slate-700 hover:-translate-y-1.5 transition-all group"
                  >
                    <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs ${service.accent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <h3 className="text-lg font-black mb-2 text-white group-hover:text-indigo-300 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                      {service.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white">99.8%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Diagnostic Accuracy</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 15 min</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Avg Video Connection</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Verified Medical Licenses</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400">24/7</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Specialist Availability</p>
          </div>
        </div>

      </div>
    </section>
  );
}
