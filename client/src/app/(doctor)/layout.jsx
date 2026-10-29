'use client';

import React, { useState } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES, logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { 
  Activity, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  Settings, 
  LogOut, 
  Clock, 
  Stethoscope, 
  User, 
  ShieldCheck, 
  ArrowRightLeft,
  Menu,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardFooter from '@/components/shared/DashboardFooter';

export default function DoctorLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login/doctor');
  };

  const practiceLinks = [
    { href: '/doctor', label: 'Clinical Overview', icon: LayoutDashboard },
    { href: '/doctor/appointments', label: 'Consultations & Schedule', icon: Calendar },
    { href: '/doctor/availability', label: 'Working Hours & Slots', icon: Clock },
    { href: '/doctor/handovers', label: 'Clinical Handovers', icon: ArrowRightLeft },
    { href: '/doctor/patients', label: 'My Patients & EHR', icon: Users },
  ];

  const adminLinks = [
    { href: '/doctor/wallet', label: 'Wallet & Bank Payouts', icon: Wallet },
    { href: '/doctor/kyc', label: 'MCI & KYC Credentials', icon: ShieldCheck },
    { href: '/doctor/settings', label: 'Practice Settings', icon: Settings },
  ];

  const renderNavContent = () => (
    <>
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30 text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
              Doctor<span className="text-purple-600">Practice</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Doctor Workspace
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <div className="mb-2.5 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Clinical Care
          </div>
          <nav className="space-y-1">
            {practiceLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
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

        <div>
          <div className="mb-2.5 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Practice Administration
          </div>
          <nav className="space-y-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
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
    <RoleGuard allowedRoles={[ROLES.DOCTOR]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-purple-500 selection:text-white">
        
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

              <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-wider">
                Doctor Cloud
              </span>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                Verified MCI Practice Suite
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 sm:px-3.5 py-1.5 border border-emerald-200">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wide hidden sm:inline">Accepting Consultations</span>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wide sm:hidden">Online</span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-4 border-l border-slate-200">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-black text-slate-900">{user?.name ? `Dr. ${user.name}` : 'Doctor'}</span>
                  <span className="text-[11px] font-medium text-slate-400">{user?.email || 'MCI Licensed'}</span>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center shadow-md text-sm">
                  {user?.name?.[0] || 'D'}
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
