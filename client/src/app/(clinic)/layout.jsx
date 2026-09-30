'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/store/slices/authSlice';
import Link from 'next/link';
import { Building2, LayoutDashboard, Users, UserPlus, Calendar, CreditCard, Settings, Activity, ArrowRight, Bell } from 'lucide-react';

export default function ClinicLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.CLINIC_ADMIN]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
        
        {/* Modern Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex h-20 items-center gap-3 px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Clinic<span className="text-blue-600">HQ</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Management</div>
            <nav className="space-y-1.5">
              <Link href="/clinic" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
                Dashboard
              </Link>
              <Link href="/clinic/doctors" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                <Users className="h-5 w-5 transition-transform group-hover:scale-110" />
                Doctors & Staff
              </Link>
              <Link href="/clinic/appointments" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
                Appointments
              </Link>
              <Link href="/clinic/patients" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                Patient Registry
              </Link>
            </nav>

            <div className="mt-10 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Finance & Config</div>
            <nav className="space-y-1.5">
              <Link href="/clinic/billing" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                <CreditCard className="h-5 w-5 transition-transform group-hover:scale-110" />
                Billing & GST
              </Link>
              <Link href="/clinic/settings" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                <Settings className="h-5 w-5 transition-transform group-hover:scale-110" />
                Clinic Settings
              </Link>
            </nav>
          </div>

          <div className="p-6">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
              <h4 className="text-sm font-bold mb-1 relative z-10">Pro SaaS Plan</h4>
              <p className="text-xs text-slate-400 mb-4 relative z-10">4/10 Doctors Active</p>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-xs font-bold transition-colors hover:bg-blue-400 relative z-10">
                Upgrade Plan <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-600">Apollo Hospital, Pune</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-xl border-2 border-white bg-slate-200 shadow-md">
                <img src="https://ui-avatars.com/api/?name=Admin&background=eff6ff&color=2563eb" alt="Admin" className="h-full w-full object-cover" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="min-h-[calc(100vh-5rem)]">
            {children}
          </div>
        </main>

      </div>
    </RoleGuard>
  );
}
