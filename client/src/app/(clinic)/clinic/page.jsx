'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Plus, 
  ArrowUpRight, 
  DollarSign, 
  Clock, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Layers,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useGetMyClinicQuery, 
  useGetSubscriptionPlansQuery, 
  useSubscribePlanMutation 
} from '@/store/api/saasApi';
import Link from 'next/link';

export default function ClinicDashboardPage() {
  const { data: clinicData, isLoading: isClinicLoading, refetch: refetchClinic } = useGetMyClinicQuery();
  const { data: plansData, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
  const [subscribePlan, { isLoading: isSubscribing }] = useSubscribePlanMutation();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState({ message: '', type: '' });

  const clinic = clinicData?.data?.organization || {
    name: 'Doctor On Call Multi-Speciality Clinic',
    subdomain: 'citycare',
    plan: {
      name: 'Clinic Professional',
      doctorLimit: 15,
      priceMonthly: 2999
    }
  };

  const usage = clinicData?.data?.usage || {
    currentDoctors: 4,
    maxDoctors: 15
  };

  const plans = plansData?.data || [];

  const handleUpgrade = async (planId) => {
    try {
      setSelectedPlanId(planId);
      setSubscriptionStatus({ message: 'Upgrading your SaaS tier...', type: 'info' });

      await subscribePlan({
        planId,
        orgId: clinic.id
      }).unwrap();

      setSubscriptionStatus({ message: 'SaaS tier upgraded successfully! Quota updated.', type: 'success' });
      refetchClinic();
      setTimeout(() => {
        setIsUpgradeModalOpen(false);
        setSubscriptionStatus({ message: '', type: '' });
      }, 1500);
    } catch (err) {
      setSubscriptionStatus({ message: err?.data?.message || 'Failed to update subscription.', type: 'error' });
    }
  };

  const quotaPercent = Math.min(Math.round((usage.currentDoctors / (usage.maxDoctors || 1)) * 100), 100);

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-emerald-400/10 blur-[130px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="h-3.5 w-3.5 text-teal-600" />
            {clinic.name}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">HQ Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Real-time multi-tenant facility analytics, doctor roster, and SaaS capacity management.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/clinic/doctors"
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-teal-500/25 hover:-translate-y-0.5 text-sm"
          >
            <Plus className="h-4 w-4" /> Manage Doctors
          </Link>
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-800 px-5 py-3 rounded-2xl font-bold transition-all shadow-md hover:bg-slate-50 text-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-500" /> SaaS Plans
          </button>
        </div>
      </div>

      {/* SaaS Subscription & Doctor Quota Tier Card (BRD Sec 17) */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-[2.5rem] p-8 text-white mb-10 shadow-2xl relative overflow-hidden z-10 border border-teal-500/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider">
                Active SaaS Tier: {clinic.plan?.name || 'Clinic Professional'}
              </span>
              <span className="text-xs text-slate-300 font-mono bg-white/10 px-3 py-1 rounded-full">
                {clinic.subdomain}.doctoroncall.health
              </span>
            </div>
            
            <h3 className="text-3xl font-black tracking-tight">
              {clinic.plan?.name || 'Clinic Professional'} 
              <span className="text-teal-400 text-xl font-normal ml-3">
                ₹{clinic.plan?.priceMonthly?.toLocaleString('en-IN') || '2,999'}/mo
              </span>
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Multi-tenant isolated patient directory, automated emergency dispatch, 
              branded prescriptions, and customizable consultation shifts.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[280px] space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-300 font-bold block">Doctor Capacity</span>
                <span className="text-2xl font-black text-teal-300">
                  {usage.currentDoctors} / {usage.maxDoctors || 15}
                </span>
                <span className="text-xs text-slate-300 ml-1">Onboarded</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-400/20 text-teal-300 border border-teal-400/30">
                {quotaPercent}% Filled
              </span>
            </div>

            {/* Quota Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaPercent > 90 
                    ? 'bg-rose-500' 
                    : quotaPercent > 70 
                    ? 'bg-amber-400' 
                    : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                }`}
                style={{ width: `${quotaPercent}%` }}
              ></div>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs transition-colors shadow-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-950" /> Change / Upgrade Tier
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 relative z-10">
        
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-xl">
              <TrendingUp className="h-3.5 w-3.5 mr-1" /> Active
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{usage.currentDoctors}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Doctors</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="h-7 w-7" />
            </div>
            <span className="flex items-center text-indigo-600 text-xs font-black uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-xl">
              Monthly
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">1,248</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Bookings</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-7 w-7" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-xl">
              +18% MoM
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">₹4.85 L</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Consultations</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="h-7 w-7" />
            </div>
            <span className="flex items-center text-teal-600 text-xs font-black uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-xl">
              Live
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">99.8%</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facility Uptime</p>
          </div>
        </div>

      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left 2 Columns: Patient Volume Graph */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" /> Facility Patient Volume
              </h2>
              <p className="text-xs text-slate-400 mt-1">OPD and virtual consultations over time</p>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              Current Week
            </div>
          </div>
          
          <div className="h-[240px] w-full flex items-end justify-between gap-4 pt-4 border-b border-slate-100 pb-4">
            {[45, 75, 50, 95, 70, 90, 40].map((height, i) => (
              <div key={i} className="w-full relative group flex flex-col justify-end h-full cursor-pointer hover:scale-105 transition-transform origin-bottom">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {height * 3} Patients
                </div>
                <div 
                  className="w-full bg-slate-100 rounded-t-xl group-hover:bg-slate-200 transition-colors relative overflow-hidden" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-xl" style={{ height: '70%' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Right 1 Column: Today's Clinical Highlights */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-400" /> Operational Feed
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                <div>
                  <p className="font-bold text-sm">Doctor Shift Commenced</p>
                  <p className="text-xs text-slate-400">Dr. Sharma on duty • General OPD</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                <div>
                  <p className="font-bold text-sm">Emergency Dispatch Accepted</p>
                  <p className="text-xs text-slate-400">Ambulance dispatched • Sector 4</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]"></div>
                <div>
                  <p className="font-bold text-sm">Rx Cloud Sync Complete</p>
                  <p className="text-xs text-slate-400">18 EHR records updated</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              href="/clinic/doctors"
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              View All Doctors & Branches <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Upgrade SaaS Tier Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  SaaS Multi-Tenant Subscription &bull; PayU Sandbox Test
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Choose the Right Plan for Your Facility
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  Scale doctor capacity, emergency dispatch coverage, and custom domain white-labeling instantly.
                </p>
              </div>

              {subscriptionStatus.message && (
                <div className={`mb-6 p-4 rounded-2xl text-xs font-bold text-center ${
                  subscriptionStatus.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {subscriptionStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  let features = [];
                  try {
                    features = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []);
                  } catch {
                    features = ['Standard Features'];
                  }

                  const isCurrent = clinic.plan?.id === plan.id || clinic.plan?.name === plan.name;

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-3xl p-6 flex flex-col justify-between border-2 transition-all ${
                        isCurrent 
                          ? 'border-teal-500 bg-teal-50/30 shadow-lg shadow-teal-500/10' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-black text-lg text-slate-900">{plan.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-black uppercase">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="mb-6">
                          <span className="text-3xl font-black text-slate-900">₹{plan.priceMonthly?.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-slate-400 font-bold ml-1">/month</span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="text-xs font-bold text-slate-700">
                            Capacity: <span className="text-teal-600 font-black">{plan.doctorLimit} Doctors</span>
                          </div>
                          <div className="text-xs font-bold text-slate-700">
                            Patients: <span className="text-slate-900 font-black">{plan.patientLimit} Active</span>
                          </div>

                          <div className="pt-3 border-t border-slate-100 space-y-2">
                            {features.map((feat, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isCurrent || isSubscribing}
                        className={`w-full py-3 rounded-2xl font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : 'bg-slate-900 hover:bg-teal-600 text-white shadow-lg'
                        }`}
                      >
                        {isCurrent ? 'Active Plan' : isSubscribing && selectedPlanId === plan.id ? 'Upgrading...' : 'Select Plan'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span className="font-medium">Payments powered by PayU Sandbox Test Gateway (Key: gtKFFx)</span>
                <Link href="/pricing" className="text-teal-600 font-bold hover:underline flex items-center gap-1">
                  View Full Public Pricing &amp; PayU Checkout &rarr;
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
