'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  Video
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

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
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-sky-50 flex items-center justify-center text-center">
        {/* Abstract Medical Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-teal-100/60 to-transparent blur-3xl"></div>
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sky-100/60 to-transparent blur-3xl"></div>
        </div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="relative z-10 mx-auto max-w-5xl px-6 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-5 py-2 text-sm font-bold text-teal-700 mb-6 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            India's #1 Premium Healthcare Network
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl leading-tight">
            Healthcare that comes to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">your doorstep.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-xl leading-8 text-slate-600 font-medium">
            Experience world-class medical care from the comfort of your home. Instantly book top-rated specialists, arrange emergency dispatches, and consult via HD video.
          </motion.p>
          
          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link href="/patient" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-teal-600 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-teal-500/30 transition-all hover:bg-teal-500 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1">
              <User className="h-5 w-5" /> Patient Portal
            </Link>
            <Link href="/doctor" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-10 py-5 text-lg font-bold text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg">
              <Stethoscope className="h-5 w-5" /> I am a Doctor
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 🌟 STATS SECTION */}
      <section className="bg-gradient-to-b from-sky-50 to-slate-50">
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
      </section>

      {/* 🌟 SERVICES HIGHLIGHT */}
      <section id="services" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-extrabold text-teal-600 uppercase tracking-widest mb-3">Our Services</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Comprehensive Medical Care</h3>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Video className="h-8 w-8" />, title: 'Video Consultations', desc: 'Connect with top specialists instantly via HD WebRTC video calls.', color: 'from-teal-50 to-white', border: 'border-teal-100', iconBg: 'bg-teal-100 text-teal-700' },
              { icon: <MapPin className="h-8 w-8" />, title: 'Home Visits', desc: 'Book experienced doctors for in-person home visits. Real-time GPS tracking.', color: 'from-emerald-50 to-white', border: 'border-emerald-100', iconBg: 'bg-emerald-100 text-emerald-700' },
              { icon: <HeartPulse className="h-8 w-8 animate-pulse text-white" />, title: 'Emergency SOS', desc: 'One-tap emergency trigger broadcasts your location to the nearest doctors.', color: 'from-red-500 to-red-600', border: 'border-red-500', iconBg: 'bg-white/20 text-white', textColor: 'text-white' },
            ].map((srv, idx) => (
              <motion.div 
                key={idx} variants={cardVariant} whileHover={{ y: -15, scale: 1.02 }}
                className={`group relative rounded-[2.5rem] bg-gradient-to-br ${srv.color} p-10 border ${srv.border} shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer backdrop-blur-xl`}
              >
                <div className="relative z-10">
                  <div className={`h-20 w-20 rounded-[1.5rem] ${srv.iconBg} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {srv.icon}
                  </div>
                  <h4 className={`text-3xl font-black ${srv.textColor || 'text-slate-900'} mb-4 tracking-tight`}>{srv.title}</h4>
                  <p className={`text-lg leading-relaxed ${srv.textColor ? 'text-rose-50' : 'text-slate-500'}`}>{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 PATIENT APP */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/50 via-white to-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
        
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
                The CareConnect patient app provides a luxurious, seamless experience. Manage your Electronic Health Records (EHR), track live ambulances, and securely chat with your assigned doctors.
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
      <section className="py-32 bg-sky-50 relative overflow-hidden text-slate-900">
        {/* Abstract shapes */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-sky-200/50 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-100/80 blur-[120px] rounded-full pointer-events-none"></div>
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
                Designed specifically for modern healthcare professionals. Manage your clinic availability, track earnings via double-entry ledger, and digitally sign prescriptions seamlessly.
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

      {/* 🌟 HOW IT WORKS */}
      <section className="py-32 bg-white relative overflow-hidden">
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

      {/* 🌟 TESTIMONIALS */}
      <section className="py-32 bg-slate-50 relative overflow-hidden text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/50 via-slate-50 to-slate-50 z-0"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-extrabold text-sky-600 uppercase tracking-widest mb-3">Testimonials</h2>
            <h3 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Loved by Thousands</h3>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { name: 'Rahul Sharma', role: 'Patient', review: 'The emergency SOS feature saved my father. A doctor was dispatched to our home within 15 minutes. Highly recommended.' },
              { name: 'Dr. Sneha Desai', role: 'Cardiologist', review: 'Managing my clinic has never been easier. The dashboard and automated billing system is absolutely world-class.' },
              { name: 'Priya Patel', role: 'Patient', review: 'I love how I can store all my medical records securely and show them to any specialist via the app. Fantastic UI!' }
            ].map((t, idx) => (
              <motion.div key={idx} variants={cardVariant} whileHover={{ y: -10 }} className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 rounded-[2rem] backdrop-blur-md">
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">"{t.review}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-sky-600 text-sm">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 ENTERPRISE CLINICS CTA */}
      <section className="py-24 bg-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-400 opacity-90 z-0"></div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Building2 className="h-20 w-20 mx-auto mb-8 opacity-80" />
            <h2 className="text-4xl md:text-6xl font-black mb-6">Scale your Hospital instantly.</h2>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-10 max-w-3xl mx-auto">
              Get the CareConnect Enterprise Suite. Multi-doctor management, custom branding, and automated GST compliance.
            </p>
            <Link href="/register/clinic" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-black text-teal-600 shadow-2xl transition-transform hover:scale-105">
              Register your Clinic <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
