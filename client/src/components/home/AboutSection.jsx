'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HeartPulse, Stethoscope, Microscope, Activity } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      
      {/* Image anchored to the absolute right of the screen */}
      <div className="hidden lg:block absolute right-0 top-12 bottom-12 w-[calc(50vw-36rem)] xl:w-[calc(50vw-38rem)] 2xl:w-[calc(50vw-36rem)] min-w-[200px] rounded-l-3xl overflow-hidden shadow-2xl z-10 border-4 border-r-0 border-indigo-900/40">
        <Image 
          src="/luxurious_clinic_interior.jpg" 
          alt="Hospital Facility" 
          fill 
          sizes="20vw"
          className="object-cover" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Comprehensive Care
            </div>
            <h2 className="text-4xl font-black leading-tight mb-6 tracking-tight text-white">
              World-Class Healthcare Services for you & your loved ones
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed font-medium">
              Experience medical precision with our verified specialist ecosystem, designed to prioritize rapid response, accurate diagnosis, and seamless digital continuity.
            </p>
            <a 
              href="/#specialist"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-7 py-3.5 rounded-full font-bold hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-white/10 text-sm"
            >
              Explore Specialists
            </a>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              
              {[
                { title: 'Cardiology Clinic', icon: <HeartPulse className="h-6 w-6 text-rose-500" />, desc: 'Advanced heart care with state-of-the-art diagnostic and treatment facilities.' },
                { title: 'Emergency Room', icon: <Activity className="h-6 w-6 text-red-500" />, desc: '24/7 emergency medical services with immediate 5km GPS response and care.' },
                { title: 'Eye Consultation', icon: <Microscope className="h-6 w-6 text-sky-500" />, desc: 'Comprehensive eye exams and treatments by expert ophthalmologists.' },
                { title: 'Pediatrics', icon: <Stethoscope className="h-6 w-6 text-teal-500" />, desc: 'Specialized healthcare for infants, children, and adolescents.' }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-slate-800 shadow-2xl border border-white/20 hover:-translate-y-1.5 transition-all"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-xs">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-black mb-3 text-slate-900">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{service.desc}</p>
                </motion.div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
