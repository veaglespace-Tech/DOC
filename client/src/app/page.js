import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  CheckCircle,
  Star,
  MapPin,
  CalendarCheck,
  Video
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-500 selection:text-white overflow-x-hidden">
      
      {/* 🌟 LUXURIOUS NAVBAR */}
      <Navbar />

      {/* 🌟 HERO SECTION (Cinematic & Luxurious) */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-slate-900 flex items-center justify-center text-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/about-hospital.jpg" 
            alt="Futuristic CareConnect Hospital Exterior" 
            fill 
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/10"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/20 px-5 py-2 text-sm font-bold text-teal-300 mb-6 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="h-4 w-4" />
            India's #1 Premium Healthcare Network
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Healthcare that comes to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">your doorstep.</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Experience world-class medical care from the comfort of your home. Instantly book top-rated specialists, arrange emergency dispatches, and consult via HD video.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 w-full sm:w-auto">
            <Link 
              href="/patient" 
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-teal-500 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-teal-500/20 transition-all hover:bg-teal-400 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1"
            >
              <User className="h-5 w-5" /> Patient Portal
            </Link>
            <Link 
              href="/doctor" 
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl"
            >
              <Stethoscope className="h-5 w-5" /> I am a Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 STATS SECTION */}
      <section className="relative -mt-16 z-20 mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="text-center px-4">
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-400">50k+</p>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">Patients Treated</p>
          </div>
          <div className="text-center px-4">
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-400">2,500+</p>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">Verified Doctors</p>
          </div>
          <div className="text-center px-4">
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-400">10 min</p>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. Response Time</p>
          </div>
          <div className="text-center px-4">
            <div className="flex justify-center items-center gap-1 text-4xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-400">4.9</span> 
              <Star className="h-8 w-8 fill-emerald-400 text-emerald-400 drop-shadow-sm" />
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">App Rating</p>
          </div>
        </div>
      </section>

      {/* 🌟 SERVICES HIGHLIGHT (Premium Cards) */}
      <section id="services" className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Soft glowing background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 uppercase tracking-widest mb-3">Our Services</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Comprehensive Medical Care</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Video Consultations Card */}
            <div className="group relative rounded-3xl bg-white p-10 border border-slate-200/60 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 overflow-hidden">
              {/* Hover Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <div className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-teal-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                  <Video className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 mb-4 transition-colors duration-500 group-hover:text-white">Video Consultations</h4>
                <p className="text-slate-500 leading-relaxed transition-colors duration-500 group-hover:text-slate-300">Connect with top specialists instantly via HD WebRTC video calls. Receive digital prescriptions immediately after your session.</p>
              </div>
            </div>
            
            {/* Home Visits Card */}
            <div className="group relative rounded-3xl bg-white p-10 border border-slate-200/60 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 overflow-hidden">
              {/* Hover Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <div className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-teal-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                  <MapPin className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 mb-4 transition-colors duration-500 group-hover:text-white">Home Visits</h4>
                <p className="text-slate-500 leading-relaxed transition-colors duration-500 group-hover:text-slate-300">Book experienced doctors for in-person home visits. Real-time GPS tracking ensures you know exactly when they arrive.</p>
              </div>
            </div>

            {/* Emergency SOS Card */}
            <div className="group relative rounded-3xl bg-white p-10 border border-slate-200/60 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-2 hover:border-red-500/30 overflow-hidden">
              {/* Hover Emergency Red Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <div className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-white group-hover:text-red-600 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  <HeartPulse className="h-8 w-8 group-hover:animate-pulse" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 mb-4 transition-colors duration-500 group-hover:text-white">Emergency SOS</h4>
                <p className="text-slate-500 leading-relaxed transition-colors duration-500 group-hover:text-red-100">One-tap emergency trigger broadcasts your location to the nearest available doctors using advanced PostGIS spatial routing.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 IMAGE & TEXT FEATURE 1 (Patient App) */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-50/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Image Container with Glow */}
            <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(20,184,166,0.3)] ring-4 ring-slate-50">
              <div className="absolute inset-0 bg-teal-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
              <Image 
                src="/images/patient-app.jpg" 
                alt="Patient using CareConnect App" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-50 px-4 py-1.5 text-xs font-bold text-teal-600 uppercase tracking-widest mb-6">
                <User className="h-4 w-4" /> Patient Experience
              </div>
              
              <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6 leading-tight">
                Your health in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">palm of your hand.</span>
              </h3>
              
              <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
                The CareConnect patient app provides a luxurious, seamless experience. Manage your Electronic Health Records (EHR), track live ambulances, and securely chat with your assigned doctors.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  'Family Member Profiles',
                  'Instant UPI Payments',
                  'Encrypted Records Vault',
                  'WhatsApp Reminders'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm shadow-slate-200/50 rounded-2xl p-4 transition-all hover:shadow-md hover:border-teal-100 group">
                    <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                      <CheckCircle className="h-4 w-4 text-teal-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-teal-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-teal-500/20 transition-all hover:bg-teal-400 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1">
                Explore Patient Portal <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* 🌟 IMAGE & TEXT FEATURE 2 (Doctor Portal) */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-slate-200/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center flex-col-reverse lg:flex-row-reverse">
            
            {/* Image Container with Glow */}
            <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] ring-4 ring-white">
              <Image 
                src="/images/doctor-tablet.jpg" 
                alt="Doctor using CareConnect" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 uppercase tracking-widest mb-6 shadow-sm">
                <Stethoscope className="h-4 w-4" /> Doctor Empowered
              </div>
              
              <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6 leading-tight">
                Practice management, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">elevated.</span>
              </h3>
              
              <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
                Designed specifically for modern healthcare professionals. Manage your clinic availability, track earnings via double-entry ledger, and digitally sign prescriptions seamlessly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  'Digital Prescription Builder',
                  'Smart Vacation Blocks',
                  'Real-time Escrow Payouts',
                  'Instant Emergency Handovers'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-200/60 shadow-sm shadow-slate-200/50 rounded-2xl p-4 transition-all hover:shadow-md hover:border-slate-300 group">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-800 transition-colors">
                      <CheckCircle className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/register" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/40 hover:-translate-y-1">
                Join as a Doctor <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* 🌟 CLINICS / SAAS SECTION */}
      <section id="portals" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-900 to-slate-900"></div>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <Building2 className="h-16 w-16 text-teal-400 mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Multi-tenant Clinic SaaS</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300 mb-10">
            Scale your hospital with our premium Tier Plans (Starter, Pro, Hospital). Get custom domains, white-label branding, and executive KPI metrics out of the box.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-teal-500/20 transition-all hover:bg-teal-400 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1">
            Register your Clinic <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* 🌟 FOOTER */}
      <Footer />
    </div>
  );
}
