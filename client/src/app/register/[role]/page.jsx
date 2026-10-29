'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Activity, Mail, Lock, ArrowRight, User, Phone, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { ROLES } from '@/store/slices/authSlice';
import { useRegisterMutation } from '@/store/api/authApi';

function DynamicRegisterForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const roleParam = params.role?.toLowerCase() === 'doctor' ? ROLES.DOCTOR : ROLES.PATIENT;
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      await register({
        name,
        email,
        phone,
        password,
        role: roleParam
      }).unwrap();

      const returnQuery = returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : '';
      if (roleParam === ROLES.PATIENT) router.push(`/login/patient?registered=true${returnQuery}`);
      if (roleParam === ROLES.DOCTOR) router.push(`/login/doctor?registered=true${returnQuery}`);
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* 🌟 UNIFIED TOP NAVBAR */}
      <Navbar />

      <main className="flex-1 flex selection:bg-teal-500 selection:text-white">
        {/* 🌟 LEFT HALF (Form) */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative py-12">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
        </Link>
        
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-3 mb-10 mt-6 md:mt-0">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-500/30">
              <Activity className="h-7 w-7" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor<span className="text-teal-600"> On Call</span></span>
          </Link>
          
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create an Account
          </h2>
          <p className="text-base text-slate-500 font-medium mb-6">
            Register as a {roleParam === ROLES.PATIENT ? 'Patient' : 'Healthcare Professional'} to access services.
          </p>

          {/* ReturnUrl Booking Alert */}
          {returnUrl && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/90 text-teal-900 text-xs sm:text-sm font-semibold flex items-center gap-3 mb-6 shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-teal-600 animate-ping shrink-0" />
              <span>Registering will allow you to complete your doctor appointment booking seamlessly.</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative group">
                <User className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
              <div className="relative group">
                <Mail className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative group">
                <Phone className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Create Password</label>
              <div className="relative group">
                <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium" 
                  required 
                />
              </div>
            </div>

            <div className="flex items-start mt-4">
              <input id="terms" type="checkbox" className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer accent-teal-600" required />
              <label htmlFor="terms" className="ml-2 block text-xs text-slate-500 font-bold leading-relaxed cursor-pointer">
                I agree to the <span className="text-teal-600">Terms of Service</span> and <span className="text-teal-600">Privacy Policy</span>, including the secure handling of my medical data.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl shadow-xl shadow-teal-500/20 text-base font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create {roleParam === ROLES.PATIENT ? 'Patient' : 'Doctor'} Account <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>

          {/* Already have an account link */}
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link 
              href={`/login/${roleParam === ROLES.PATIENT ? 'patient' : 'doctor'}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
              className="font-bold text-teal-600 hover:text-teal-700 transition-colors underline underline-offset-2"
            >
              Log In
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 py-3 rounded-xl border border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> 256-bit HIPAA Compliant Encryption
          </div>
        </div>
      </div>

      {/* 🌟 RIGHT HALF (Image & Overlay) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-slate-900">
        <Image 
          src={roleParam === ROLES.PATIENT ? "/images/patient-app.jpg" : "/images/hero-clinic.jpg"} 
          alt="Doctor On Call Premium Experience" 
          fill 
          className="object-cover opacity-80 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 to-slate-900/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        {/* Floating Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-16 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/20 px-5 py-2 text-sm font-bold text-teal-300 mb-6 backdrop-blur-md w-fit">
            <ShieldCheck className="h-4 w-4" />
            {roleParam === ROLES.PATIENT ? "Secure & Private" : "Verified Professional Network"}
          </div>
          <h3 className="text-4xl font-extrabold text-white leading-tight mb-4">
            {roleParam === ROLES.PATIENT 
              ? "Join India's most trusted healthcare network." 
              : "Expand your practice securely."}
          </h3>
          <p className="text-lg text-slate-300 font-medium max-w-lg leading-relaxed">
            {roleParam === ROLES.PATIENT 
              ? "Experience world-class medical care, completely secured by enterprise-grade encryption. Your data is yours alone." 
              : "Join a network of top-rated specialists. We handle the bookings, payments, and EHR so you can focus on healing."}
          </p>
        </div>
      </div>
    </main>

    {/* 🌟 UNIFIED FOOTER */}
    <Footer />
  </div>
  );
}

export default function DynamicRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-slate-500 font-bold">
        Loading Registration...
      </div>
    }>
      <DynamicRegisterForm />
    </Suspense>
  );
}
