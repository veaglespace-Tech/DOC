'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Award, Heart, Shield } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Images */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative h-[600px] w-full rounded-[3rem] p-4 bg-gradient-to-tr from-teal-50 to-sky-50"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image 
                src="/luxurious_clinic_interior.jpg" 
                alt="Hospital Facility" 
                fill 
                className="object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
            
            {/* Floating Experience Badge */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-xl shadow-teal-500/20 border border-teal-50 flex items-center gap-4 z-20"
            >
              <div className="bg-teal-100 text-teal-600 p-4 rounded-2xl">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">25+</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Years of Trust</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-600 mb-6">
              <Heart className="h-4 w-4" /> About CareConnect
            </motion.div>
            
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-[1.2]">
              Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-500">Medical Excellence.</span>
            </motion.h2>
            
            <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              We are a premier chain of multispecialty healthcare centers dedicated to delivering world-class medical care with compassion. Our state-of-the-art facilities and top-tier professionals ensure you receive the best treatment.
            </motion.p>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                { title: "Advanced Technology", icon: <Shield className="h-5 w-5 text-emerald-500" /> },
                { title: "Expert Doctors", icon: <Shield className="h-5 w-5 text-sky-500" /> },
                { title: "24/7 Emergency", icon: <Shield className="h-5 w-5 text-rose-500" /> },
                { title: "Patient-Centric Care", icon: <Shield className="h-5 w-5 text-violet-500" /> }
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="font-bold text-slate-800">{item.title}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button variants={fadeUp} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-teal-500/30">
              Discover Our Journey
            </motion.button>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
