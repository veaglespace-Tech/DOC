import React from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowUpRight, Globe, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-24 pb-12 bg-slate-800 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-800 shadow-md">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">
                Viola<span className="text-slate-400 font-medium">Care</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-8 text-base">
              Revolutionizing healthcare access by bringing premium doctors, intelligent systems, and secure records into a single modern platform.
            </p>
            <div className="flex gap-4">
              {[Globe, Mail, MapPin].map((Icon, i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-300 cursor-pointer">
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 md:pl-10">
            <h4 className="font-semibold text-white mb-8 text-lg tracking-tight">Ecosystem</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              {[
                { name: 'Patient App Experience', href: '/patient' },
                { name: 'Doctor Portal (Pro)', href: '/doctor' },
                { name: 'Enterprise Clinic Suite', href: '/clinic' },
                { name: 'Staff & Admin Login', href: '/admin/login' }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group flex items-center gap-2 hover:text-white transition-colors">
                    {link.name} 
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-semibold text-white mb-8 text-lg tracking-tight">Legal & Trust</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/hipaa" className="hover:text-white transition-colors flex items-center gap-2">HIPAA Compliance <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div></Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">System Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-slate-500">© 2026 ViolaCare Healthcare. Designed for excellence.</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
