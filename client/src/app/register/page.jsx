'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, 
  Stethoscope, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Activity 
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.12, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 120, damping: 18 } 
  }
};

const REGISTRATION_ROLES = [
  {
    id: 'patient',
    name: 'Patient Account',
    badge: 'Patients & Family',
    tagline: 'Access 24/7 Digital Healthcare',
    desc: 'Consult verified doctors via HD video, request emergency doctors to your doorstep within 5km, and securely store medical records.',
    icon: User,
    gradient: 'from-teal-500 to-emerald-600',
    lightBg: 'bg-teal-50/80',
    border: 'hover:border-teal-400/80',
    shadow: 'hover:shadow-teal-500/15',
    pill: 'bg-teal-100/80 text-teal-800 border-teal-200/80',
    badgeDot: 'bg-teal-500',
    features: [
      'Fast 1-minute registration',
      'Encrypted EHR Medical Vault',
      'Automated GST Invoices & Receipts',
      'Family Members Medical History'
    ],
    href: '/register/patient'
  },
  {
    id: 'doctor',
    name: 'Doctor Practice',
    badge: 'Medical Practitioners',
    tagline: 'Join Verified Healthcare Network',
    desc: 'Set your own consultation and home visit fees, issue digital prescriptions with digital signature, and withdraw earnings in 24 hours.',
    icon: Stethoscope,
    gradient: 'from-purple-600 to-indigo-600',
    lightBg: 'bg-purple-50/80',
    border: 'hover:border-purple-400/80',
    shadow: 'hover:shadow-purple-500/15',
    pill: 'bg-purple-100/80 text-purple-800 border-purple-200/80',
    badgeDot: 'bg-purple-500',
    features: [
      'Digital Prescription Builder (Rx)',
      '24-Hour Automated Settlement Escrow',
      'Clinical Handover & Availability Slots',
      'Direct Bank Account Payouts'
    ],
    href: '/register/doctor'
  },
  {
    id: 'clinic',
    name: 'Clinic & Hospital SaaS',
    badge: 'Enterprise Multi-Tenant',
    tagline: 'Digitize Hospital & Clinic Operations',
    desc: 'Empower attending physicians with real-time OPD token queue, comprehensive patient registry, and automated 18% GST tax ledgers.',
    icon: Building2,
    gradient: 'from-blue-600 to-cyan-600',
    lightBg: 'bg-blue-50/80',
    border: 'hover:border-blue-400/80',
    shadow: 'hover:shadow-blue-500/15',
    pill: 'bg-blue-100/80 text-blue-800 border-blue-200/80',
    badgeDot: 'bg-blue-500',
    features: [
      'Multi-doctor quota tier management',
      'Real-time OPD token queue stream',
      'Subdomain routing (*.careconnect.in)',
      'Clinic billing & SGST/CGST reports'
    ],
    href: '/register/clinic'
  }
];

export default function RegisterRoleSelection() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50 selection:bg-indigo-600 selection:text-white">
      {/* 🌟 UNIFIED TOP NAVBAR */}
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden py-12 sm:py-16">
        {/* Dynamic Background Ambient Lightings */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/10 via-sky-500/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

        <motion.div 
          className="max-w-7xl w-full z-10 mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs text-slate-700 text-xs font-black uppercase tracking-wider mb-4 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Join Veagle Space Healthcare Network</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Free Account</span>
            </h1>
            
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Select how you want to experience the platform. Whether you are a patient seeking care, a doctor growing a practice, or an enterprise clinic.
            </p>
          </motion.div>

          {/* 3-Column Modern Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {REGISTRATION_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <motion.div 
                  key={role.id} 
                  variants={itemVariants} 
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 260, damping: 20 } }}
                  className="h-full"
                >
                  <Link 
                    href={role.href} 
                    className={`group flex flex-col justify-between h-full rounded-3xl bg-white/95 backdrop-blur-xl p-7 sm:p-8 border border-slate-200/80 shadow-lg shadow-slate-100 ${role.border} ${role.shadow} transition-all duration-300 relative overflow-hidden`}
                  >
                    {/* Top Glow on Hover */}
                    <div className={`absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`}></div>

                    <div>
                      {/* Badge & Tagline */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${role.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${role.badgeDot} animate-pulse`}></span>
                          {role.badge}
                        </span>

                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                          Instant Access &rarr;
                        </span>
                      </div>

                      {/* Icon Avatar */}
                      <div className={`h-16 w-16 rounded-2xl ${role.lightBg} flex items-center justify-center mb-6 group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${role.gradient} text-white flex items-center justify-center shadow-md`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h2 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {role.name}
                      </h2>
                      <p className="text-xs font-bold text-indigo-600 mb-3">
                        {role.tagline}
                      </p>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                        {role.desc}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2.5 pt-5 border-t border-slate-100 mb-6">
                        {role.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        <span>Get Started as {role.name.split(' ')[0]}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>

                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Login Link */}
          <motion.div variants={itemVariants} className="mt-12 sm:mt-14 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-slate-500 font-medium text-xs sm:text-sm">
                Already registered with Veagle Space Healthcare?
              </span>
              <Link 
                href="/login" 
                className="text-indigo-600 hover:text-indigo-700 font-black text-xs sm:text-sm underline underline-offset-4 ml-1 transition-colors"
              >
                Sign in to your portal &rarr;
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* 🌟 UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
