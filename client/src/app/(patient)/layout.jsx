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
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-2xl bg-white p-1 border border-slate-200/80 shadow-md shadow-indigo-600/10 overflow-hidden flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Veagle Space Technology Logo" 
              width={40} 
              height={40} 
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
              Veagle<span className="text-indigo-600"> Space</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Patient Portal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Quick Action in Sidebar */}
        <Link
          href="/patient/search"
          onClick={() => setMobileNavOpen(false)}
          className="group flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Search className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-black tracking-wide uppercase">Book Doctor</div>
              <div className="text-[10px] text-indigo-100 font-medium">Verified Home & Video Visits</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 opacity-75 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div>
          <div className="mb-2.5 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Clinical Menu
          </div>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                      : item.highlight
                      ? 'text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/50'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="mb-2.5 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Support &amp; Profile
          </div>
          <nav className="space-y-1">
            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout} 
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.PATIENT]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* 🌟 DESKTOP STATIC SIDEBAR */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-slate-200/70 bg-white/90 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
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
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white shadow-2xl lg:hidden"
              >
                <div className="absolute top-5 right-4 z-10">
                  <button 
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
                    aria-label="Close navigation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {renderNavContent()}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 🌟 MAIN CONTENT AREA (RESPONSIVE PADDING) */}
        <div className="flex flex-1 flex-col lg:pl-72 pl-0 min-w-0 transition-all">
          {/* Glassmorphism Top Header */}
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 sm:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                <Menu className="h-6 w-6" />
              </button>

              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
                Patient Cloud
              </span>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                Doctor On Call Healthcare Suite
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/patient/search"
                className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider hover:bg-indigo-100 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Find Doctors</span>
                <span className="sm:hidden">Search</span>
              </Link>

              <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-4 border-l border-slate-200">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-black text-slate-900">{user?.name || 'Patient'}</span>
                  <span className="text-[11px] font-medium text-slate-400">{user?.email || 'Verified Account'}</span>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center shadow-md text-sm">
                  {user?.name?.[0] || 'P'}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
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
