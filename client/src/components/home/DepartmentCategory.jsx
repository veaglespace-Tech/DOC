'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartPulse, Stethoscope, Microscope, Brain, Bone, Eye } from 'lucide-react';

const departments = [
  { name: 'Dentistry', icon: <Stethoscope className="h-6 w-6" /> },
  { name: 'Cardiology', icon: <HeartPulse className="h-6 w-6" /> },
  { name: 'ENT Specialists', icon: <Microscope className="h-6 w-6" /> },
  { name: 'Neurology', icon: <Brain className="h-6 w-6" /> },
  { name: 'Orthopedics', icon: <Bone className="h-6 w-6" /> },
  { name: 'Ophthalmology', icon: <Eye className="h-6 w-6" /> },
];

export default function DepartmentCategory() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Department Category</h2>
          <p className="text-slate-500">Find the right department for your medical needs with expert care.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {departments.map((dept, index) => {
            const slug = dept.name.toLowerCase().replace(/ /g, '-');
            return (
              <Link href={`/services/${slug}`} key={index}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center justify-center gap-4 group cursor-pointer"
                >
                  <div className="h-24 w-24 rounded-full border border-slate-100 shadow-md flex items-center justify-center bg-white group-hover:shadow-xl group-hover:border-slate-200 transition-all text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-50 group-hover:-translate-y-1">
                    {dept.icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{dept.name}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
