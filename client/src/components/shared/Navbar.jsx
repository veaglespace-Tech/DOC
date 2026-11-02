'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, HeartPulse, Phone, Clock, MapPin, AlertTriangle, ArrowRight, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Specialists', href: '/#specialist' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      {/* Top Contact & Emergency Announcement Bar */}
      <div className="hidden md:flex bg-slate-950 text-slate-300 text-xs py-2 px-6 justify-between items-center border-b border-slate-800/80">
        <div className="flex gap-6 max-w-7xl mx-auto w-full items-center">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-medium">All Clinics & Doctors On-Duty</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3 w-3 text-slate-500" /> Mon - Sun: 24/7 Consultation
          </span>
        </div>
        <div className="flex gap-4 items-center shrink-0 whitespace-nowrap">
          <a href="tel:18002663911" className="flex items-center gap-1.5 text-teal-400 font-bold hover:text-teal-300 transition-colors">
            <Phone className="h-3 w-3" /> 24/7 Helpline: 1-800-CARE-911
          </a>
          <div className="h-3 w-px bg-slate-800"></div>
          <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
            Portal Access
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-white p-1 border border-slate-200/80 shadow-md shadow-indigo-600/10 group-hover:scale-105 transition-all overflow-hidden flex items-center justify-center shrink-0">
              <Image 
                src="/logo.png" 
                alt="Veagle Space Technology Logo" 
                width={44} 
                height={44} 
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                Veagle<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"> Space</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-0.5">
                Doctor On Call Network
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/60 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white px-4 py-2 rounded-full transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">

            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <Link 
                  href={user?.roles?.includes('PATIENT') ? '/patient' : user?.roles?.includes('DOCTOR') ? '/doctor' : '/admin'}
                  className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-md hover:scale-105"
                >
                  <UserIcon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Dashboard ({user?.name?.split(' ')[0] || 'User'})</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/search" 
                  className="rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition-all hover:opacity-95 hover:scale-105"
                >
                  Find a Doctor
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col px-6 py-6 gap-3">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-slate-700 hover:text-indigo-600 py-1.5"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px w-full bg-slate-100 my-1"></div>
                
                {mounted && isAuthenticated ? (
                  <>
                    <Link 
                      href={user?.roles?.includes('PATIENT') ? '/patient' : user?.roles?.includes('DOCTOR') ? '/doctor' : '/admin'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-center text-xs font-bold text-white shadow-md"
                    >
                      Go to Dashboard ({user?.name || 'User'})
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-center text-xs font-bold text-rose-600 py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center text-xs font-bold text-slate-700 py-3 rounded-2xl border border-slate-200"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-center text-xs font-bold text-white shadow-md"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
