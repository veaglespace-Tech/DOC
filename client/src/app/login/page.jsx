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
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08, delayChildren: 0.05 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 160, damping: 20 } 
  }
};

const ROLES_LIST = [
  {
    id: 'patient',
    title: 'Patient',
    subtitle: 'For Patients & Families',
    desc: 'Book doctor appointments, start video calls, order home visits, and access digital prescriptions.',
    icon: User,
    color: 'teal',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-200 shadow-xs',
    btnBg: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25',
    border: 'hover:border-teal-400/80 hover:shadow-teal-500/15',
    demoEmail: 'patient@doctoroncall.com',
    registerLink: '/register/patient'
  },
  {
    id: 'doctor',
    title: 'Doctor',
    subtitle: 'For Verified Physicians',
    desc: 'Manage your daily consultations, issue digital prescriptions, and view your bank earnings.',
    icon: Stethoscope,
    color: 'purple',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200 shadow-xs',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25',
    border: 'hover:border-purple-400/80 hover:shadow-purple-500/15',
    demoEmail: 'doctor@doctoroncall.com',
    registerLink: '/register/doctor'
  },
  {
    id: 'clinic',
    title: 'Clinic HQ',
    subtitle: 'For Clinics & Hospitals',
    desc: 'Manage clinic doctors, front desk walk-in patients, OPD tokens, and billing.',
    icon: Building2,
    color: 'blue',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200 shadow-xs',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25',
    border: 'hover:border-blue-400/80 hover:shadow-blue-500/15',
    demoEmail: 'clinic@doctoroncall.com',
    registerLink: '/register/clinic'
  },
  {
    id: 'admin',
    title: 'Super Admin',
    subtitle: 'For Platform Operations',
    desc: 'Verify doctor licenses, manage system settings, withdrawal releases, and compliance reports.',
    icon: ShieldCheck,
    color: 'slate',
    iconBg: 'bg-slate-100 text-slate-800 border-slate-300 shadow-xs',
    btnBg: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/25',
    border: 'hover:border-slate-500 hover:shadow-slate-500/20',
    demoEmail: 'admin@doctoroncall.com',
    registerLink: null
  }
];

function SimpleLoginContent() {
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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-10 sm:py-16">
        <motion.div
          className="max-w-6xl w-full mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Simple Clean Header */}
          <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Easy Portal Access</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-medium">
              Choose your role below to quickly sign in to your dashboard.
            </p>

            {returnUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm font-semibold"
              >
                <span>Please sign in as a <strong>Patient</strong> to book this appointment.</span>
              </motion.div>
            )}
          </motion.div>

          {/* Clean 4-Card Role Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {ROLES_LIST.map((role) => {
              const Icon = role.icon;
              return (
                <motion.div 
                  key={role.id} 
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <div className={`h-full flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md shadow-slate-200/70 hover:shadow-2xl transition-all duration-300 ${role.border}`}>
                    
                    <div>
                      {/* Icon & Subtitle */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center font-bold ${role.iconBg}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {role.subtitle}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-xl font-black text-slate-900 mb-2">
                        {role.title}
                      </h2>
                      
                      <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">
                        {role.desc}
                      </p>
                    </div>

                    <div>
                      {/* Direct Single Action Button */}
                      <Link
                        href={`/login/${role.id}${returnQuery}`}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99] mb-3.5 ${role.btnBg}`}
                      >
                        <span>Sign In as {role.title}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      {/* Simple 1-Click Demo Copy */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400 font-medium truncate max-w-[170px]" title={role.demoEmail}>
                          {role.demoEmail}
                        </span>
                        
                        <button
                          type="button"
                          onClick={(e) => copyToClipboard(role.demoEmail, e)}
                          title="Copy test login email"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer transition-colors"
                        >
                          {copiedEmail === role.demoEmail ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Simple Bottom Registration Link */}
          <motion.div variants={itemVariants} className="mt-10 sm:mt-12 text-center">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              New to Doctor On Call?{' '}
              <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                Create a Free Account
              </Link>
            </p>
          </motion.div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginRoleSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold text-sm">
        Loading...
      </div>
    }>
      <SimpleLoginContent />
    </Suspense>
  );
}
