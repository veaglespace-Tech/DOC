'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, HeartPulse } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Scroll effect for dynamic styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Doctors', href: '/#doctors' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
            Care<span className="text-teal-600">Connect</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold transition-colors hover:text-teal-600 ${
                isScrolled ? 'text-slate-600' : 'text-slate-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className={`text-sm font-semibold ${isScrolled ? 'text-slate-700' : 'text-slate-800'}`}>
                Hi, {user?.name || 'User'}
              </span>
              <button 
                onClick={handleLogout}
                className={`text-sm font-bold transition-colors ${
                  isScrolled ? 'text-red-600 hover:text-red-700' : 'text-red-500 hover:text-red-600'
                }`}
              >
                Sign Out
              </button>
              <Link 
                href={user?.roles?.includes('PATIENT') ? '/patient' : user?.roles?.includes('DOCTOR') ? '/doctor' : '/admin/billing'}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`text-sm font-bold transition-colors ${
                  isScrolled ? 'text-slate-900 hover:text-teal-600' : 'text-slate-900 hover:text-teal-600'
                }`}
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-500 hover:shadow-teal-500/40 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isScrolled ? 'text-slate-900 bg-slate-100' : 'text-slate-900 bg-white/50 backdrop-blur-md'}`}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU (Animated) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-2xl absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-teal-600"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px w-full bg-slate-100 my-2"></div>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href={user?.roles?.includes('PATIENT') ? '/patient' : user?.roles?.includes('DOCTOR') ? '/doctor' : '/admin/billing'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-center font-bold text-white"
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-center font-bold text-rose-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-slate-100 px-5 py-3 text-center font-bold text-slate-900"
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-teal-500 px-5 py-3 text-center font-bold text-white shadow-lg shadow-teal-500/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
