import React from 'react';
import Link from 'next/link';
import { Activity, ChevronDown, User, Stethoscope } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Care<span className="text-teal-600">Connect</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <Link href="/#services" className="hover:text-teal-600 transition-colors">Services</Link>
          <Link href="/#portals" className="hover:text-teal-600 transition-colors">Portals</Link>
          <Link href="/about" className="hover:text-teal-600 transition-colors">About Us</Link>
          <Link href="/#testimonials" className="hover:text-teal-600 transition-colors">Reviews</Link>
        </div>
        
        <div className="flex items-center gap-4">
          
          {/* Sign In Dropdown */}
          <div className="relative group hidden md:block">
            <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors px-4 py-2">
              Sign In <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 overflow-hidden">
              <Link href="/login/patient" className="flex items-center gap-3 px-4 py-3.5 hover:bg-teal-50 text-sm font-bold text-slate-700 hover:text-teal-700 transition-colors border-b border-slate-50">
                <User className="h-4 w-4" /> Patient Login
              </Link>
              <Link href="/login/doctor" className="flex items-center gap-3 px-4 py-3.5 hover:bg-teal-50 text-sm font-bold text-slate-700 hover:text-teal-700 transition-colors">
                <Stethoscope className="h-4 w-4" /> Doctor Login
              </Link>
            </div>
          </div>

          {/* Get Started Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5">
              Get Started <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 overflow-hidden">
              <Link href="/register/patient" className="flex items-center gap-3 px-4 py-3.5 hover:bg-emerald-50 text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors border-b border-slate-50">
                <User className="h-4 w-4 text-emerald-600" /> I'm a Patient
              </Link>
              <Link href="/register/doctor" className="flex items-center gap-3 px-4 py-3.5 hover:bg-teal-50 text-sm font-bold text-slate-700 hover:text-teal-700 transition-colors">
                <Stethoscope className="h-4 w-4 text-teal-600" /> I'm a Doctor
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
