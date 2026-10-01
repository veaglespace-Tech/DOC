'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, User, Stethoscope } from 'lucide-react';

const IMAGES = [
  '/luxurious_clinic_interior.jpg',
  '/professional_doctor_tablet.jpg',
  '/patient_app_interaction.jpg'
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="CareConnect Premium Healthcare"
        />
      </AnimatePresence>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent z-10"></div>

      <div className="relative z-20 mx-auto max-w-7xl px-6 w-full text-left">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/20 backdrop-blur-md px-5 py-2 text-sm font-bold text-teal-300 mb-6 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            India's #1 Premium Healthcare Network
          </div>
          
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[1.1] mb-6 drop-shadow-lg">
            Healthcare that comes to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">your doorstep.</span>
          </h1>
          
          <p className="max-w-2xl text-xl leading-8 text-slate-200 font-medium mb-10 drop-shadow-md">
            Experience world-class medical care from the comfort of your home. Instantly book top-rated specialists, arrange emergency dispatches, and consult via HD video.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-5 w-full sm:w-auto">
            <Link href="/patient" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-teal-500 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-teal-500/30 transition-all hover:bg-teal-400 hover:shadow-2xl hover:-translate-y-1">
              <User className="h-5 w-5" /> Patient Portal
            </Link>
            <Link href="/doctor" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 text-lg font-bold text-white shadow-md transition-all hover:bg-white/20 hover:-translate-y-1 hover:shadow-lg">
              <Stethoscope className="h-5 w-5" /> I am a Doctor
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {IMAGES.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-teal-400' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
