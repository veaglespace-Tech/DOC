'use client';

import React, { useState } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES, logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Activity, 
  LayoutDashboard, 
  Search, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  HeartPulse, 
  Wallet, 
  Bot, 
  AlertTriangle, 
  LifeBuoy,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardFooter from '@/components/shared/DashboardFooter';

export default function PatientLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login/patient');
  };

  const navLinks = [
    { href: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/search', label: 'Find Doctors', icon: Search },
    { href: '/patient/appointments', label: 'My Appointments', icon: HeartPulse },
    { href: '/patient/records', label: 'Medical Records (EHR)', icon: FileText },
    { href: '/patient/wallet', label: 'Wallet & Payments', icon: Wallet },
    { href: '/patient/ai-chat', label: 'AI Symptom Checker', icon: Bot, highlight: true },
  ];

  const secondaryLinks = [
    { href: '/patient/profile', label: 'My Health Profile', icon: User },
    { href: '/patient/complaints', label: 'Help & Support', icon: LifeBuoy },
    { href: '/patient/settings', label: 'Account Preferences', icon: Settings },
  ];

  const renderNavContent = () => (
    <>
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-xl bg-white p-1 border border-slate-200/80 shadow-xs overflow-hidden flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Veagle Space Technology Logo" 
              width={36} 
              height={36} 
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">
              Veagle<span className="text-indigo-600"> Space</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Patient Portal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">
        {/* Quick Action in Sidebar */}
        <Link
          href="/patient/search"
          onClick={() => setMobileNavOpen(false)}
          className="group flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
              <Search className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-black tracking-wide uppercase leading-tight">Book Doctor</div>
              <div className="text-[9px] text-indigo-100 font-medium leading-tight">Verified Home & Video Visits</div>
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 opacity-75 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <div>
          <div className="mb-1 px-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Clinical Menu
          </div>
          <nav className="space-y-0.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20'
                      : item.highlight
                      ? 'text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/50'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="mb-1 px-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Support &amp; Profile
          </div>
          <nav className="space-y-0.5">
            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 border-t border-slate-100 shrink-0">
        <button 
          onClick={handleLogout} 
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.PATIENT]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* 🌟 DESKTOP STATIC SIDEBAR */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-xs">
          {renderNavContent()}
        </aside>

        {/* 🌟 MOBILE DRAWER OVERLAY */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white shadow-2xl lg:hidden"
              >
                <div className="absolute top-4 right-3 z-10">
                  <button 
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Close navigation"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {renderNavContent()}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 🌟 MAIN CONTENT AREA (RESPONSIVE PADDING) */}
        <div className="flex flex-1 flex-col lg:pl-64 pl-0 min-w-0 transition-all">
          {/* Glassmorphism Top Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-2xs">
            <div className="flex items-center gap-2.5">
              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-black uppercase tracking-wider">
                Patient Cloud
              </span>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                Doctor On Call Healthcare Suite
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/patient/search"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider hover:bg-indigo-100 transition-colors"
              >
                <Search className="h-3 w-3 text-indigo-600" />
                <span className="hidden sm:inline">Find Doctors</span>
                <span className="sm:hidden">Search</span>
              </Link>

              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-black text-slate-900 leading-tight">{user?.name || 'Patient'}</span>
                  <span className="text-[10px] font-medium text-slate-400 leading-tight">{user?.email || 'Verified Account'}</span>
                </div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center shadow-xs text-xs">
                  {user?.name?.[0] || 'P'}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-5 lg:p-6 min-w-0">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

          {/* 🌟 UNIFIED DASHBOARD FOOTER */}
          <DashboardFooter />
        </div>
      </div>
    </RoleGuard>
  );
}
