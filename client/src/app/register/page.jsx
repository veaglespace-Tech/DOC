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
  ShieldCheck
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

const REGISTRATION_ROLES = [
  {
    id: 'patient',
    title: 'Patient',
    subtitle: 'For Patients & Families',
    desc: 'Book verified doctors for video calls, order doctor home visits, and store all your health records securely.',
    icon: User,
    color: 'teal',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-200 shadow-xs',
    btnBg: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25',
    border: 'hover:border-teal-400/80 hover:shadow-teal-500/15',
    href: '/register/patient',
    btnText: 'Register as Patient'
  },
  {
    id: 'doctor',
    title: 'Doctor',
    subtitle: 'For Verified Physicians',
    desc: 'Grow your practice, set your consultation fees, consult patients online or at home, and get automated bank payouts.',
    icon: Stethoscope,
    color: 'purple',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200 shadow-xs',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25',
    border: 'hover:border-purple-400/80 hover:shadow-purple-500/15',
    href: '/register/doctor',
    btnText: 'Register as Doctor'
  },
  {
    id: 'clinic',
    title: 'Clinic HQ',
    subtitle: 'For Clinics & Hospitals',
    desc: 'Empower your healthcare facility with centralized doctor scheduling, patient check-in desk, and digital records.',
    icon: Building2,
    color: 'blue',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200 shadow-xs',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25',
    border: 'hover:border-blue-400/80 hover:shadow-blue-500/15',
    href: '/register/clinic',
    btnText: 'Register Your Clinic'
  }
];

export default function RegisterRoleSelection() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-10 sm:py-16">
        <motion.div 
          className="max-w-5xl w-full mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Simple Clean Header */}
          <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Free Account Creation</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Create Your Account
            </h1>
            
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-medium">
              Choose how you want to join the Doctor On Call healthcare network.
            </p>
          </motion.div>

          {/* Clean 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REGISTRATION_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <motion.div 
                  key={role.id}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <div className={`h-full flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md shadow-slate-200/70 hover:shadow-2xl transition-all duration-300 ${role.border}`}>
                    
                    <div>
                      {/* Icon & Subtitle */}
                      <div className="flex items-center justify-between mb-5">
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
                      
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                        {role.desc}
                      </p>
                    </div>

                    {/* Direct Single Action Button */}
                    <Link
                      href={role.href}
                      className={`flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] ${role.btnBg}`}
                    >
                      <span>{role.btnText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Simple Bottom Link */}
          <motion.div variants={itemVariants} className="mt-10 sm:mt-12 text-center">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </motion.div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
