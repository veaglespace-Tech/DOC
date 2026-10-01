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
    borderColor: "border-emerald-100"
  },
  {
    title: "JCI Gold Seal",
    desc: "Global gold standard for healthcare quality and safety.",
    icon: <Award className="h-10 w-10 text-yellow-500" />,
    color: "bg-yellow-50",
    borderColor: "border-yellow-100"
  },
  {
    title: "Best Multispecialty 2025",
    desc: "Awarded by Times Health Survey for clinical excellence.",
    icon: <Star className="h-10 w-10 text-sky-500" />,
    color: "bg-sky-50",
    borderColor: "border-sky-100"
  }
];

export default function AwardsSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 mb-4"
          >
            Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Accreditations</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium max-w-2xl mx-auto"
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
              className={`p-10 rounded-[2.5rem] border ${award.borderColor} ${award.color} flex flex-col items-center text-center shadow-lg shadow-slate-200/50 cursor-pointer`}
            >
              <div className="mb-6 p-4 bg-white rounded-full shadow-sm">
                {award.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{award.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
