'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Stethoscope, 
  HeartPulse, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  User,
  CheckCircle,
  Star,
  MapPin,
  Video,
  FileText,
  Brain,
  Pill
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import Marquee from '@/components/home/Marquee';
import ServicesSlider from '@/components/home/ServicesSlider';
import AboutSection from '@/components/home/AboutSection';
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

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  hover: { y: -10, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax values
  const yStats = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacityStats = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const yGlobalBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="min-h-screen font-sans text-slate-900 selection:bg-teal-500 selection:text-white overflow-x-hidden relative">
      
      {/* 🌟 GLOBAL STICKY PARALLAX BACKGROUND */}
      <motion.div 
        style={{ y: yGlobalBg }}
        className="fixed inset-[-20%] z-[-2] w-[140%] h-[140%] bg-[url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80')] bg-cover bg-center"
      />
      <div className="fixed inset-0 z-[-1] bg-slate-50/85 backdrop-blur-sm"></div>

      <Navbar />

      <HeroSlider />
      <Marquee />
      <AboutSection />

      {/* 🌟 STATS SECTION with Parallax */}
      <motion.section 
        style={{ y: yStats, opacity: opacityStats }}
        className="pt-24 pb-20 relative z-10"
      >
        <div className="relative -mt-24 z-20 mx-auto max-w-7xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="rounded-[2.5rem] bg-white p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100"
          >
            <div className="text-center px-4 group">
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-600 to-emerald-500 group-hover:scale-110 transition-transform duration-300">50k+</p>
              <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Patients Treated</p>
            </div>
            <div className="text-center px-4 group">
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-600 to-emerald-500 group-hover:scale-110 transition-transform duration-300">2,500+</p>
              <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Doctors</p>
            </div>
            <div className="text-center px-4 group">
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-600 to-emerald-500 group-hover:scale-110 transition-transform duration-300">10m</p>
              <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Avg. Wait Time</p>
            </div>
            <div className="text-center px-4 group">
              <div className="flex justify-center items-center gap-1 text-5xl font-black group-hover:scale-110 transition-transform duration-300">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-teal-600 to-emerald-500">4.9</span> 
                <Star className="h-10 w-10 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              </div>
              <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">App Rating</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 🌟 SERVICES HIGHLIGHT */}
      <section id="services" className="pt-24 pb-12 relative overflow-hidden text-slate-900 bg-white/30 backdrop-blur-xl border-y border-white/50">
        
        {/* Deep glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-24"
          >
            <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400 uppercase tracking-[0.3em] mb-4">Our Services</h2>
            <h3 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">Comprehensive Medical Care</h3>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Video className="h-8 w-8 text-teal-400" />, title: '24/7 Video Consults', desc: 'Connect instantly with top specialists via secure HD WebRTC video calls.', glow: 'group-hover:shadow-[0_0_50px_rgba(45,212,191,0.3)]' },
              { icon: <MapPin className="h-8 w-8 text-sky-400" />, title: 'At-Home Medical Care', desc: 'Book experienced doctors, nurses, and physios for home visits with real-time GPS tracking.', glow: 'group-hover:shadow-[0_0_50px_rgba(56,189,248,0.3)]' },
              { icon: <HeartPulse className="h-8 w-8 text-rose-400 animate-pulse" />, title: 'Emergency SOS & Ambulance', desc: 'One-tap emergency trigger dispatches the nearest advanced life support ambulance instantly.', glow: 'group-hover:shadow-[0_0_50px_rgba(251,113,133,0.3)]' },
              { icon: <FileText className="h-8 w-8 text-indigo-400" />, title: 'Centralized EHR Vaults', desc: 'Secure, encrypted digital vaults for all your lab reports, prescriptions, and medical history.', glow: 'group-hover:shadow-[0_0_50px_rgba(99,102,241,0.3)]' },
              { icon: <Brain className="h-8 w-8 text-purple-400" />, title: 'AI-Powered Diagnostics', desc: 'Preliminary symptom checking and scan analysis powered by advanced AI algorithms.', glow: 'group-hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]' },
              { icon: <Pill className="h-8 w-8 text-emerald-400" />, title: 'Pharmacy & Lab Delivery', desc: 'Order prescribed medicines and schedule at-home lab tests with digital report delivery.', glow: 'group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]' },
            ].map((srv, idx) => (
              <motion.div 
                key={idx} variants={cardVariant} whileHover={{ y: -15, scale: 1.02 }}
                className={`group relative rounded-[2.5rem] bg-gradient-to-br from-white/95 to-slate-50/90 p-10 border border-white overflow-hidden cursor-pointer backdrop-blur-2xl transition-all duration-700 shadow-[0_20px_60px_-15px_rgba(13,148,136,0.12)] hover:border-teal-100 hover:shadow-[0_40px_100px_-20px_rgba(13,148,136,0.25)]`}
              >
                {/* Luxurious inner glow */}
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_40px_rgba(255,255,255,1)] pointer-events-none"></div>
                
                {/* Moving gradient hover background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-transparent to-sky-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem] -z-10"></div>
                <div className="relative z-10">
                  <div className={`h-20 w-20 rounded-[1.5rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-50 transition-all duration-500`}>
                    {srv.icon}
                  </div>
                  <h4 className={`text-3xl font-black text-slate-900 mb-4 tracking-tight`}>{srv.title}</h4>
                  <p className={`text-lg leading-relaxed text-slate-500`}>{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ServicesSlider />
      <AwardsSection />
      <Testimonials />

      {/* 🌟 PATIENT APP */}
      <section className="py-32 bg-white/20 backdrop-blur-lg border-y border-white/50 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-200/40 via-transparent to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -100, rotateY: 20 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 1, type: "spring", bounce: 0.2 }}
              className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(20,184,166,0.4)] ring-8 ring-white"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent z-10 pointer-events-none"></div>
              <Image src="/images/patient-app.jpg" alt="Patient App" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover hover:scale-110 transition-transform duration-[2000ms] ease-out" />
              <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl">
                <p className="text-white font-bold text-lg">"The easiest booking experience ever."</p>
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
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-black text-teal-700 uppercase tracking-widest mb-8 shadow-sm">
                <User className="h-4 w-4" /> Patient Experience
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 leading-[1.1]">
                Your health in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">palm of your hand.</span>
              </motion.h3>
              <motion.p variants={fadeUp} className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                The CareConnect patient ecosystem is built on a robust, HIPAA-compliant architecture. Effortlessly manage your Electronic Health Records (EHR), track live emergency ambulances via GPS, and seamlessly consult with top-tier specialists using enterprise-grade WebRTC video infrastructure.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {['Family Member Profiles', 'Instant UPI Payments', 'Encrypted Records Vault', 'WhatsApp Reminders'].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] hover:border-teal-200 group transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors duration-300">
                      <CheckCircle className="h-5 w-5 text-teal-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-slate-800 font-bold text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp}>
                <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-teal-500 px-8 py-5 text-lg font-black text-white shadow-[0_10px_40px_-10px_rgba(20,184,166,0.8)] transition-all hover:bg-teal-400 hover:scale-105 hover:shadow-[0_20px_50px_-10px_rgba(20,184,166,0.8)]">
                  Explore Patient Portal <ArrowRight className="h-6 w-6" />
                </Link>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 🌟 DOCTOR PORTAL (PRO THEME) */}
      <section className="py-32 bg-sky-50/40 backdrop-blur-lg border-y border-white/60 relative overflow-hidden text-slate-900">
        {/* Abstract shapes */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-sky-300/30 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a05_1px,transparent_1px),linear-gradient(to_bottom,#0f172a05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#fff_70%,transparent_100%)] pointer-events-none z-0"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center flex-col-reverse lg:flex-row-reverse">
            
            <motion.div 
              initial={{ opacity: 0, x: 100, rotateY: -20 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 1, type: "spring", bounce: 0.2 }}
              className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(2,132,199,0.3)] ring-8 ring-white"
            >
              <Image src="/images/doctor-tablet.jpg" alt="Doctor Portal" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover hover:scale-110 transition-transform duration-[2000ms] ease-out" />
              <div className="absolute top-8 right-8 z-20 bg-white/90 backdrop-blur-md border border-sky-100 p-5 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold">Earnings Updated</p>
                  <p className="text-emerald-600 font-bold text-sm">+$4,250.00 Today</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/50 px-4 py-2 text-xs font-black text-sky-800 uppercase tracking-widest mb-8 backdrop-blur-sm">
                <Stethoscope className="h-4 w-4" /> Doctor Empowered
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 leading-[1.1]">
                Practice management, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-500">elevated.</span>
              </motion.h3>
              <motion.p variants={fadeUp} className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Designed specifically for modern healthcare professionals. Optimize your clinic operations with smart scheduling, track granular revenue streams via a secure double-entry ledger, and issue cryptographically signed e-prescriptions seamlessly.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {['Digital Prescription Builder', 'Smart Vacation Blocks', 'Real-time Escrow Payouts', 'Instant Emergency Handovers'].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 hover:-translate-y-1 hover:border-sky-300 group transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:bg-sky-500 transition-colors duration-300 border border-sky-100">
                      <CheckCircle className="h-5 w-5 text-sky-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-slate-800 font-bold text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp}>
                <Link href="/register?role=DOCTOR" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-5 text-lg font-black text-white shadow-[0_10px_40px_-10px_rgba(15,23,42,0.3)] transition-all hover:bg-slate-800 hover:scale-105 hover:shadow-[0_20px_50px_-10px_rgba(15,23,42,0.4)]">
                  Join as a Doctor <ArrowRight className="h-6 w-6" />
                </Link>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      <section className="py-32 bg-white/20 backdrop-blur-lg border-y border-white/50 relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 uppercase tracking-widest mb-3">Seamless Process</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">How CareConnect Works</h3>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
          >
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-teal-100 via-teal-500 to-teal-100 z-0"></div>
            
            {[
              { step: '01', title: 'Find a Specialist', desc: 'Browse our directory of top-rated verified doctors and clinics.' },
              { step: '02', title: 'Book Instantly', desc: 'Select a time slot and pay securely via UPI, Card, or Net Banking.' },
              { step: '03', title: 'Consult Online', desc: 'Join the HD video call or meet the doctor in person at your home.' },
              { step: '04', title: 'Get Prescriptions', desc: 'Receive instant digital prescriptions and follow-up care plans.' }
            ].map((item, i) => (
              <motion.div key={i} variants={cardVariant} className="relative z-10 text-center group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-teal-50 transition-all duration-300">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-400">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      <section className="py-32 relative overflow-hidden border-t border-slate-200/60 bg-gradient-to-br from-teal-950/90 to-sky-950/90 backdrop-blur-xl">
        
        {/* Rotating glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-400/20 blur-[150px] rounded-full animate-[spin_10s_linear_infinite] pointer-events-none z-0"></div>
        
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="mx-auto w-24 h-24 mb-10 rounded-[2rem] bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(20,184,166,0.3)]">
              <Building2 className="h-10 w-10 text-teal-400" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Scale your Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">instantly.</span></h2>
            <p className="text-xl md:text-2xl font-medium text-teal-50 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get the CareConnect Enterprise Suite. Multi-doctor management, custom branding, and automated GST compliance.
            </p>
            <Link href="/register/clinic" className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-black text-black transition-all hover:bg-slate-200 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Register your Clinic <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
