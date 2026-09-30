'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Patient Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/login/patient" 
              className="group block rounded-[2rem] bg-white p-10 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                <ArrowRight className="h-6 w-6 text-teal-500" />
              </div>
              <div className="h-20 w-20 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-8 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Patient Portal</h2>
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Access your medical records, book new appointments, manage emergency contacts, and consult with doctors online.
              </p>
            </Link>
          </motion.div>

          {/* Doctor Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { type: "spring" } }}>
            <Link 
              href="/login/doctor" 
              className="group block rounded-[2rem] bg-white p-10 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-800/10 hover:border-slate-800/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                <ArrowRight className="h-6 w-6 text-slate-800" />
              </div>
              <div className="h-20 w-20 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Stethoscope className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Doctor Portal</h2>
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Manage your appointments, securely access patient history, write digital prescriptions, and view your revenue ledger.
              </p>
            </Link>
          </motion.div>

        </div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-500 font-medium">
            New to CareConnect? <Link href="/register" className="text-teal-600 hover:text-teal-700 hover:underline underline-offset-4 font-bold ml-1">Create an account</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
