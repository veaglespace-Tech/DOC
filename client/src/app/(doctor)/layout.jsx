import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/store/slices/authSlice';
import Link from 'next/link';
import { Activity, LayoutDashboard, Calendar, Users, Wallet, Settings, LogOut, Clock, Stethoscope } from 'lucide-react';

export default function DoctorLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.DOCTOR]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-purple-500 selection:text-white">
        
        {/* Modern Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex h-20 items-center gap-3 px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Care<span className="text-purple-600">Connect</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Practice</div>
            <nav className="space-y-1.5">
              <Link href="/doctor" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-600">
                <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
                Overview
              </Link>
              <Link href="/doctor/appointments" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-600">
                <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
                Appointments
              </Link>
              <Link href="/doctor/availability" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-600">
                <Clock className="h-5 w-5 transition-transform group-hover:scale-110" />
                Availability
              </Link>
              <Link href="/doctor/patients" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-600">
                <Users className="h-5 w-5 transition-transform group-hover:scale-110" />
                My Patients
              </Link>
            </nav>

            <div className="mt-10 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Finance & Settings</div>
            <nav className="space-y-1.5">
              <Link href="/doctor/wallet" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-600">
                <Wallet className="h-5 w-5 transition-transform group-hover:scale-110" />
                Wallet & Earnings
              </Link>
              <Link href="/doctor/settings" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-purple-50 hover:text-purple-600">
                <Settings className="h-5 w-5 transition-transform group-hover:scale-110" />
                Settings
              </Link>
            </nav>
          </div>

          <div className="p-6">
            <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600">
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col pl-72">
          {/* Glassmorphism Top Header */}
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/50 bg-white/60 px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Doctor Workspace</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 border border-emerald-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-700">Online & Accepting Requests</span>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-900">Dr. Sarah Connor</span>
                  <span className="text-xs font-medium text-slate-500">Cardiologist</span>
                </div>
                <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-purple-100 bg-purple-50 p-0.5">
                  <img src="https://i.pravatar.cc/150?u=DOC-01" alt="Doctor" className="h-full w-full rounded-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
