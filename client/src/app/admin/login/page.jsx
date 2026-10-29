'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { ROLES, setCredentials } from '@/store/slices/authSlice';
import { useAdminLoginMutation } from '@/store/api/authApi';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ShieldAlert, KeyRound, ArrowRight, Lock, Activity } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [email, setEmail] = useState('admin@doctoroncall.com');
  const [password, setPassword] = useState('Veagle@123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      const res = await adminLogin({ email, password }).unwrap();
      const payload = res?.data || res;
      if (payload?.accessToken) {
        dispatch(setCredentials({
          user: payload.user,
          token: payload.accessToken,
          role: payload.user?.roles?.[0] || 'SUPERADMIN'
        }));
        localStorage.setItem('careconnect_token', payload.accessToken);
        localStorage.setItem('careconnect_auth', JSON.stringify({
          user: payload.user,
          token: payload.accessToken,
          role: payload.user?.roles?.[0] || 'SUPERADMIN'
        }));
      }
      router.push('/admin');
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* 🌟 UNIFIED TOP NAVBAR */}
      <Navbar />

      <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
        <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-xl shadow-sm border border-slate-700/50">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
        </Link>
        {/* Background glowing effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-teal-500/10 blur-[120px] pointer-events-none"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mt-10">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6">
          <div className="h-10 w-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Doctor<span className="text-teal-400"> On Call</span> <span className="text-slate-500 font-medium text-xl">| Admin</span></span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
          System Authentication
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 font-medium">
          Authorized personnel only. All access is logged.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl py-10 px-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2rem] sm:px-10 border border-slate-700/50">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Admin Identifier</label>
              <div className="relative">
                <KeyRound className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all font-medium" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Master Password</label>
              <div className="relative">
                <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all font-medium" 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 font-medium">Trust this device</label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-teal-500/20 text-sm font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
              ) : (
                <>Authenticate <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-medium text-slate-500">
            <span className="flex items-center justify-center gap-1.5 uppercase tracking-wider">
              <Activity className="h-3 w-3 text-red-400" /> Secure Server Node Connected
            </span>
          </div>
        </div>
      </div>
    </main>

    {/* 🌟 UNIFIED FOOTER */}
    <Footer />
  </div>
  );
}
