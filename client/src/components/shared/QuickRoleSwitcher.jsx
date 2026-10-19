'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES, setCredentials, logout } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/api/authApi';
import { 
  Sparkles, 
  User, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  LogOut,
  Zap
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: ROLES.PATIENT,
    label: 'Patient Portal',
    subtext: 'Rahul Deshmukh',
    email: 'patient@careconnect.com',
    redirect: '/patient',
    icon: User,
    color: 'from-teal-500 to-emerald-600',
    border: 'hover:border-teal-400'
  },
  {
    role: ROLES.DOCTOR,
    label: 'Doctor Practice',
    subtext: 'Dr. Ritesh Pote',
    email: 'doctor@careconnect.com',
    redirect: '/doctor',
    icon: Stethoscope,
    color: 'from-purple-600 to-indigo-600',
    border: 'hover:border-purple-400'
  },
  {
    role: ROLES.CLINIC_ADMIN,
    label: 'Clinic HQ (SaaS)',
    subtext: 'Apollo Clinic',
    email: 'clinic@careconnect.com',
    redirect: '/clinic',
    icon: Building2,
    color: 'from-blue-600 to-cyan-600',
    border: 'hover:border-blue-400'
  },
  {
    role: ROLES.SUPER_ADMIN,
    label: 'Super Admin',
    subtext: 'CareConnect HQ',
    email: 'admin@careconnect.com',
    redirect: '/admin',
    icon: ShieldCheck,
    color: 'from-amber-500 to-rose-600',
    border: 'hover:border-amber-400'
  }
];

export default function QuickRoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [switchingTo, setSwitchingTo] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const { user, role: currentRole, isAuthenticated } = useSelector((state) => state.auth);

  const handleQuickSwitch = async (account) => {
    setSwitchingTo(account.role);
    try {
      const res = await login({
        email: account.email,
        password: 'Veagle@123',
        role: account.role
      }).unwrap();

      if (res?.data?.accessToken) {
        dispatch(setCredentials({
          user: res.data.user,
          token: res.data.accessToken,
          role: account.role
        }));
      }

      setIsOpen(false);
      router.push(account.redirect);
    } catch (err) {
      // Fallback direct mock state if offline
      dispatch(setCredentials({
        user: { name: account.subtext, email: account.email },
        token: 'mock_jwt_token',
        role: account.role
      }));
      setIsOpen(false);
      router.push(account.redirect);
    } finally {
      setSwitchingTo(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans selection:bg-teal-500 selection:text-white">
      {/* Expanded Modal / Menu */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-3xl bg-slate-900/95 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-2xl text-white animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                1-Click Role Switcher
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 mb-3">
            Switch between personas instantly without typing credentials (password: <code className="text-teal-400">Veagle@123</code>).
          </p>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              const isCurrent = isAuthenticated && (currentRole === acc.role || currentRole === acc.role.replace('_', ''));
              const isSwitching = switchingTo === acc.role;

              return (
                <button
                  key={acc.role}
                  onClick={() => handleQuickSwitch(acc)}
                  disabled={isSwitching}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                    isCurrent 
                      ? 'bg-slate-800 border-teal-500/50 shadow-sm shadow-teal-500/10' 
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${acc.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        {acc.label}
                        {isCurrent && (
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400">{acc.subtext}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isSwitching ? '...' : isCurrent ? 'Active' : 'Switch →'}
                  </span>
                </button>
              );
            })}
          </div>

          {isAuthenticated && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                {user?.name || user?.email || 'Logged In'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <LogOut className="h-3 w-3" /> Log Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700 shadow-xl shadow-slate-950/40 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 group"
      >
        <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-slate-950">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs font-black tracking-wide text-slate-200">
          {isAuthenticated ? (
            <span className="capitalize">{currentRole?.toLowerCase().replace('_', ' ') || 'User'}</span>
          ) : (
            'Role Demo'
          )}
        </span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 text-slate-400 group-hover:-translate-y-0.5 transition-transform" />
        )}
      </button>
    </div>
  );
}
