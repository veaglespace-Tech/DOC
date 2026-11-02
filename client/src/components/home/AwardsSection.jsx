'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Star, Sparkles, CheckCircle2 } from 'lucide-react';

const awards = [
  {
    title: "NABH Accredited Network",
    category: "Hospital & Clinic Standards",
    desc: "Formally recognized for stringent clinical safety protocols, patient rights, and diagnostic excellence.",
    icon: ShieldCheck,
    badge: "National Standard",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    iconBg: "bg-emerald-500 text-white shadow-md shadow-emerald-500/25",
    glow: "group-hover:border-emerald-400 group-hover:shadow-emerald-500/15"
  },
  {
    title: "JCI Gold Seal Alignment",
    category: "Global Clinical Governance",
    desc: "Adheres to international gold benchmarks for emergency response, clinical sanitation, and medication security.",
    icon: Award,
    badge: "International Seal",
    color: "bg-amber-50 text-amber-700 border-amber-200/80",
    iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/25",
    glow: "group-hover:border-amber-400 group-hover:shadow-amber-500/15"
  },
  {
    title: "Best Digital Healthcare 2025",
    category: "Excellence in Telemedicine",
    desc: "Honored by the National Healthcare Federation for rapid doctor dispatches and patient-centric digital vaults.",
    icon: Star,
    badge: "Industry Winner",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    iconBg: "bg-indigo-600 text-white shadow-md shadow-indigo-600/25",
    glow: "group-hover:border-indigo-400 group-hover:shadow-indigo-500/15"
  }
];

export default function AwardsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-xs text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Clinical Accreditations
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Recognized for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
              Uncompromising Quality
            </span>
          </h2>
          
          <p className="mt-4 text-sm sm:text-lg text-slate-600 font-medium leading-relaxed">
            Our commitment to patient safety, physician verification, and encrypted healthcare workflows is validated by leading regulatory bodies.
          </p>
        </div>

        {/* 3 Award Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {awards.map((award, idx) => {
            const Icon = award.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group h-full"
              >
                <div className={`h-full flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/70 hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${award.glow}`}>
                  
                  <div>
                    {/* Top Badge & Category */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${award.color}`}>
                        {award.badge}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {award.category}
                      </span>
                    </div>

                    {/* Icon Shield */}
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 ${award.iconBg}`}>
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {award.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                      {award.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Verified Audit Status: 2026</span>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
