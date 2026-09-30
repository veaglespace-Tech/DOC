import React from 'react';
import Link from 'next/link';
import { Activity, User, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Activity className="h-6 w-6 text-teal-600" />
              <span className="text-2xl font-extrabold text-slate-900">CareConnect</span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Revolutionizing healthcare access by bringing premium doctors, intelligent SOS dispatches, and secure EHR vaults into a single luxurious platform.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Portals</h4>
            <ul className="space-y-4 text-slate-600 font-medium">
              <li><Link href="/patient" className="hover:text-teal-600 transition-colors">Patient Login</Link></li>
              <li><Link href="/doctor" className="hover:text-teal-600 transition-colors">Doctor Dashboard</Link></li>
              <li><Link href="/clinic" className="hover:text-teal-600 transition-colors">Clinic Management</Link></li>
              <li><Link href="/admin" className="hover:text-teal-600 transition-colors">Super Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-600 font-medium">
              <li><Link href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-teal-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-teal-600 transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-slate-500">© 2026 CareConnect Healthcare SaaS. Designed for excellence.</p>
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-teal-500 hover:text-white transition-colors cursor-pointer">
              <User className="h-4 w-4" />
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-teal-500 hover:text-white transition-colors cursor-pointer">
              <Phone className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
