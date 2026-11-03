import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartPulse, ArrowUpRight, Globe, Mail, MapPin, ShieldCheck, Phone, CheckCircle2, Lock, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-16 sm:pt-20 pb-12 bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-14 sm:mb-16">

          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-5 text-left">
            <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="relative h-11 w-11 rounded-2xl bg-white p-1 border border-slate-700/80 shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-all overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="Veagle Space Technology Logo"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Veagle<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"> Space</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Doctor On Call Network
                </span>
              </div>
            </Link>
            
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6 text-xs sm:text-sm font-medium">
              Enterprise healthcare network connecting certified medical practitioners, multi-specialty clinics, and patients with instant doorstep home consultations, HD video visits, and encrypted Electronic Health Records (EHR).
            </p>

            <div className="flex items-center gap-2.5">
              {[
                { icon: Phone, label: 'Helpline: 1-800-CARE-911', href: 'tel:18002663911' },
                { icon: Mail, label: 'Email: support@doctoroncall.health', href: 'mailto:support@doctoroncall.health' },
                { icon: Globe, label: 'Global Network', href: '/' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    title={item.label}
                    className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/40 transition-all cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Clinical Ecosystem Links */}
          <div className="md:col-span-4 md:pl-6 text-left">
            <h4 className="font-bold text-white mb-5 text-xs sm:text-sm tracking-wider uppercase text-slate-200">
              Clinical Ecosystem
            </h4>
            <ul className="space-y-3 text-slate-400 font-medium text-xs sm:text-sm">
              {[
                { name: 'Patient Experience Portal', href: '/patient' },
                { name: 'Doctor Practice Workspace', href: '/doctor' },
                { name: 'Find Doctors & Specialists', href: '/search' },
                { name: 'Enterprise Clinic Suite', href: '/clinic' },
                { name: 'SaaS Plans & Pricing', href: '/pricing' },
                { name: 'Super Admin Operations HQ', href: '/admin' }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-indigo-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Compliance & Security */}
          <div className="md:col-span-3 text-left">
            <h4 className="font-bold text-white mb-5 text-xs sm:text-sm tracking-wider uppercase text-slate-200">
              Compliance &amp; Trust
            </h4>
            <ul className="space-y-3 text-slate-400 font-medium text-xs sm:text-sm">
              <li>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>HIPAA &amp; MCI Compliant</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Lock className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>256-bit AES EHR Vault</span>
                </div>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors block">
                  Privacy &amp; Data Governance
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors block">
                  Terms of Medical Service
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>System Health Status</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Live Status Pill */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 text-center sm:text-left">
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="https://veaglespace.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors"
            >
              Veagle Space Technology Pvt. Ltd.
            </a>{' '}
            | &copy; 2026 All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span className="text-slate-300 font-bold text-[10px] sm:text-[11px]">All Regional Gateways Active • 99.98% SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
