'use client';
import React, { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Star, Users, Clock, ShieldCheck, HeartPulse, Activity, Microscope } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const serviceData = {
  'cardiology': {
    title: 'Cardiology Clinic',
    desc: 'Advanced heart care with state-of-the-art diagnostic and treatment facilities.',
    color: 'from-rose-500 to-red-600',
    icon: <HeartPulse className="h-16 w-16 text-rose-500" />
  },
  'orthopedics': {
    title: 'Orthopedics',
    desc: 'Comprehensive bone and joint care for injuries, arthritis, and surgeries.',
    color: 'from-sky-500 to-blue-600',
    icon: <Activity className="h-16 w-16 text-sky-500" />
  },
  'pediatrics': {
    title: 'Pediatrics',
    desc: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
    color: 'from-teal-500 to-emerald-600',
    icon: <ShieldCheck className="h-16 w-16 text-teal-500" />
  },
  'ivf': {
    title: 'IVF & Fertility',
    desc: 'Advanced reproductive technologies to help you build your family.',
    color: 'from-purple-500 to-violet-600',
    icon: <Microscope className="h-16 w-16 text-purple-500" />
  },
  'gynecology': {
    title: 'Gynecology',
    desc: 'Complete women’s health services from routine checkups to complex surgeries.',
    color: 'from-pink-500 to-rose-500',
    icon: <HeartPulse className="h-16 w-16 text-pink-500" />
  },
  'robotic-surgery': {
    title: 'Robotic Surgery',
    desc: 'Minimally invasive surgical procedures using precision robotics.',
    color: 'from-indigo-500 to-blue-600',
    icon: <Activity className="h-16 w-16 text-indigo-500" />
  },
  'neurology': {
    title: 'Neurology',
    desc: 'Expert treatment for brain, spinal cord, and nervous system disorders.',
    color: 'from-slate-500 to-slate-700',
    icon: <ShieldCheck className="h-16 w-16 text-slate-500" />
  },
  'pregnancy': {
    title: 'Maternity & Pregnancy',
    desc: 'Holistic care for mothers-to-be, ensuring a safe and comfortable delivery.',
    color: 'from-emerald-500 to-green-600',
    icon: <HeartPulse className="h-16 w-16 text-emerald-500" />
  },
  'emergency': {
    title: 'Emergency Room',
    desc: '24/7 rapid response trauma and medical emergency services.',
    color: 'from-red-500 to-red-700',
    icon: <Activity className="h-16 w-16 text-red-500" />
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ServicePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id || '';
  
  const data = serviceData[id] || {
    title: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
    desc: 'Experience world-class care and specialized treatments tailored to your health needs.',
    color: 'from-slate-600 to-slate-800',
    icon: <HeartPulse className="h-16 w-16 text-slate-500" />
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-800 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8 uppercase tracking-widest">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/#services" className="hover:text-slate-900 transition-colors">Services</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-800">{data.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}>
              <motion.div variants={fadeUp} className={`inline-flex items-center justify-center p-4 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 mb-8`}>
                {data.icon}
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                {data.title}
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                {data.desc}
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href={`/search?specialty=${data.title}`} className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r ${data.color} px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-300 hover:scale-105 transition-all`}>
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
                <Link href="#doctors" className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
                  <Users className="h-5 w-5 text-slate-400" />
                  View Specialists
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side Stats / Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <h3 className="text-2xl font-bold mb-8">Why Choose ViolaCare?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl shrink-0"><Star className="h-6 w-6 text-yellow-400" /></div>
                    <div>
                      <h4 className="font-bold text-lg">Top-Tier Specialists</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mt-1">Our department is led by globally recognized experts.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl shrink-0"><Clock className="h-6 w-6 text-sky-400" /></div>
                    <div>
                      <h4 className="font-bold text-lg">Zero Wait Time</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mt-1">Priority scheduling and instant digital consultations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl shrink-0"><ShieldCheck className="h-6 w-6 text-emerald-400" /></div>
                    <div>
                      <h4 className="font-bold text-lg">Advanced Technology</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mt-1">We utilize the latest AI and robotic surgical equipment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* DOCTORS SECTION */}
      <section id="doctors" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Meet Our <span className="text-slate-500">Specialists</span></h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Connect with the finest medical professionals dedicated to your recovery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-slate-200 rounded-2xl overflow-hidden shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=Dr+Doc${i}&background=0D8ABC&color=fff`} alt="Doctor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">Dr. Specialist {i+1}</h3>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{data.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg w-fit border border-slate-100">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 4.9 (120+ Reviews)
                </div>
                <Link href={`/search?specialty=${data.title}`} className="block w-full py-3 text-center rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors">
                  Consult Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
