'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Stethoscope, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Activity, 
  Layers, 
  ShieldAlert, 
  ChevronRight,
  Copy,
  Check
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

const PORTALS = [
  {
    id: 'patient',
    name: 'Patient Portal',
    badge: 'Patients & Family',
    status: 'Live & On-Duty',
    desc: 'Consult top specialists, schedule rapid home doctor visits, and access encrypted EHR vaults.',
    icon: User,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-600',
    lightBg: 'bg-teal-50/80',
    border: 'hover:border-teal-400/80',
    shadow: 'hover:shadow-teal-500/15',
    pill: 'bg-teal-100/80 text-teal-800 border-teal-200/80',
    badgeDot: 'bg-teal-500',
    features: ['Instant Video & In-Clinic', '5km GPS SOS Dispatch', 'Digital Health Locker'],
    demoEmail: 'patient@doctoroncall.com',
  },
  {
    id: 'doctor',
    name: 'Doctor Practice',
    badge: 'Practitioners',
    status: 'Verified Doctors',
    desc: 'Daily appointment roster, digital Rx prescription pad, clinical handovers, and 24h bank payouts.',
    icon: Stethoscope,
    color: 'purple',
    gradient: 'from-purple-600 to-indigo-600',
    lightBg: 'bg-purple-50/80',
    border: 'hover:border-purple-400/80',
    shadow: 'hover:shadow-purple-500/15',
    pill: 'bg-purple-100/80 text-purple-800 border-purple-200/80',
    badgeDot: 'bg-purple-500',
    features: ['EHR Rx Pad with Signature', '24h Settlement Holds', 'Peer-to-Peer Handovers'],
    demoEmail: 'doctor@doctoroncall.com',
  },
  {
    id: 'clinic',
    name: 'Clinic SaaS HQ',
    badge: 'Multi-Tenant SaaS',
    status: 'Facility Network',
    desc: 'Live OPD token queue stream, attending physician quotas, patient registry, and 18% GST ledgers.',
    icon: Building2,
    color: 'blue',
    gradient: 'from-blue-600 to-cyan-600',
    lightBg: 'bg-blue-50/80',
    border: 'hover:border-blue-400/80',
    shadow: 'hover:shadow-blue-500/15',
    pill: 'bg-blue-100/80 text-blue-800 border-blue-200/80',
    badgeDot: 'bg-blue-500',
    features: ['Live Token Stream & Room ID', 'Doctor Tier Quota (Starter/Pro)', 'Automated GST Invoicing'],
    demoEmail: 'clinic@doctoroncall.com',
  },
  {
    id: 'admin',
    name: 'Super Admin HQ',
    badge: 'Master Control',
    status: 'Operations Command',
    desc: 'System-wide analytics, doctor MCI verification, withdrawal UTR releases, and live audit trails.',
    icon: ShieldAlert,
    color: 'indigo',
    gradient: 'from-indigo-600 to-slate-900',
    lightBg: 'bg-indigo-50/80',
    border: 'hover:border-indigo-400/80',
    shadow: 'hover:shadow-indigo-500/15',
    pill: 'bg-indigo-100/80 text-indigo-800 border-indigo-200/80',
    badgeDot: 'bg-indigo-500',
    features: ['MCI Medical License Review', 'Doctor Payout Escrow', 'Grievance Resolution Desk'],
    demoEmail: 'admin@doctoroncall.com',
  }
];

function LoginRoleContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const returnQuery = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
  const [copiedEmail, setCopiedEmail] = useState('');

  const copyToClipboard = (email, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50 selection:bg-indigo-600 selection:text-white">
      {/* 🌟 UNIFIED TOP NAVBAR */}
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden py-12 sm:py-16">
        {/* Dynamic Background Ambient Lightings */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/10 via-sky-500/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

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
              <span>Unified Healthcare SSO Gateway</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Access Portal</span>
            </h1>
            
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience seamless healthcare management. Choose your role below to access dedicated tools, electronic health records, and operations.
            </p>

            {returnUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-teal-50 border border-teal-200/90 text-teal-900 text-xs sm:text-sm font-bold shadow-sm"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                <span>Doctor consultation booking requires patient authentication. Please sign in as Patient.</span>
              </motion.div>
            )}
          </motion.div>

          {/* Modern Responsive Portal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <motion.div 
                  key={portal.id} 
                  variants={itemVariants} 
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 260, damping: 20 } }}
                  className="h-full"
                >
                  <Link
                    href={`/login/${portal.id}${returnQuery}`}
                    className={`group flex flex-col justify-between h-full rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-7 border border-slate-200/80 shadow-lg shadow-slate-100 ${portal.border} ${portal.shadow} transition-all duration-300 relative overflow-hidden`}
                  >
                    {/* Top Glow on Hover */}
                    <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`}></div>

                    <div>
                      {/* Badge & Status Row */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${portal.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${portal.badgeDot} animate-pulse`}></span>
                          {portal.badge}
                        </span>

                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                          {portal.status}
                        </span>
                      </div>

                      {/* Icon Avatar */}
                      <div className={`h-14 w-14 rounded-2xl ${portal.lightBg} flex items-center justify-center mb-5 group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${portal.gradient} text-white flex items-center justify-center shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {portal.name}
                      </h2>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                        {portal.desc}
                      </p>

                      {/* Key Features List */}
                      <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                        {portal.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                          Continue to Portal
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => copyToClipboard(portal.demoEmail, e)}
                          title={`Copy demo email: ${portal.demoEmail}`}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                        >
                          {copiedEmail === portal.demoEmail ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Demo Credentials Footer Bar */}
          <motion.div 
            variants={itemVariants} 
            className="mt-12 sm:mt-14 max-w-3xl mx-auto rounded-3xl bg-slate-900 text-slate-300 p-5 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Default Testing Credentials</h4>
                  <p className="text-xs text-slate-400 font-medium">Shared Password: <code className="text-indigo-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Veagle@123</code> for all demo portals.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-slate-300">256-bit AES SSO Ready</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* 🌟 UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}

export default function LoginRoleSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold">
        Loading Healthcare Portals...
      </div>
    }>
      <LoginRoleContent />
    </Suspense>
  );
}
