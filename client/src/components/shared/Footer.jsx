import React from 'react';
import Link from 'next/link';
import { Activity, User, Phone, ArrowUpRight, Globe, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-24 pb-12 bg-white/60 backdrop-blur-2xl text-slate-900 border-t border-white/50">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200/60 shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                <Activity className="h-6 w-6 text-teal-500 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">CareConnect</span>
            </Link>
            <p className="text-slate-600 max-w-sm leading-relaxed mb-8 text-lg">
              Revolutionizing healthcare access by bringing premium doctors, intelligent SOS dispatches, and secure EHR vaults into a single luxurious platform.
            </p>
            <div className="flex gap-4">
              {[Globe, Mail, MapPin].map((Icon, i) => (
                <div key={i} className="h-12 w-12 rounded-full bg-white border border-slate-200 shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-500 hover:bg-teal-500 hover:text-white hover:border-teal-400 transition-all duration-300 cursor-pointer hover:shadow-[0_10px_20px_rgba(20,184,166,0.3)]">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 md:pl-10">
            <h4 className="font-bold text-slate-900 mb-8 text-xl tracking-tight">Ecosystem</h4>
            <ul className="space-y-5 text-slate-600 font-medium">
              {[
                { name: 'Patient App Experience', href: '/patient' },
                { name: 'Doctor Portal (Pro)', href: '/doctor' },
                { name: 'Enterprise Clinic Suite', href: '/clinic' },
                { name: 'Super Admin Vault', href: '/admin' }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group flex items-center gap-2 hover:text-teal-600 transition-colors">
                    {link.name} 
                    <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-teal-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-bold text-slate-900 mb-8 text-xl tracking-tight">Legal & Trust</h4>
            <ul className="space-y-5 text-slate-600 font-medium">
              <li><Link href="#" className="hover:text-sky-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition-colors flex items-center gap-2">HIPAA Compliance <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div></Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition-colors">System Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-medium text-slate-500">© 2026 CareConnect Healthcare SaaS. Designed for excellence.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
