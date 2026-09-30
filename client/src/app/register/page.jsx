'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Stethoscope, ArrowRight, Building2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function RegisterRoleSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-teal-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        className="max-w-6xl w-full z-10 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-slate-900 mb-6 hover:opacity-80 transition-opacity">
            Care<span className="text-teal-600">Connect</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Join CareConnect</h1>
          <p className="mt-4 text-lg text-slate-500">Select how you want to use the platform to begin your registration.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Patient Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/register/patient" 
              className="group block h-full rounded-[2rem] bg-white p-8 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-teal-500" />
              </div>
              <div className="h-16 w-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <User className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Patient</h2>
              <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-600 transition-colors">
                Sign up to consult top doctors, maintain your digital health records, and order emergency services to your location.
              </p>
            </Link>
          </motion.div>

          {/* Doctor Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/register/doctor" 
              className="group block h-full rounded-[2rem] bg-white p-8 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-800/10 hover:border-slate-800/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-slate-800" />
              </div>
              <div className="h-16 w-16 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Doctor</h2>
              <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-600 transition-colors">
                Join our network of verified professionals. Manage your appointments, earn seamlessly, and provide digital prescriptions.
              </p>
            </Link>
          </motion.div>

          {/* Clinic/Admin Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/register/clinic" 
              className="group block h-full rounded-[2rem] bg-slate-900 p-8 border border-slate-800 shadow-lg shadow-slate-900/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <Building2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3">Clinic SaaS</h2>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                Onboard your entire hospital. Manage multiple doctors, view aggregate revenue analytics, and access enterprise features.
              </p>
            </Link>
          </motion.div>

        </div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-500 font-medium">
            Already have an account? <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline underline-offset-4 font-bold ml-1">Log in here</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
