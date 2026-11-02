'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Video, 
  Home, 
  Activity, 
  ShieldCheck, 
  FlaskConical, 
  FileCheck, 
  Sparkles 
} from 'lucide-react';

const HIGHLIGHTS = [
  {
    title: 'MCI & NMC Verified Doctors',
    tag: '500+ Specialists',
    icon: Stethoscope,
    gradient: 'from-emerald-500 to-teal-500',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
  },
  {
    title: '15-Min Instant Video Consult',
    tag: 'Encrypted HD',
    icon: Video,
    gradient: 'from-indigo-500 to-purple-500',
    badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
  },
  {
    title: 'Specialist Doorstep Visits',
    tag: 'At-Home Diagnostics',
    icon: Home,
    gradient: 'from-teal-400 to-cyan-500',
    badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300'
  },
  {
    title: '24/7 Priority Emergency Triage',
    tag: '< 15 Min Response',
    icon: Activity,
    gradient: 'from-rose-500 to-red-500',
    badge: 'bg-rose-500/10 border-rose-500/30 text-rose-300'
  },
  {
    title: 'ABDM & HIPAA Health Vault',
    tag: '256-Bit SSL',
    icon: ShieldCheck,
    gradient: 'from-purple-500 to-indigo-500',
    badge: 'bg-purple-500/10 border-purple-500/30 text-purple-300'
  },
  {
    title: 'NABL Certified Home Labs',
    tag: '24h Reports',
    icon: FlaskConical,
    gradient: 'from-amber-400 to-orange-500',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-300'
  },
  {
    title: 'Tamper-Proof Digital Rx',
    tag: 'QR Verified',
    icon: FileCheck,
    gradient: 'from-sky-400 to-blue-500',
    badge: 'bg-sky-500/10 border-sky-500/30 text-sky-300'
  },
  {
    title: '24/7 AI Health Symptom Checker',
    tag: 'Instant Free Triage',
    icon: Sparkles,
    gradient: 'from-fuchsia-500 to-pink-500',
    badge: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300'
  }
];

export default function Marquee() {
  // Duplicate array 2 times so moving from 0% to -50% loops seamlessly
  const marqueeItems = [...HIGHLIGHTS, ...HIGHLIGHTS];

  return (
    <div className="relative w-full bg-slate-950 py-3.5 sm:py-4.5 overflow-hidden border-y border-slate-800/90 shadow-inner select-none">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))] pointer-events-none" />

      {/* Smooth Edge Fade Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-10" />

      {/* Moving Track */}
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 32
        }}
        className="flex shrink-0 items-center gap-4 sm:gap-6 px-4"
      >
        {marqueeItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={idx}>
              <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group/pill cursor-default shrink-0">
                {/* Glowing Icon Square */}
                <div className={`h-6 w-6 sm:h-7 sm:w-7 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-xs shrink-0 group-hover/pill:scale-110 transition-transform duration-300`}>
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>

                {/* Title & Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-200 tracking-tight whitespace-nowrap group-hover/pill:text-white transition-colors">
                    {item.title}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${item.badge}`}>
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Glowing Pulse Dot Divider */}
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/70 shadow-[0_0_8px_rgba(99,102,241,0.9)] shrink-0" />
            </React.Fragment>
          );
        })}
      </motion.div>
    </div>
  );
}
