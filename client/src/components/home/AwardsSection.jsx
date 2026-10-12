'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Star } from 'lucide-react';

const awards = [
  {
    title: "NABH Accredited",
    desc: "Recognized for high standards in healthcare quality and patient safety.",
    icon: <ShieldCheck className="h-10 w-10 text-emerald-500" />,
    color: "bg-emerald-50",
    borderColor: "border-emerald-200",
    shadowColor: "shadow-emerald-200/60 hover:shadow-emerald-300/60",
    innerGlow: "shadow-[inset_0_0_30px_rgba(16,185,129,0.15)]"
  },
  {
    title: "JCI Gold Seal",
    desc: "Global gold standard for healthcare quality and safety.",
    icon: <Award className="h-10 w-10 text-yellow-500" />,
    color: "bg-yellow-50",
    borderColor: "border-yellow-200",
    shadowColor: "shadow-yellow-200/60 hover:shadow-yellow-300/60",
    innerGlow: "shadow-[inset_0_0_30px_rgba(234,179,8,0.15)]"
  },
  {
    title: "Best Multispecialty 2025",
    desc: "Awarded by Times Health Survey for clinical excellence.",
    icon: <Star className="h-10 w-10 text-sky-500" />,
    color: "bg-sky-50",
    borderColor: "border-sky-200",
    shadowColor: "shadow-sky-200/60 hover:shadow-sky-300/60",
    innerGlow: "shadow-[inset_0_0_30px_rgba(14,165,233,0.15)]"
  }
];

export default function AwardsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-slate-900 mb-4 sm:text-5xl"
          >
            Awards & <span className="text-slate-500">Accreditations</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 font-medium max-w-2xl mx-auto text-lg"
          >
            Our commitment to clinical excellence is recognized by premier national and international healthcare bodies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[2.5rem] border ${award.borderColor} ${award.color} flex flex-col items-center text-center shadow-xl ${award.shadowColor} ${award.innerGlow} transition-all duration-300 cursor-pointer relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white/30 pointer-events-none rounded-[2.5rem]"></div>
              <div className="mb-6 p-4 bg-white rounded-full shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300">
                {award.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 relative z-10">{award.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed relative z-10">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
