'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ROLES, setCredentials } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/api/authApi';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { 
  Activity, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  User,
  Stethoscope,
  Building2,
  Sparkles,
  HeartPulse,
  Clock,
  Star,
  FileText,
  Wallet,
  ShieldAlert
} from 'lucide-react';

const PORTALS = [
  {
    id: 'patient',
    name: 'Patient',
    icon: User,
    role: ROLES.PATIENT,
    title: 'Patient Portal',
    subtext: 'Access appointment bookings, EHR medical records & live consultations.',
    demoEmail: 'patient@doctoroncall.com',
    demoPass: 'Veagle@123',
    badge: 'Patient Access',
    bannerTitle: 'Your Health in the Palm of Your Hand.',
    bannerDesc: 'Consult with verified doctors online, schedule home visits, and maintain encrypted medical vault records 24/7.',
    image: '/images/patient-app.jpg',
    gradient: 'from-teal-600 via-emerald-800 to-slate-950',
    cards: [
      { icon: HeartPulse, title: 'Doctor Home Consultations', desc: 'Top verified doctors at your doorstep', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      { icon: FileText, title: '256-bit Encrypted Health Vault', desc: 'Secure prescriptions & lab reports', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { icon: Clock, title: 'Instant Video Consultation', desc: 'Top medical specialists on duty', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    ],
    theme: {
      tabActive: 'bg-teal-600 text-white shadow-md shadow-teal-600/30',
      badge: 'bg-teal-50 text-teal-700 border-teal-200/80',
      btn: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/25',
      ring: 'focus:border-teal-500 focus:ring-teal-500/15',
      link: 'text-teal-600 hover:text-teal-700'
    },
    registerHref: '/register/patient',
    registerText: 'Create Patient Account Free'
  },
  {
    id: 'doctor',
    name: 'Doctor',
    icon: Stethoscope,
    role: ROLES.DOCTOR,
    title: 'Doctor Practice',
    subtext: 'Manage clinical consults, e-prescriptions, and 24h escrow settlements.',
    demoEmail: 'doctor@doctoroncall.com',
    demoPass: 'Veagle@123',
    badge: 'Verified Medical Practitioner',
    bannerTitle: 'Elevate Your Medical Practice.',
    bannerDesc: 'Accept nearby callouts within your 15km practice radius, issue MCI compliant digital Rx, and receive automated payouts.',
    image: '/images/doctor-tablet.jpg',
    gradient: 'from-slate-800 via-indigo-950 to-slate-950',
    cards: [
      { icon: Stethoscope, title: 'Active Patient Roster', desc: 'Next consultation in 10 mins', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      { icon: Wallet, title: '24h Escrow Settlements', desc: 'Automated direct bank payouts', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { icon: ShieldCheck, title: 'MCI Verified Credentialing', desc: '100% legal digital signature Rx', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    ],
    theme: {
      tabActive: 'bg-slate-900 text-white shadow-md shadow-slate-900/30',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      btn: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25',
      ring: 'focus:border-slate-800 focus:ring-slate-800/15',
      link: 'text-slate-900 hover:underline'
    },
    registerHref: '/register/doctor',
    registerText: 'Register as Verified Doctor'
  },
  {
    id: 'clinic',
    name: 'Clinic HQ',
    icon: Building2,
    role: ROLES.CLINIC_ADMIN,
    title: 'Clinic & Hospital HQ',
    subtext: 'Multi-tenant SaaS dashboard, live OPD tokens, and institutional ledger.',
    demoEmail: 'clinic@doctoroncall.com',
    demoPass: 'Veagle@123',
    badge: 'Enterprise Healthcare SaaS',
    bannerTitle: 'Streamline Your Clinical Network.',
    bannerDesc: 'Coordinate multiple doctor rotas, manage real-time lobby OPD tokens, and reconcile GST invoices seamlessly.',
    image: '/images/hero-clinic.jpg',
    gradient: 'from-blue-600 via-indigo-950 to-slate-950',
    cards: [
      { icon: Building2, title: 'Live OPD Token Queue', desc: 'Real-time patient lobby synchronization', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
      { icon: FileText, title: 'GST Billing Ledger', desc: 'Automated institutional tax reports', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      { icon: CheckCircle, title: 'Multi-Doctor Scheduling', desc: 'Bed & consultation room sync', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    ],
    theme: {
      tabActive: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
      btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
      ring: 'focus:border-blue-600 focus:ring-blue-600/15',
      link: 'text-blue-600 hover:text-blue-700'
    },
    registerHref: '/#contact',
    registerText: 'Partner with Us / Clinic Onboarding'
  },
  {
    id: 'admin',
    name: 'Super Admin',
    icon: ShieldCheck,
    role: ROLES.SUPER_ADMIN,
    title: 'Super Admin HQ',
    subtext: 'Platform control panel, doctor KYC approvals, and system audit logs.',
    demoEmail: 'admin@doctoroncall.com',
    demoPass: 'Veagle@123',
    badge: 'Platform Super Admin',
    bannerTitle: 'System-wide Governance & Compliance.',
    bannerDesc: 'Real-time doctor KYC approvals, razorpay escrow releases, and immutable HIPAA audit trail verification.',
    image: '/images/about-hospital.jpg',
    gradient: 'from-indigo-600 via-purple-950 to-slate-950',
    cards: [
      { icon: ShieldAlert, title: 'Doctor KYC Approvals', desc: 'Medical license verification workflow', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      { icon: Wallet, title: 'Escrow Settlement Desk', desc: 'Razorpay payout releases with audit', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      { icon: ShieldCheck, title: 'Immutable Audit Trail', desc: 'Zero data tampering logs in real-time', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    ],
    theme: {
      tabActive: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25',
      ring: 'focus:border-indigo-600 focus:ring-indigo-600/15',
      link: 'text-indigo-600 hover:text-indigo-700'
    },
    registerHref: null,
    registerText: null
  }
];

function DynamicLoginForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const returnUrl = searchParams.get('returnUrl');
  const returnQuery = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';

  const rawRole = (params?.role || 'patient').toLowerCase();
  const activePortal = PORTALS.find(p => p.id === rawRole) || PORTALS[0];

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAutofillDemo = () => {
    setEmail(activePortal.demoEmail);
    setPassword(activePortal.demoPass);
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      const res = await login({ email, password, role: activePortal.role }).unwrap();
      const payload = res?.data || res;

      if (payload?.accessToken) {
        const assignedRole = payload.user?.roles?.[0] || activePortal.role;
        dispatch(setCredentials({
          user: payload.user,
          token: payload.accessToken,
          role: assignedRole
        }));
      }

      if (returnUrl) {
        router.push(returnUrl);
      } else if (activePortal.id === 'patient') {
        router.push('/patient');
      } else if (activePortal.id === 'doctor') {
        router.push('/doctor');
      } else if (activePortal.id === 'clinic') {
        router.push('/clinic');
      } else if (activePortal.id === 'admin') {
        router.push('/admin');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Login failed. Please verify your email and password.');
    }
  };

  const PortalIcon = activePortal.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      {/* 🌟 UNIFIED TOP NAVBAR */}
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        {/* 🌟 MAIN TWO-COLUMN CONTAINER */}
        <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* 🌟 LEFT COLUMN (Login Form - 7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            <div>
              {/* Role Header Info */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${activePortal.theme.badge}`}>
                  <PortalIcon className="h-3.5 w-3.5" />
                  <span>{activePortal.badge}</span>
                </div>
                <Link 
                  href="/login" 
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  All Portals &rarr;
                </Link>
              </div>

              {/* 🌟 ROLE SELECTOR TABS */}
              <div className="mb-6">
                <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1">
                  {PORTALS.map((portal) => {
                    const Icon = portal.icon;
                    const isActive = activePortal.id === portal.id;
                    return (
                      <Link
                        key={portal.id}
                        href={`/login/${portal.id}${returnQuery}`}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                          isActive 
                            ? activePortal.theme.tabActive
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{portal.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Title & Subtext */}
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {activePortal.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {activePortal.subtext}
                </p>
              </div>

              {/* ReturnUrl Booking Alert */}
              {returnUrl && activePortal.id === 'patient' && (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/90 text-teal-900 text-xs font-semibold flex items-center gap-2.5 mb-5 shadow-xs">
                  <div className="h-2 w-2 rounded-full bg-teal-600 animate-ping shrink-0" />
                  <span>Doctor appointment booking requires patient login. Please sign in to complete.</span>
                </div>
              )}

              {/* ⚡ Quick 1-Click Demo Credentials Pill */}
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="w-full mb-5 flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800">Demo Account: </span>
                    <span className="text-xs text-slate-500 font-mono">{activePortal.demoEmail}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 group-hover:underline shrink-0 pl-2">
                  1-Click Auto-fill &rarr;
                </span>
              </button>

              {/* The Form */}
              <form className="space-y-4" onSubmit={handleLogin}>
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={activePortal.demoEmail}
                      className={`block w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white outline-none transition-all font-medium ${activePortal.theme.ring}`} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                  <div className="relative group">
                    <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white outline-none transition-all font-medium ${activePortal.theme.ring}`} 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-3.5 w-3.5 text-slate-900 border-slate-300 rounded cursor-pointer" />
                    <label htmlFor="remember-me" className="ml-2 block text-slate-600 font-semibold cursor-pointer">Remember me</label>
                  </div>
                  <a href="#" className="font-bold text-slate-500 hover:text-slate-900 transition-colors">Forgot password?</a>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold shadow-md transition-all hover:opacity-95 hover:scale-[1.005] active:scale-[0.995] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${activePortal.theme.btn}`}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Sign in to {activePortal.name} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Registration or Help Info */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              {activePortal.registerHref ? (
                <p className="text-slate-500 font-medium text-center sm:text-left">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href={`${activePortal.registerHref}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                    className={`font-bold ${activePortal.theme.link}`}
                  >
                    {activePortal.registerText}
                  </Link>
                </p>
              ) : (
                <p className="text-slate-400 font-medium text-center sm:text-left">
                  Super Admin access is restricted to authorized platform personnel only.
                </p>
              )}

              <div className="flex items-center gap-1.5 text-slate-400 font-semibold shrink-0">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit HIPAA Encryption</span>
              </div>
            </div>
          </div>

          {/* 🌟 RIGHT COLUMN (Branded Visual Showcase - 5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 relative p-8 sm:p-10 flex-col justify-between overflow-hidden bg-slate-950">
            {/* Background Image with soft visibility */}
            <Image 
              src={activePortal.image} 
              alt="Doctor On Call Experience" 
              fill 
              className="object-cover opacity-25 mix-blend-luminosity"
              priority
            />
            {/* Branded Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activePortal.gradient} opacity-95`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Top Floating Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Doctor On Call Network</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Middle: 3 Floating Live Feature Cards */}
            <div className="relative z-10 my-8 space-y-3.5">
              {activePortal.cards.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-white shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${card.color}`}>
                        <CardIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">{card.title}</p>
                        <p className="text-[11px] text-slate-300 font-medium truncate">{card.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Content & Quote */}
            <div className="relative z-10 border-t border-white/15 pt-6">
              <h3 className="text-2xl font-black text-white leading-tight mb-2">
                {activePortal.bannerTitle}
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {activePortal.bannerDesc}
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* 🌟 UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}

export default function DynamicLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500 font-bold">
        Loading Portal...
      </div>
    }>
      <DynamicLoginForm />
    </Suspense>
  );
}
