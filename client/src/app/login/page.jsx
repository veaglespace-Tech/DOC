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
  ShieldAlert, 
  Copy,
  Check,
  Shield,
  Zap,
  Globe2
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.08 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 140, damping: 18 } 
  }
};

const PORTALS = [
  {
    id: 'patient',
    name: 'Patient Portal',
    badge: 'Patients & Family',
    status: 'Live & On-Duty',
    desc: 'Consult top certified specialists, schedule rapid home doctor visits, and manage encrypted lifetime EHR vaults.',
    icon: User,
    color: 'teal',
    gradient: 'from-teal-500 via-teal-600 to-emerald-600',
    lightBg: 'bg-teal-50/90 text-teal-600 border-teal-200/80',
    border: 'hover:border-teal-400 group-hover:shadow-teal-500/15',
    pill: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeDot: 'bg-teal-500',
    btnBg: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25',
    features: ['Instant Encrypted Video Consults', 'Verified Doctor Home Visits', 'Lifetime Digital Health Vault'],
    demoEmail: 'patient@doctoroncall.com',
  },
  {
    id: 'doctor',
    name: 'Doctor Practice',
    badge: 'Medical Practitioners',
    status: 'Verified Doctors',
    desc: 'Manage clinical consults, digitally sign MCI-compliant prescriptions, clinical handovers, and 24h bank payouts.',
    icon: Stethoscope,
    color: 'purple',
    gradient: 'from-purple-600 via-indigo-600 to-purple-700',
    lightBg: 'bg-purple-50/90 text-purple-600 border-purple-200/80',
    border: 'hover:border-purple-400 group-hover:shadow-purple-500/15',
    pill: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeDot: 'bg-purple-500',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25',
    features: ['MCI Compliant Digital Rx Pad', '24h Wallet Escrow Settlements', 'Peer-to-Peer Clinical Handovers'],
    demoEmail: 'doctor@doctoroncall.com',
  },
  {
    id: 'clinic',
    name: 'Clinic SaaS HQ',
    badge: 'Multi-Tenant SaaS',
    status: 'Hospital Network',
    desc: 'Live OPD token queue stream, attending physician quotas, patient registry, and automated 18% GST ledgers.',
    icon: Building2,
    color: 'blue',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-600',
    lightBg: 'bg-blue-50/90 text-blue-600 border-blue-200/80',
    border: 'hover:border-blue-400 group-hover:shadow-blue-500/15',
    pill: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeDot: 'bg-blue-500',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
    features: ['Real-time Walk-in Token Desk', 'Doctor Tier Quotas (Starter/Pro)', 'Automated GSTR-1 Invoicing'],
    demoEmail: 'clinic@doctoroncall.com',
  },
  {
    id: 'admin',
    name: 'Super Admin HQ',
    badge: 'Master Control',
    status: 'Operations Command',
    desc: 'Platform-wide analytics, doctor MCI credentials verification, withdrawal UTR releases, and live audit trails.',
    icon: ShieldAlert,
    color: 'indigo',
    gradient: 'from-slate-900 via-indigo-900 to-slate-950',
    lightBg: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80',
    border: 'hover:border-indigo-400 group-hover:shadow-indigo-500/15',
    pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeDot: 'bg-indigo-500',
    btnBg: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25',
    features: ['Doctor License & KYC Reviews', 'Doctor Payout Escrow Releases', 'Platform Security & Audit Logs'],
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
    setTimeout(() => setCopiedEmail(''), 2200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50 selection:bg-indigo-600 selection:text-white">
      {/* 🌟 UNIFIED TOP NAVBAR */}
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden py-10 sm:py-16">
        {/* Dynamic Background Ambient Gradients */}
        <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-teal-500/10 via-sky-500/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

        <motion.div
          className="max-w-7xl w-full z-10 mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-indigo-700 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-4 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Unified Healthcare SSO Gateway</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]">
              Select Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Access Portal
              </span>
            </h1>
            
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience seamless healthcare operations. Choose your role below to access dedicated tools, digital health records, and clinical workflows.
            </p>

            {returnUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm font-bold shadow-xs text-left"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
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
                  whileHover={{ y: -6, transition: { type: "spring", stiffness: 260, damping: 20 } }}
                  className="h-full"
                >
                  <Link
                    href={`/login/${portal.id}${returnQuery}`}
                    className={`group flex flex-col justify-between h-full rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-7 border border-slate-200/90 shadow-md shadow-slate-100 hover:shadow-2xl ${portal.border} transition-all duration-300 relative overflow-hidden`}
                  >
                    {/* Top Ambient Glow */}
                    <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`}></div>

                    <div>
                      {/* Badge & Status Row */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${portal.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${portal.badgeDot} animate-pulse`}></span>
                          {portal.badge}
                        </span>

                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                          {portal.status}
                        </span>
                      </div>

                      {/* Icon Avatar Container */}
                      <div className={`h-14 w-14 rounded-2xl ${portal.lightBg} border flex items-center justify-center mb-5 group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
                        <Icon className="h-7 w-7" />
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {portal.name}
                      </h2>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mb-5">
                        {portal.desc}
                      </p>

                      {/* Key Features List */}
                      <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                        {portal.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer with 1-Click Copy */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                          Continue to Portal
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => copyToClipboard(portal.demoEmail, e)}
                          title={`Copy demo email: ${portal.demoEmail}`}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          {copiedEmail === portal.demoEmail ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${portal.btnBg}`}>
                        <span>Sign In as {portal.name.split(' ')[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
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
            className="mt-12 sm:mt-14 max-w-4xl mx-auto rounded-3xl bg-slate-900 text-slate-300 p-5 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Default Testing Credentials</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Shared Test Password:{' '}
                    <code className="text-indigo-300 font-mono bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
                      Veagle@123
                    </code>{' '}
                    for all demo portals.
                  </p>
                </div>
              </div>

              {/* Security Pill Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
                  <Shield className="h-3 w-3 text-indigo-400" />
                  <span>256-Bit SSO</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Instant Routing</span>
                </div>
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
