'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, HeartPulse, Phone, Clock, MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Our Specialist', href: '/#specialist' },
    { name: 'Our App', href: '/#app' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="hidden md:flex bg-slate-800 text-slate-200 text-xs py-2 px-6 justify-between items-center">
        <div className="flex gap-6 max-w-7xl mx-auto w-full">
          <span className="flex items-center gap-2"><MapPin className="h-3 w-3 text-slate-400" /> 123 Healthcare Ave, Medical City</span>
          <span className="flex items-center gap-2"><Clock className="h-3 w-3 text-slate-400" /> Mon - Sat: 8:00 AM - 9:00 PM</span>
        </div>
        <div className="flex gap-4 items-center shrink-0 whitespace-nowrap">
          <span className="flex items-center gap-2 font-semibold text-white"><Phone className="h-3 w-3 text-sky-400" /> 1-800-123-4567</span>
          <div className="h-3 w-px bg-slate-600"></div>
          <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white shadow-md">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              Viola<span className="text-slate-400 font-medium">Care</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">
                  Hi, {user?.name || 'User'}
                </span>
                <Link 
                  href={user?.roles?.includes('PATIENT') ? '/patient' : user?.roles?.includes('DOCTOR') ? '/doctor' : '/admin/billing'}
                  className="rounded-full bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-700 shadow-md"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="rounded-full bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-700 hover:-translate-y-0.5"
                >
                  + Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col px-6 py-6 gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-slate-700 hover:text-slate-900"
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
                      className="rounded-full bg-slate-800 px-5 py-3 text-center font-semibold text-white"
                    >
                      Go to Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-center font-semibold text-red-500"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center font-semibold text-slate-600 py-2"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full bg-slate-800 px-5 py-3 text-center font-semibold text-white shadow-md"
                    >
                      + Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
