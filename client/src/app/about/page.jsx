import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Activity, 
  Target, 
  ShieldCheck, 
  Users, 
  Globe2, 
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: "About Us",
  description: "Learn about CareConnect's mission to redefine global healthcare. We bring premium medical services, expert doctors, and emergency SOS directly to you.",
  keywords: ["About CareConnect", "Healthcare Network Mission", "Best Telemedicine Platform India", "Healthcare SaaS Vision", "Medical Specialists"],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-500 selection:text-white overflow-x-hidden">
      
      {/* 🌟 LUXURIOUS NAVBAR (Reused from landing for consistency) */}
      <Navbar />

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-slate-900 flex items-center justify-center text-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-clinic.jpg" 
            alt="Luxurious Clinic Interior" 
            fill 
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/10"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/20 px-5 py-2 text-sm font-bold text-teal-300 mb-6 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Globe2 className="h-4 w-4" />
            Redefining Global Healthcare
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Medical Excellence.</span>
          </h1>
          
          <p className="mt-6 text-xl leading-8 text-slate-300 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            At CareConnect, we believe that premium healthcare shouldn't be a privilege. It should be an accessible, seamless, and luxurious experience tailored entirely to your well-being.
          </p>
        </div>
      </section>

      {/* 🌟 OUR MISSION & VISION */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Our Mission</h2>
              <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">Bridging the gap between patients and elite doctors.</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Founded in 2026, CareConnect was built on a simple premise: healthcare is broken, and technology can fix it. We integrated advanced spatial algorithms (PostGIS), WebRTC video infrastructure, and a multi-tenant architecture to create the most robust medical platform in the world.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We handle the administrative complexities—from automated GST invoices to secure Electronic Health Records (EHR) encryption—so our doctors can focus purely on what they do best: saving lives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="rounded-3xl bg-slate-50 p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform">
                <Target className="h-10 w-10 text-teal-600 mb-4" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">Precision Care</h4>
                <p className="text-slate-600 text-sm">Matching you with the exact specialist you need within 60 seconds.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform sm:translate-y-8">
                <ShieldCheck className="h-10 w-10 text-teal-600 mb-4" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">Uncompromised Trust</h4>
                <p className="text-slate-600 text-sm">Every doctor undergoes strict background checks and license verification.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 THE TEAM SECTION */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/30 via-slate-900 to-slate-900"></div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-teal-900/50">
              <Image 
                src="/images/about-team.jpg" 
                alt="CareConnect Expert Medical Team" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-2">The Medical Board</p>
                <h4 className="text-3xl font-bold text-white">World-class specialists at your fingertips.</h4>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">Our People</h2>
              <h3 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Built by Doctors, for Patients.</h3>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Our platform is governed by a medical advisory board of elite physicians and surgeons. From the user interface of our Digital Prescription Builder to the logic of our Emergency SOS Dispatcher, every feature is medically validated.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">2,500+ Verified Specialists</h4>
                    <p className="mt-1 text-slate-400">Covering over 40 distinct medical specializations globally.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">24/7 Rapid Response Team</h4>
                    <p className="mt-1 text-slate-400">On-call doctors ready for immediate home dispatch or WebRTC video consultations.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 CALL TO ACTION */}
      <section className="py-24 bg-teal-600 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-4xl font-extrabold sm:text-5xl mb-6">Experience the future of healthcare today.</h2>
          <p className="text-xl text-teal-100 mb-10">
            Join thousands of patients who have already upgraded their healthcare experience.
          </p>
          <Link 
            href="/patient" 
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:bg-slate-800 hover:-translate-y-1 hover:shadow-slate-900/50"
          >
            Create Your Patient Profile <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* 🌟 FOOTER */}
      <Footer />
      
    </div>
  );
}
