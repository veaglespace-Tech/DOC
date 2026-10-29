import React from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowUpRight, Globe, Mail, MapPin, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-20 pb-12 bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Subtle Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Doctor<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> On Call</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6 text-sm font-medium">
              Enterprise healthcare network connecting certified medical practitioners, multi-specialty clinics, and patients with instant 5km GPS emergency dispatches and encrypted Electronic Health Records (EHR).
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Phone, label: 'Helpline' },
                { icon: Mail, label: 'Email Support' },
                { icon: MapPin, label: 'Headquarters' },
                { icon: Globe, label: 'Global Portal' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    title={item.label}
                    className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/40 transition-all cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="md:col-span-4 md:pl-10">
            <h4 className="font-bold text-white mb-6 text-sm tracking-wider uppercase text-slate-200">Clinical Ecosystem</h4>
            <ul className="space-y-3.5 text-slate-400 font-medium text-xs">
              {[
                { name: 'Patient Experience Portal', href: '/patient' },
                { name: 'Doctor Practice Workspace', href: '/doctor' },
                { name: 'Find Doctors & Specialists', href: '/search' },
                { name: 'Enterprise Clinic Suite', href: '/clinic' },
                { name: 'Super Admin Operations HQ', href: '/admin' }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group flex items-center gap-2 hover:text-indigo-400 transition-colors">
                    {link.name} 
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-indigo-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-bold text-white mb-6 text-sm tracking-wider uppercase text-slate-200">Compliance & Security</h4>
            <ul className="space-y-3.5 text-slate-400 font-medium text-xs">
              <li>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> 
                  <span>HIPAA & MCI Compliant</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                  <span>256-bit AES EHR Vault</span>
                </div>
              </li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Data Governance</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Medical Service</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">System Health Status</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-bold text-[11px]">All Regional Gateways Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
