'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Stethoscope, ArrowRight, Building2, ShieldCheck } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function LoginRoleSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-teal-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        className="max-w-4xl w-full z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-slate-900 mb-6 hover:opacity-80 transition-opacity">
            Care<span className="text-teal-600">Connect</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="mt-4 text-lg text-slate-500">Please select your portal to continue.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Patient Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/login/patient" 
              className="group block h-full rounded-[2rem] bg-white p-7 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <User className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Patient Portal</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consult with doctors online, trigger 5km Emergency SOS, and view prescriptions.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                Sign in as Patient <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </motion.div>

          {/* Doctor Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/login/doctor" 
              className="group block h-full rounded-[2rem] bg-white p-7 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-800/10 hover:border-slate-800/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Doctor Practice</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage consultations, digital prescriptions, patient roster, and 24h escrow earnings.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-slate-800 group-hover:translate-x-1 transition-transform">
                Sign in as Doctor <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </motion.div>

          {/* Clinic & Hospital Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/login/clinic" 
              className="group block h-full rounded-[2rem] bg-white p-7 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Building2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Clinic & Hospital HQ</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Multi-tenant SaaS dashboard, live OPD tokens, staff management, and GST ledger.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                Sign in as Clinic <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </motion.div>

          {/* Super Admin Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/admin/login" 
              className="group block h-full rounded-[2rem] bg-white p-7 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Super Admin</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Platform control panel, doctor KYC verification, payout releases, and audit logs.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                Super Admin Access <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </motion.div>

        </div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-500 font-medium text-xs">
            Shared Default Credentials: Password is <span className="font-mono font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded">Veagle@123</span> for all demo roles.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
