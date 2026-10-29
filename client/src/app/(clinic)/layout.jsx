'use client';

import React, { useState } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/store/slices/authSlice';
import Link from 'next/link';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  CreditCard, 
  Settings, 
  Bell, 
  Menu, 
  X 
} from 'lucide-react';
import { useGetMyClinicQuery } from '@/store/api/saasApi';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardFooter from '@/components/shared/DashboardFooter';

export default function ClinicLayout({ children }) {
  const { data: clinicData } = useGetMyClinicQuery();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const clinic = clinicData?.data?.organization || { name: 'Apollo Clinic, Pune', plan: { name: 'Clinic Professional' } };
  const usage = clinicData?.data?.usage || { currentDoctors: 4, maxDoctors: 15 };

  const renderNavContent = () => (
    <>
      <div className="flex h-20 items-center gap-3 px-8 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Clinic<span className="text-blue-600">HQ</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Management</div>
        <nav className="space-y-1.5">
          {[
            { href: '/clinic', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/clinic/doctors', label: 'Doctors & Staff', icon: Users },
            { href: '/clinic/appointments', label: 'Appointments', icon: Calendar },
            { href: '/clinic/patients', label: 'Patient Registry', icon: UserPlus },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Finance &amp; Config</div>
        <nav className="space-y-1.5">
          {[
            { href: '/clinic/billing', label: 'Billing & GST', icon: CreditCard },
            { href: '/clinic/settings', label: 'Clinic Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-4 rounded-2xl border">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
          <span>Doctor Slots</span>
          <span>{usage.currentDoctors} / {usage.maxDoctors}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.round((usage.currentDoctors / (usage.maxDoctors || 1)) * 100))}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-medium block mt-1">Tier: {clinic.plan?.name || 'Professional'}</span>
      </div>
    </>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.CLINIC_ADMIN]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
        
        {/* 🌟 DESKTOP STATIC SIDEBAR */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
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
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 sm:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                <Menu className="h-6 w-6" />
              </button>

              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider">
                Clinic Cloud
              </span>
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">{clinic.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl border-2 border-white bg-slate-200 shadow-md">
                <img src="https://ui-avatars.com/api/?name=Admin&background=eff6ff&color=2563eb" alt="Admin" className="h-full w-full object-cover" />
              </div>
            </div>
          </header>

          {/* Page Content */}
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
