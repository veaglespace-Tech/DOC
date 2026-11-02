'use client';
import React from 'react';
import Link from 'next/link';
import { 
  Video, 
  Home, 
  Building2, 
  FileText, 
  FlaskConical, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const coreServices = [
  {
    title: 'Instant Video Consultation',
    badge: '15-Min Response',
    description: 'Connect directly with certified specialists from the comfort of your home via encrypted, HD video calls with instant digital prescriptions.',
    features: ['15-Min Average Wait Time', 'Instant Digital Prescription', '100% Encrypted Video Room'],
    icon: Video,
    href: '/search?type=video',
    cta: 'Consult Online',
    theme: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      glowHover: 'group-hover:border-indigo-300 group-hover:shadow-indigo-500/10',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25',
      accentText: 'text-indigo-600',
    }
  },
  {
    title: 'Specialist Doctor Home Visits',
    badge: 'At-Home Diagnostics',
    description: 'Experienced medical practitioners visit your doorstep equipped with essential clinical diagnostic tools, vitals monitoring, and acute care.',
    features: ['Verified Medical Practitioners', 'Standard Diagnostic Kit Included', 'Bedside Care & Injection Support'],
    icon: Home,
    href: '/search?type=home',
    cta: 'Book Home Visit',
    theme: {
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200/80',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      glowHover: 'group-hover:border-teal-300 group-hover:shadow-teal-500/10',
      btnBg: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25',
      accentText: 'text-teal-600',
    }
  },
  {
    title: 'Priority Clinic OPD Booking',
    badge: 'Zero Waiting Time',
    description: 'Skip physical hospital queues. Book confirmed time-slots at top accredited clinics with verified specialists and instant token confirmation.',
    features: ['Confirmed Token Generation', 'Verified Multi-Specialty Clinics', 'Easy Rescheduling & Cancellations'],
    icon: Building2,
    href: '/search?type=opd',
    cta: 'Find Clinics',
    theme: {
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200/80',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      glowHover: 'group-hover:border-sky-300 group-hover:shadow-sky-500/10',
      btnBg: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25',
      accentText: 'text-sky-600',
    }
  },
  {
    title: 'Digital EHR & Health Vault',
    badge: 'HIPAA & ABDM Compliant',
    description: 'Access and organize your lifetime medical records — prescriptions, lab reports, radiology scans, and discharge summaries in one secure vault.',
    features: ['Chronological Health Timeline', 'Direct PDF Downloads', 'Safe Doctor-Patient Sharing'],
    icon: FileText,
    href: '/patient/records',
    cta: 'Open Health Vault',
    theme: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      glowHover: 'group-hover:border-purple-300 group-hover:shadow-purple-500/10',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25',
      accentText: 'text-purple-600',
    }
  },
  {
    title: 'Home Diagnostics & Lab Tests',
    badge: 'Home Sample Pickup',
    description: 'Certified phlebotomists collect blood and diagnostic samples right at your home with 100% certified pathology reports delivered digitally in 24 hours.',
    features: ['NABL Accredited Labs', 'Painless Home Sample Collection', 'Reports Delivered on WhatsApp & App'],
    icon: FlaskConical,
    href: '/search?type=lab',
    cta: 'Explore Lab Tests',
    theme: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      glowHover: 'group-hover:border-amber-300 group-hover:shadow-amber-500/10',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
      accentText: 'text-amber-600',
    }
  },
  {
    title: '24/7 AI Health Symptom Checker',
    badge: 'Instant Free Triage',
    description: 'Analyze your symptoms in real-time, assess clinical urgency, and receive smart guidance with direct recommendations for relevant specialists.',
    features: ['Powered by Clinical AI Models', 'Severity & Risk Stratification', 'Direct Specialist Booking Link'],
    icon: Bot,
    href: '/patient/ai-chat',
    cta: 'Check Symptoms Free',
    theme: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200/80',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      glowHover: 'group-hover:border-rose-300 group-hover:shadow-rose-500/10',
      btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
      accentText: 'text-rose-600',
    }
  }
];

export default function ServicesSlider() {
  return (
    <section className="py-20 lg:py-28 relative bg-slate-50/70 border-y border-slate-200/70 overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Core Healthcare Services
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Comprehensive Medical Care,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
              Designed Around You.
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            From instant encrypted video calls to specialist doorstep visits, experience a seamless, technology-driven healthcare ecosystem.
          </p>
        </div>

        {/* 6 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {coreServices.map((svc, index) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group"
              >
                <div className={`h-full flex flex-col justify-between bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden ${svc.theme.glowHover}`}>
                  
                  {/* Top Bar with Icon & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${svc.theme.iconBg}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase ${svc.theme.badgeBg}`}>
                        {svc.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2.5 group-hover:text-slate-950 transition-colors">
                      {svc.title}
                    </h3>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                      {svc.description}
                    </p>

                    {/* Feature Micro-List */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                      {svc.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${svc.theme.accentText}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action CTA Button */}
                  <Link
                    href={svc.href}
                    className={`flex items-center justify-between w-full px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md group-hover:shadow-lg ${svc.theme.btnBg}`}
                  >
                    <span>{svc.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </Link>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-14 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">100% Certified &amp; Verified Medical Practitioners</p>
              <p className="text-xs text-slate-500 font-medium">All healthcare professionals are verified against state medical council registers.</p>
            </div>
          </div>
          
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide transition-all shadow-md hover:scale-105 shrink-0"
          >
            <span>Browse All Doctors</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
