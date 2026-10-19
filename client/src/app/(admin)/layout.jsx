'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES, logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileCheck, 
  Receipt, 
  MessageSquare, 
  ShieldCheck, 
  LogOut, 
  Activity,
  Users,
  Bell
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login/admin');
  };

  const navLinks = [
    { href: '/admin', label: 'Operations Overview', icon: LayoutDashboard },
    { href: '/admin/kyc', label: 'Doctor KYC Approvals', icon: FileCheck },
    { href: '/admin/billing', label: 'GST & Platform Billing', icon: Receipt },
  ];

  return (
    <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
      <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Modern Admin Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex h-20 items-center gap-3 px-8 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                Care<span className="text-indigo-600">Admin</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Super Admin HQ
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            <div>
              <div className="mb-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Administration
              </div>
              <nav className="space-y-1.5">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="px-4">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 text-white shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">System Healthy</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">MySQL & Redis Active</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated settlement & audit logs online.</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Sign Out of Admin
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col pl-72">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/50 bg-white/70 px-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold uppercase tracking-wider">
                Control Center
              </span>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                CareConnect Healthcare Cloud
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-slate-900">{user?.name || 'Super Admin'}</div>
                <div className="text-[11px] font-medium text-slate-400">{user?.email || 'admin@careconnect.health'}</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center shadow-md">
                {user?.name?.[0] || 'A'}
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>

      </div>
    </RoleGuard>
  );
}
