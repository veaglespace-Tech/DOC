'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowRight,
  User,
  CheckCircle,
  Star,
  Stethoscope,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Globe2
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen font-sans text-slate-900 bg-white selection:bg-slate-900 selection:text-white">
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

      {/* 🌟 PATIENT APP EXPERIENCE */}
      <section id="app" className="py-20 lg:py-28 bg-slate-50/70 relative overflow-hidden border-y border-slate-200/80">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
              className="relative h-[360px] sm:h-[480px] lg:h-[580px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-indigo-500/10"
            >
              <Image 
                src="/images/patient-app.jpg" 
                alt="Patient App" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 z-20 bg-white/95 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 uppercase">
                    Verified Patient
                  </span>
                </div>
                <p className="text-slate-900 font-bold text-xs sm:text-sm">
                  "The fastest doctor booking and EHR records access I have ever used."
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Mrs. Kulkarni • Family Health Plan</p>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-20 text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-6 shadow-xs">
                <User className="h-3.5 w-3.5 text-indigo-600" /> Patient Experience
              </motion.div>
              
              <motion.h3 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
                Your health in the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                  palm of your hand.
                </span>
              </motion.h3>
              
              <motion.p variants={fadeUp} className="text-sm sm:text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                The Doctor On Call patient ecosystem gives you immediate medical autonomy. Manage lifetime Electronic Health Records (EHR), book verified doctors for home visits, and consult specialists 24/7.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-9">
                {[
                  { title: 'Family Member Profiles', desc: 'Manage dependents under one account' },
                  { title: 'Instant UPI & Card Pay', desc: 'Transparent platform fee ledger' },
                  { title: 'Encrypted Records (EHR)', desc: '256-bit lifelong cloud storage' },
                  { title: 'SMS & WhatsApp Alerts', desc: 'Real-time booking and Rx updates' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-4">
                    <div className="h-7 w-7 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-xs sm:text-sm">{item.title}</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5">
                <Link 
                  href="/patient" 
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:scale-105"
                >
                  <span>Explore Patient Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/search" 
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200/90 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-indigo-300"
                >
                  <span>Find Doctors &amp; Specialists</span>
                </Link>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 🌟 DOCTOR PRACTICE PORTAL */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden text-slate-900">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-20 text-left order-2 lg:order-1">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700 uppercase tracking-widest mb-6 shadow-xs">
                <Stethoscope className="h-3.5 w-3.5 text-purple-600" /> Doctor Empowered
              </motion.div>
              
              <motion.h3 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
                Practice management,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                  elevated.
                </span>
              </motion.h3>
              
              <motion.p variants={fadeUp} className="text-sm sm:text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Engineered specifically for certified medical practitioners. Optimize daily consultations, manage weekly slot availability, and issue legal MCI-compliant digital prescriptions.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-9">
                {[
                  { title: 'Digital Prescription (Rx)', desc: 'Tamper-proof PDF with QR code verification' },
                  { title: 'Weekly Availability Grid', desc: 'Recurring slots and vacation blockouts' },
                  { title: '24h Bank Payout Escrow', desc: '80% net physician earnings settlement' },
                  { title: 'Peer Shift Handovers', desc: 'SBAR clinical handover communication' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 shadow-2xs rounded-2xl p-4">
                    <div className="h-7 w-7 rounded-xl bg-purple-100/80 border border-purple-200/60 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-xs sm:text-sm">{item.title}</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp}>
                <Link 
                  href="/register/doctor" 
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-700 hover:scale-105"
                >
                  <span>Join as Verified Practitioner</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
              className="relative h-[360px] sm:h-[480px] lg:h-[580px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-purple-500/10 order-1 lg:order-2"
            >
              <Image 
                src="/images/doctor-tablet.jpg" 
                alt="Doctor Practice Portal" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority={true} 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

              {/* In-Image Earning Float Card */}
              <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20 bg-white/95 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Settlement Ledger</p>
                  <p className="text-slate-900 font-black text-sm sm:text-base">+₹4,250.00 Today</p>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 🌟 ENTERPRISE CLINIC & HOSPITAL SUITE */}
      <section className="py-20 lg:py-24 bg-white relative z-20">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp}
            className="bg-slate-900 rounded-3xl sm:rounded-[3rem] p-8 sm:p-14 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/30 border border-slate-800"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-teal-500/25 to-sky-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight text-white leading-tight">
                Scale Your Hospital &amp; Clinic{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">
                  Instantly.
                </span>
              </h2>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                Unlock the Doctor On Call Multi-Tenant Enterprise Suite. Centralized reception desk, multi-doctor roster quotas, and automated 18% GST invoicing.
              </p>

              {/* Enterprise Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 text-xs font-bold">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-200">
                  ✓ Multi-Doctor Roster Quotas
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-200">
                  ✓ Live Reception Desk Stream
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-200">
                  ✓ Automated 18% GST Ledgers
                </span>
              </div>

              <Link 
                href="/register/clinic" 
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-xs sm:text-sm font-black text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 shadow-xl shadow-white/10"
              >
                <span>Register Your Healthcare Facility</span>
                <ArrowRight className="h-4 w-4" />
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
