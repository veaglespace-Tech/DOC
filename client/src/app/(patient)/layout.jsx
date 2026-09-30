'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES, logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { Activity, LayoutDashboard, Search, FileText, Bell, User, Settings, LogOut, HeartPulse, Wallet, Bot } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function PatientLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login/patient');
  };

  return (
    <RoleGuard allowedRoles={[ROLES.PATIENT]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Modern Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex h-20 items-center gap-3 px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Care<span className="text-indigo-600">Connect</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Main Menu</div>
            <nav className="space-y-1.5">
              <Link href="/patient" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
                Dashboard
              </Link>
              <Link href="/patient/search" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                Find Doctors
              </Link>
              <Link href="/patient/appointments" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <HeartPulse className="h-5 w-5 transition-transform group-hover:scale-110" />
                My Appointments
              </Link>
              <Link href="/patient/records" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
                Medical Records
              </Link>
              <Link href="/patient/wallet" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <Wallet className="h-5 w-5 transition-transform group-hover:scale-110" />
                My Wallet
              </Link>
              <Link href="/patient/ai-chat" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-indigo-600 bg-indigo-50/50 transition-all hover:bg-indigo-50 hover:text-indigo-700 border border-indigo-100/50">
                <Bot className="h-5 w-5 transition-transform group-hover:scale-110" />
                AI Symptom Checker
              </Link>
            </nav>

            <div className="mt-10 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Settings</div>
            <nav className="space-y-1.5">
              <Link href="/patient/profile" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                My Profile
              </Link>
              <Link href="/patient/settings" className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                <Settings className="h-5 w-5 transition-transform group-hover:scale-110" />
                Preferences
              </Link>
            </nav>
          </div>

          <div className="p-6">
            <button onClick={handleLogout} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600">
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
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patient Portal</h1>
            </div>
            <div className="flex items-center gap-6">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span>
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-900">{user?.name || 'Patient'}</span>
                  <span className="text-xs font-medium text-slate-500">{user?.email || 'Premium Member'}</span>
                </div>
                <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-indigo-100 bg-indigo-50 p-0.5">
                  <User className="h-full w-full rounded-full bg-indigo-100 text-indigo-500 p-1.5" />
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
