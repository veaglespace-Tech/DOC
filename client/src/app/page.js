'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Stethoscope, 
  HeartPulse, 
  Building2, 
  ArrowRight,
  User,
  CheckCircle,
  Star
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import Marquee from '@/components/home/Marquee';
import DepartmentCategory from '@/components/home/DepartmentCategory';
import AboutSection from '@/components/home/AboutSection';
import ServicesSlider from '@/components/home/ServicesSlider';
import AwardsSection from '@/components/home/AwardsSection';
import Testimonials from '@/components/home/Testimonials';

// Framer Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen font-sans text-slate-900 bg-white selection:bg-slate-800 selection:text-white">
      <Navbar />

      <HeroSlider />
      
      <Marquee />

      <div id="specialist">
        <DepartmentCategory />
      </div>

      <div id="about">
        <AboutSection />
      </div>

      <div id="services">
        <ServicesSlider />
      </div>

      <AwardsSection />
      <Testimonials />

      {/* 🌟 PATIENT APP */}
      <section id="app" className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 1 }}
              className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-xl"
            >
              <Image src="/images/patient-app.jpg" alt="Patient App" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-2xl shadow-xl">
                <p className="text-slate-800 font-bold text-lg">"The easiest booking experience ever."</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest mb-8 shadow-sm">
                <User className="h-4 w-4 text-slate-800" /> Patient Experience
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6 leading-tight">
                Your health in the <span className="text-slate-500">palm of your hand.</span>
              </motion.h3>
              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-10 leading-relaxed">
                The ViolaCare patient ecosystem is built on a robust architecture. Effortlessly manage your Electronic Health Records (EHR), track live emergency ambulances via GPS, and consult with top specialists.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {['Family Member Profiles', 'Instant UPI Payments', 'Encrypted Records', 'WhatsApp Reminders'].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-slate-800" />
                    </div>
                    <span className="text-slate-700 font-semibold text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp}>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-800 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-slate-700">
                  Explore Patient Portal <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 🌟 DOCTOR PORTAL */}
      <section className="py-24 bg-white relative overflow-hidden text-slate-900">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 1 }}
              className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-xl"
            >
              <Image src="/images/doctor-tablet.jpg" alt="Doctor Portal" fill sizes="(max-width: 768px) 100vw, 50vw" priority={true} className="object-cover" />
              <div className="absolute top-8 right-8 z-20 bg-white/95 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5 text-slate-800" />
                </div>
                <div>
                  <p className="text-slate-600 text-xs font-semibold uppercase">Earnings Updated</p>
                  <p className="text-slate-900 font-bold">+$4,250.00 Today</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest mb-8">
                <Stethoscope className="h-4 w-4" /> Doctor Empowered
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6 leading-tight">
                Practice management, <span className="text-slate-500">elevated.</span>
              </motion.h3>
              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-10 leading-relaxed">
                Designed specifically for modern healthcare professionals. Optimize your clinic operations with smart scheduling, track granular revenue streams, and issue e-prescriptions seamlessly.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {['Digital Prescription', 'Smart Vacation Blocks', 'Real-time Payouts', 'Emergency Handovers'].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 bg-slate-50 border border-slate-100 shadow-sm rounded-2xl p-4">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200">
                      <CheckCircle className="h-4 w-4 text-slate-800" />
                    </div>
                    <span className="text-slate-700 font-semibold text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp}>
                <Link href="/register?role=DOCTOR" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-800 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-slate-700">
                  Join as a Doctor <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      <section className="pb-24 pt-12 bg-white relative z-20">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/20"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-teal-500/30 to-sky-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 mb-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">Scale your Hospital <span className="text-teal-400">instantly.</span></h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Get the ViolaCare Enterprise Suite. Multi-doctor management, custom branding, and automated GST compliance.
              </p>
              <Link href="/register/clinic" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 shadow-xl shadow-white/10">
                Register your Clinic <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
