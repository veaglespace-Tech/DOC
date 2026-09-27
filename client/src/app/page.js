import React from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Building2, 
  ArrowRight,
  User,
  Phone,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900">
              Care<span className="text-indigo-600">Connect</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <Link href="#services" className="hover:text-indigo-600 transition-colors">Services</Link>
            <Link href="#doctors" className="hover:text-indigo-600 transition-colors">For Doctors</Link>
            <Link href="#clinics" className="hover:text-indigo-600 transition-colors">For Clinics</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/patient" 
              className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link 
              href="/patient" 
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5"
            >
              Book Appointment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-purple-50/20 to-white"></div>
        <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/4 rounded-full bg-gradient-to-tr from-pink-400/20 to-orange-400/20 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HeartPulse className="h-4 w-4" />
            24/7 Premium Healthcare Access
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Healthcare that comes to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">your doorstep.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Instantly book top-rated doctors for home visits, online consultations, or emergency dispatches. A unified healthcare platform built for you.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link 
              href="/patient" 
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/20 transition-all hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-1"
            >
              <User className="h-5 w-5" /> Patient Portal
            </Link>
            <Link 
              href="/doctor" 
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-zinc-900 shadow-lg shadow-zinc-200/50 ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 hover:shadow-xl hover:-translate-y-1"
            >
              <Stethoscope className="h-5 w-5" /> I am a Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Access Portals / Roles */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Unified Platform For Everyone</h2>
            <p className="mt-4 text-lg text-zinc-600">Role-based dedicated environments tailored for your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:ring-indigo-500/50 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl transition-all group-hover:bg-indigo-500/20"></div>
              <User className="h-10 w-10 text-indigo-600 mb-6" />
              <h3 className="text-2xl font-bold text-zinc-900">Patients</h3>
              <p className="mt-4 text-zinc-600 line-clamp-3">Book appointments, request emergency visits, track doctor arrivals, and manage your complete medical history securely.</p>
              <Link href="/patient" className="mt-8 inline-flex items-center gap-2 font-semibold text-indigo-600 group-hover:text-indigo-700">
                Enter Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Doctor Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 transition-all hover:shadow-2xl hover:shadow-purple-500/10 hover:ring-purple-500/50 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 blur-2xl transition-all group-hover:bg-purple-500/20"></div>
              <Stethoscope className="h-10 w-10 text-purple-600 mb-6" />
              <h3 className="text-2xl font-bold text-zinc-900">Doctors</h3>
              <p className="mt-4 text-zinc-600 line-clamp-3">Manage schedule, accept appointments and emergency requests, track earnings, and streamline your entire practice.</p>
              <Link href="/doctor" className="mt-8 inline-flex items-center gap-2 font-semibold text-purple-600 group-hover:text-purple-700">
                Enter Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Clinic Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-50 p-8 ring-1 ring-zinc-200 transition-all hover:shadow-2xl hover:shadow-pink-500/10 hover:ring-pink-500/50 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-pink-500/10 blur-2xl transition-all group-hover:bg-pink-500/20"></div>
              <Building2 className="h-10 w-10 text-pink-600 mb-6" />
              <h3 className="text-2xl font-bold text-zinc-900">Clinics & SaaS</h3>
              <p className="mt-4 text-zinc-600 line-clamp-3">Multi-tenant workspace to manage staff, multiple doctors, centralized billing, and organizational operations.</p>
              <Link href="/clinic" className="mt-8 inline-flex items-center gap-2 font-semibold text-pink-600 group-hover:text-pink-700">
                Enter Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-900 to-zinc-900"></div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">State of the art emergency response.</h2>
              <p className="mt-6 text-lg text-zinc-400">
                When time is critical, our intelligent routing system finds the nearest available specialist and dispatches them immediately to your location with real-time tracking.
              </p>
              
              <ul className="mt-10 space-y-6">
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">Real-time Dispatch</h4>
                    <p className="mt-1 text-zinc-400">Automated doctor matching within 60 seconds.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">Verified Professionals</h4>
                    <p className="mt-1 text-zinc-400">Every doctor goes through strict KYC and license verification.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="relative h-[500px] w-full rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10 overflow-hidden backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center">
              <div className="absolute inset-0 bg-white/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <Phone className="h-20 w-20 text-indigo-400 mb-6 animate-pulse" />
              <h3 className="text-2xl font-bold">Emergency Request</h3>
              <p className="mt-4 text-zinc-300">Searching for nearest cardiologist...</p>
              
              <div className="mt-8 w-full max-w-sm rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 text-left">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Ramesh Sharma</p>
                    <p className="text-sm text-zinc-400">2.4 km away • Arriving in 12 mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <span className="text-lg font-bold text-zinc-900">CareConnect</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 CareConnect Healthcare SaaS. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-600">
            <Link href="/admin" className="hover:text-indigo-600">Super Admin</Link>
            <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
