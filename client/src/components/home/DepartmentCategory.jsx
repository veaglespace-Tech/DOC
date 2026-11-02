'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartPulse, Stethoscope, Microscope, Brain, Bone, Eye } from 'lucide-react';

const departments = [
  { name: 'Cardiology', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200/60 group-hover:bg-rose-600 group-hover:text-white' },
  { name: 'Dentistry', icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200/60 group-hover:bg-teal-600 group-hover:text-white' },
  { name: 'Neurology', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200/60 group-hover:bg-purple-600 group-hover:text-white' },
  { name: 'Orthopedics', icon: Bone, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60 group-hover:bg-amber-600 group-hover:text-white' },
  { name: 'ENT Specialist', icon: Microscope, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200/60 group-hover:bg-sky-600 group-hover:text-white' },
  { name: 'Ophthalmology', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200/60 group-hover:bg-indigo-600 group-hover:text-white' },
];

export default function DepartmentCategory() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50/50 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            Top Specialties
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Browse Certified Departments</h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1 max-w-lg mx-auto">Connect with verified medical specialists for clinic OPD or emergency home visits.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-6">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            const slug = dept.name.toLowerCase().replace(/ /g, '-');
            return (
              <Link href={`/search?specialty=${encodeURIComponent(dept.name)}`} key={index}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all group cursor-pointer"
                >
                  <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl border flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 shadow-xs ${dept.bg} ${dept.color}`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110" />
                  </div>
                  <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors text-center">{dept.name}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
