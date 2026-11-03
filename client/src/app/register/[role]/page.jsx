'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { 
  User, 
  Stethoscope, 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  HeartPulse, 
  Clock, 
  FileText,
  Sparkles,
  Wallet
} from 'lucide-react';
import { ROLES } from '@/store/slices/authSlice';
import { useRegisterMutation } from '@/store/api/authApi';

const REGISTER_ROLES = [
  {
    id: 'patient',
    name: 'Patient',
    icon: User,
    role: ROLES.PATIENT,
    title: 'Create Patient Account',
    subtext: 'Join to book doctor visits, video consultations & manage encrypted EHR records.',
    badge: 'Patient Access',
    bannerTitle: "Join India's most trusted healthcare network.",
    bannerDesc: 'Experience world-class medical care, completely secured by enterprise-grade encryption. Your data is yours alone.',
    image: '/images/patient-app.jpg',
    gradient: 'from-teal-600 via-emerald-800 to-slate-950',
    theme: {
      tabActive: 'bg-teal-600 text-white shadow-md shadow-teal-600/30',
      badge: 'bg-teal-50 text-teal-700 border-teal-200/80',
      btn: 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/20',
      ring: 'focus:border-teal-500 focus:ring-teal-500/15',
      link: 'text-teal-600 hover:text-teal-700'
    },
    loginHref: '/login/patient',
    cards: [
      { icon: HeartPulse, title: 'Doorstep Doctor Home Visits', desc: 'Verified specialists at your door', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { icon: FileText, title: '256-bit Encrypted Health Vault', desc: 'Secure prescriptions & lab reports', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      { icon: Clock, title: 'Instant Video Consultations', desc: 'Top doctors on-duty 24/7', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    ]
  },
  {
    id: 'doctor',
    name: 'Doctor',
    icon: Stethoscope,
    role: ROLES.DOCTOR,
    title: 'Register as Verified Doctor',
    subtext: 'Grow your medical practice, set your fees & consult patients online or at doorstep.',
    badge: 'Medical Practitioner Onboarding',
    bannerTitle: 'Elevate Your Clinical Practice.',
    bannerDesc: 'Accept home callouts within 15km, issue MCI compliant digital Rx, and receive automated bank settlements.',
    image: '/images/doctor-tablet.jpg',
    gradient: 'from-slate-800 via-indigo-950 to-slate-950',
    theme: {
      tabActive: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
      badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
      btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20',
      ring: 'focus:border-purple-500 focus:ring-purple-500/15',
      link: 'text-purple-600 hover:text-purple-700'
    },
    loginHref: '/login/doctor',
    cards: [
      { icon: Stethoscope, title: '15km Radius Smart Dispatch', desc: 'Home consultation callouts', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
      { icon: Wallet, title: '24h Automated Settlements', desc: 'Direct to your verified bank account', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { icon: ShieldCheck, title: 'MCI Compliant Digital Signature', desc: '100% legally recognized Rx', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
    ]
  },
  {
    id: 'clinic',
    name: 'Clinic HQ',
    icon: Building2,
    role: ROLES.CLINIC_ADMIN,
    title: 'Register Healthcare Facility',
    subtext: 'Centralized OPD tokens, multi-doctor scheduling & digital patient records.',
    badge: 'Clinic & Hospital Suite',
    bannerTitle: 'Enterprise Hospital & Clinic Cloud.',
    bannerDesc: 'Streamline front-desk operations, manage clinical staff quotas, and access institutional analytics.',
    image: '/images/hero-clinic.jpg',
    gradient: 'from-slate-800 via-slate-900 to-slate-950',
    theme: {
      tabActive: 'bg-slate-900 text-white shadow-md shadow-slate-900/30',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      btn: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25',
      ring: 'focus:border-slate-800 focus:ring-slate-800/15',
      link: 'text-slate-900 hover:underline'
    },
    loginHref: '/login/clinic',
    cards: [
      { icon: Building2, title: 'Multi-Doctor Quota Management', desc: 'Full institutional roster', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
      { icon: FileText, title: 'Live OPD Token & Queue Desk', desc: 'Minimize walk-in wait times', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { icon: ShieldCheck, title: 'SaaS Billing & GST Invoices', desc: 'Automated clinic accounting', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    ]
  }
];

function DynamicRegisterForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const returnQuery = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';

  const requestedRole = (params.role || 'patient').toString().toLowerCase();
  const activeRoleData = REGISTER_ROLES.find(r => r.id === requestedRole) || REGISTER_ROLES[0];
  const RoleIcon = activeRoleData.icon;

  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service to proceed.');
      return;
    }

    try {
      await register({
        name,
        email,
        phone,
        password,
        role: activeRoleData.role
      }).unwrap();

      const returnPart = returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : '';
      router.push(`${activeRoleData.loginHref}?registered=true${returnPart}`);
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6 py-6 sm:py-8">
        <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* 🌟 LEFT COLUMN (Compact Form - 7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-white">
            <div>
              
              {/* Role Header Badge & Return Home */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${activeRoleData.theme.badge}`}>
                  <RoleIcon className="h-3 w-3" />
                  <span>{activeRoleData.badge}</span>
                </div>
                <Link 
                  href="/register" 
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  All Roles &rarr;
                </Link>
              </div>

              {/* Role Switcher Tabs */}
              <div className="mb-4">
                <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1">
                  {REGISTER_ROLES.map((roleItem) => {
                    const Icon = roleItem.icon;
                    const isActive = activeRoleData.id === roleItem.id;
                    return (
                      <Link
                        key={roleItem.id}
                        href={`/register/${roleItem.id}${returnQuery}`}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          isActive 
                            ? roleItem.theme.tabActive
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{roleItem.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Title & Subtext */}
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeRoleData.title}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {activeRoleData.subtext}
                </p>
              </div>

              {/* ReturnUrl Booking Alert */}
              {returnUrl && activeRoleData.id === 'patient' && (
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/90 text-teal-900 text-xs font-semibold flex items-center gap-2 mb-3 shadow-2xs">
                  <div className="h-2 w-2 rounded-full bg-teal-600 animate-ping shrink-0" />
                  <span>Completing registration will immediately confirm your doctor appointment.</span>
                </div>
              )}

              {/* Form with Compact Spacing */}
              <form className="space-y-3" onSubmit={handleRegister}>
                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 2-Column Responsive Row: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative group">
                      <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`block w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white outline-none transition-all font-medium ${activeRoleData.theme.ring}`}
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`block w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white outline-none transition-all font-medium ${activeRoleData.theme.ring}`}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`block w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white outline-none transition-all font-medium ${activeRoleData.theme.ring}`}
                      required 
                    />
                  </div>
                </div>

                {/* Create Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                  <div className="relative group">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className={`block w-full pl-9 pr-9 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:bg-white outline-none transition-all font-medium ${activeRoleData.theme.ring}`}
                      required 
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Privacy checkbox */}
                <div className="flex items-start pt-1">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer accent-teal-600 shrink-0" 
                    required 
                  />
                  <label htmlFor="terms" className="ml-2 block text-[11px] text-slate-500 font-medium leading-tight cursor-pointer">
                    I agree to the <Link href="/terms" className="text-teal-600 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-teal-600 font-bold hover:underline">Privacy Policy</Link>, including HIPAA encryption of health data.
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:opacity-95 hover:scale-[1.005] active:scale-[0.995] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${activeRoleData.theme.btn}`}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Create {activeRoleData.name} Account <ArrowRight className="h-3.5 w-3.5" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Login & Security Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <p className="text-slate-500 font-medium text-center sm:text-left">
                Already have an account?{' '}
                <Link 
                  href={`${activeRoleData.loginHref}${returnQuery}`}
                  className={`font-bold ${activeRoleData.theme.link}`}
                >
                  Log In
                </Link>
              </p>

              <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] shrink-0">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit HIPAA Encryption</span>
              </div>
            </div>
          </div>

          {/* 🌟 RIGHT COLUMN (Branded Visual Showcase - 5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 relative p-6 sm:p-8 flex-col justify-between overflow-hidden bg-slate-950">
            {/* Background Image */}
            <Image 
              src={activeRoleData.image} 
              alt="Doctor On Call Experience" 
              fill 
              className="object-cover opacity-25 mix-blend-luminosity"
              priority
            />
            {/* Branded Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeRoleData.gradient} opacity-95`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Top Floating Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Doctor On Call Network</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified</span>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-4 space-y-2.5">
              {activeRoleData.cards.map((c, idx) => {
                const CardIcon = c.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${c.color}`}>
                      <CardIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{c.title}</p>
                      <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 pt-2 border-t border-white/10">
              <h3 className="text-xl font-black text-white leading-tight mb-1.5">
                {activeRoleData.bannerTitle}
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {activeRoleData.bannerDesc}
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DynamicRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500 font-bold text-sm">
        Loading Registration...
      </div>
    }>
      <DynamicRegisterForm />
    </Suspense>
  );
}
