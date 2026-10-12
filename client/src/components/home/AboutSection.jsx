'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HeartPulse, Stethoscope, Microscope, Activity } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-slate-600 text-white relative overflow-hidden">
      
      {/* Image anchored to the absolute right of the screen */}
      <div className="hidden lg:block absolute right-0 top-12 bottom-12 w-[calc(50vw-36rem)] xl:w-[calc(50vw-38rem)] 2xl:w-[calc(50vw-36rem)] min-w-[200px] rounded-l-3xl overflow-hidden shadow-2xl z-10 border-4 border-r-0 border-slate-500">
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
            <h4 className="text-slate-300 text-sm font-bold tracking-wider uppercase mb-4">Our Services</h4>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              World-Class Healthcare Services for you and your loved ones
            </h2>
            <p className="text-slate-200 mb-8 leading-relaxed">
              Experience unparalleled medical expertise with our comprehensive healthcare solutions, designed to prioritize your well-being at every step.
            </p>
            <button className="bg-white text-slate-800 px-6 py-3 rounded-full font-semibold hover:bg-slate-100 transition-colors shadow-sm">
              View All Services
            </button>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              
              {[
                { title: 'Cardiology Clinic', icon: <HeartPulse className="h-6 w-6 text-rose-500" />, desc: 'Advanced heart care with state-of-the-art diagnostic and treatment facilities.' },
                { title: 'Emergency Room', icon: <Activity className="h-6 w-6 text-red-500" />, desc: '24/7 emergency medical services with immediate response and care.' },
                { title: 'Eye Consultation', icon: <Microscope className="h-6 w-6 text-sky-500" />, desc: 'Comprehensive eye exams and treatments by expert ophthalmologists.' },
                { title: 'Pediatrics', icon: <Stethoscope className="h-6 w-6 text-teal-500" />, desc: 'Specialized healthcare for infants, children, and adolescents.' }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-8 text-slate-800 shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
