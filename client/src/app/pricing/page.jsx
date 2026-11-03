'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Building2, 
  Stethoscope, 
  Users, 
  Lock, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useGetSubscriptionPlansQuery } from '@/store/api/saasApi';
import { useInitiatePayUSubscriptionMutation, useVerifyPayUPaymentMutation } from '@/store/api/paymentApi';
import { useSelector } from 'react-redux';

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('INIT'); // 'INIT' | 'SIMULATING' | 'SUCCESS' | 'ERROR'
  const [payuParams, setPayuParams] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const { data: plansData, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
  const [initiatePayU, { isLoading: isInitiating }] = useInitiatePayUSubscriptionMutation();
  const [verifyPayU, { isLoading: isVerifying }] = useVerifyPayUPaymentMutation();

  // Fallback plans if API is loading or empty
  const defaultPlans = [
    {
      id: 1,
      name: 'Free Starter',
      doctorLimit: 3,
      patientLimit: 100,
      priceMonthly: 0,
      features: JSON.stringify([
        'Up to 3 Doctors',
        '100 Patient Records',
        'Standard Appointment Booking',
        'Community Support',
        'Electronic Prescriptions (Basic)'
      ]),
      isActive: true
    },
    {
      id: 2,
      name: 'Clinic Professional',
      doctorLimit: 15,
      patientLimit: 1500,
      priceMonthly: 2999,
      features: JSON.stringify([
        'Up to 15 Doctors',
        '1,500 Patient Records',
        'Smart Queue & Dispatch System',
        'Real-time Analytics Dashboard',
        'Digital Billing & GST Invoices',
        '24/7 Priority Clinical Support',
        'Custom SMS & WhatsApp Alerts'
      ]),
      isActive: true
    },
    {
      id: 3,
      name: 'Hospital Enterprise',
      doctorLimit: 100,
      patientLimit: 50000,
      priceMonthly: 9999,
      features: JSON.stringify([
        'Unlimited Doctors & Specialists',
        '50,000+ Patient Records',
        'Multi-Branch Clinic Management',
        'Custom Subdomain (yourclinic.doc.in)',
        'Full EMR / PACS Integration API',
        'Dedicated Account Manager',
        '99.9% Uptime SLA & Custom BAA'
      ]),
      isActive: true
    }
  ];

  const plans = (plansData?.data && plansData.data.length > 0) ? plansData.data : defaultPlans;

  // Handle plan select
  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setPaymentStep('INIT');
    setStatusMessage('');
    setPayuParams(null);

    // If free tier, activate directly
    if (plan.priceMonthly === 0) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/pricing');
        return;
      }
      try {
        const res = await initiatePayU({ planId: plan.id, billingCycle }).unwrap();
        setSelectedPlan(plan);
        setStatusMessage(res.message || 'Free Starter plan activated successfully!');
        setPaymentStep('SUCCESS');
        setIsModalOpen(true);
      } catch (err) {
        setStatusMessage(err?.data?.message || 'Failed to activate plan.');
        setPaymentStep('ERROR');
        setIsModalOpen(true);
      }
      return;
    }

    // Paid tier -> open PayU modal
    setIsModalOpen(true);
  };

  // Step 1: Initiate PayU session from backend
  const handleInitiatePayU = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }

    try {
      setStatusMessage('Connecting to PayU India Sandbox...');
      const response = await initiatePayU({
        planId: selectedPlan.id,
        billingCycle
      }).unwrap();

      if (response.success && response.payuParams) {
        setPayuParams(response.payuParams);
        setStatusMessage('PayU Hash generated successfully. Choose an action below.');
      } else {
        setStatusMessage(response.message || 'Failed to initiate PayU transaction.');
      }
    } catch (err) {
      setStatusMessage(err?.data?.message || 'Error communicating with PayU Gateway.');
    }
  };

  // Option A: Submit live HTML Form to PayU Test Sandbox
  const handlePayURedirect = () => {
    if (!payuParams) return;
    
    // Create and auto-submit form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payuParams.action;

    Object.keys(payuParams).forEach((key) => {
      if (key !== 'action') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payuParams[key];
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  };

  // Option B: 1-Click PayU Simulation for Instant Local Test
  const handleSimulatePayment = async () => {
    try {
      setPaymentStep('SIMULATING');
      setStatusMessage('Simulating PayU 3D-Secure Test Authorization & Webhook...');

      const txnid = payuParams?.txnid || `PAYU_TEST_${Date.now()}`;
      const res = await verifyPayU({
        txnid,
        type: 'SUBSCRIPTION',
        targetId: selectedPlan.id,
        simulateSuccess: true
      }).unwrap();

      if (res.success) {
        setPaymentStep('SUCCESS');
        setStatusMessage(res.message || 'Payment Verified! SaaS Subscription is now active.');
      } else {
        setPaymentStep('ERROR');
        setStatusMessage(res.message || 'Verification failed.');
      }
    } catch (err) {
      setPaymentStep('ERROR');
      setStatusMessage(err?.data?.message || 'PayU simulation error.');
    }
  };

  // Pricing calculations
  const calculatePrice = (monthlyRate) => {
    if (monthlyRate === 0) return 0;
    if (billingCycle === 'yearly') {
      return Math.round(monthlyRate * 0.8); // 20% discount
    }
    return monthlyRate;
  };

  const getTaxBreakdown = (basePrice) => {
    const net = basePrice;
    const gst = Math.round(net * 0.18);
    const total = net + gst;
    return { net, gst, total };
  };

  const faqs = [
    {
      q: 'How does the PayU India Test Sandbox work?',
      a: 'We use PayU India’s official sandbox environment (https://test.payu.in/_payment) with merchant key gtKFFx. You can either test the live PayU redirect with simulated test cards or use our 1-Click Sandbox Test to verify subscription activation instantly.'
    },
    {
      q: 'Can I upgrade or downgrade my clinic subscription anytime?',
      a: 'Yes! You can switch between Free Starter, Clinic Pro, and Hospital Enterprise at any time. When upgrading, new doctor quotas and advanced features unlock immediately.'
    },
    {
      q: 'Are these subscription charges GST compliant?',
      a: 'Yes. An 18% Goods & Services Tax (GST) is applied to all paid SaaS subscriptions. You will receive an official digital tax invoice containing your clinic GSTIN for input tax credit.'
    },
    {
      q: 'Is our patient and doctor EHR data safe and compliant?',
      a: 'Absolutely. Doctor On Call complies with HIPAA and Medical Council of India (MCI) teleconsultation guidelines. All medical records, video visits, and prescriptions are secured with AES-256 encryption.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-20 pt-8 sm:pt-12 relative overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-teal-500/15 to-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SaaS Subscriptions &bull; PayU India Sandbox</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Transparent, Scalable Healthcare Cloud Pricing
            </h1>

            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
              Equip your medical practice, clinic, or hospital network with automated bookings, digital billing, EHR records, and enterprise support.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
            {plans.map((plan) => {
              const isPopular = plan.name.toLowerCase().includes('clinic') || plan.name.toLowerCase().includes('pro');
              const calculatedPrice = calculatePrice(plan.priceMonthly);

              let featuresList = [];
              try {
                featuresList = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []);
              } catch {
                featuresList = ['Standard Features'];
              }

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-slate-800/90 via-slate-800/70 to-slate-900/90 border-2 border-teal-500 shadow-2xl shadow-teal-500/10 lg:-translate-y-2'
                      : 'bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 hover:bg-slate-800/70 shadow-xl'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                      Most Popular For Clinics
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl sm:text-2xl font-black text-white">{plan.name}</h3>
                      <div className="h-10 w-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        {plan.priceMonthly === 0 ? <Zap className="h-5 w-5" /> : isPopular ? <Stethoscope className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium min-h-[36px]">
                      {plan.priceMonthly === 0 
                        ? 'Best for single practitioners starting out with online bookings.'
                        : isPopular 
                          ? 'Complete operating system for growing clinics and health centres.' 
                          : 'Full-scale cloud deployment for multispeciality hospitals & healthcare networks.'}
                    </p>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-slate-700/60">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-white">
                          ₹{calculatedPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 font-bold">
                          {plan.priceMonthly === 0 ? '/ forever free' : `/ doctor / month`}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                        <p className="text-xs text-teal-400 font-semibold mt-1">
                          Billed annually (₹{(calculatedPrice * 12).toLocaleString('en-IN')} / year)
                        </p>
                      )}
                    </div>

                    {/* Quota Highlights */}
                    <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Doctor Quota</span>
                        <span className="text-sm font-black text-teal-300">
                          {plan.doctorLimit >= 100 ? 'Unlimited' : `${plan.doctorLimit} Doctors`}
                        </span>
                      </div>
                      <div className="text-left border-l border-slate-700/60 pl-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient Quota</span>
                        <span className="text-sm font-black text-white">
                          {plan.patientLimit >= 50000 ? 'Unlimited' : `${plan.patientLimit.toLocaleString('en-IN')} Patients`}
                        </span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3 mb-8 text-left">
                      {featuresList.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA */}
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 hover:from-teal-300 hover:to-emerald-300 hover:shadow-teal-500/25'
                        : 'bg-white text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {plan.priceMonthly === 0 ? 'Get Started Free' : 'Subscribe with PayU Test'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* PayU Trust & Security Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 shadow-xl mb-20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  PayU India Sandbox Integration Ready
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Supports NetBanking, UPI, and Test Credit/Debit cards with SHA-512 cryptographic verification in sandbox testing mode.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-teal-300">
                Merchant: gtKFFx
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                Mode: Sandbox (test.payu.in)
              </span>
            </div>
          </div>

          {/* Feature Matrix Table */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Compare Plan Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Detailed side-by-side feature comparison for healthcare administrators
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-700/60 bg-slate-800/40 shadow-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60">
                    <th className="p-4 sm:p-5 font-bold text-slate-300">Feature</th>
                    <th className="p-4 sm:p-5 font-black text-slate-200">Free Starter</th>
                    <th className="p-4 sm:p-5 font-black text-teal-400">Clinic Pro</th>
                    <th className="p-4 sm:p-5 font-black text-purple-400">Hospital Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">Doctor Accounts</td>
                    <td className="p-4 sm:p-5 text-slate-400">Up to 3</td>
                    <td className="p-4 sm:p-5 font-bold text-teal-300">Up to 15</td>
                    <td className="p-4 sm:p-5 font-bold text-purple-300">Unlimited (100+)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">Monthly Active Patients</td>
                    <td className="p-4 sm:p-5 text-slate-400">100</td>
                    <td className="p-4 sm:p-5 font-bold text-white">1,500</td>
                    <td className="p-4 sm:p-5 font-bold text-white">50,000+</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">Video Consultation & Telehealth</td>
                    <td className="p-4 sm:p-5 text-slate-400">Standard HD</td>
                    <td className="p-4 sm:p-5 text-teal-300">Unlimited 1080p</td>
                    <td className="p-4 sm:p-5 text-purple-300">Dedicated TURN / Peer Mesh</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">EHR & Digital Prescriptions (Rx)</td>
                    <td className="p-4 sm:p-5"><Check className="h-4 w-4 text-teal-400" /></td>
                    <td className="p-4 sm:p-5"><Check className="h-4 w-4 text-teal-400" /></td>
                    <td className="p-4 sm:p-5"><Check className="h-4 w-4 text-purple-400" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">Automated GST Invoices & Billing</td>
                    <td className="p-4 sm:p-5 text-slate-500">&mdash;</td>
                    <td className="p-4 sm:p-5"><Check className="h-4 w-4 text-teal-400" /></td>
                    <td className="p-4 sm:p-5"><Check className="h-4 w-4 text-purple-400" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">Custom Subdomain Branding</td>
                    <td className="p-4 sm:p-5 text-slate-500">&mdash;</td>
                    <td className="p-4 sm:p-5 text-slate-500">&mdash;</td>
                    <td className="p-4 sm:p-5"><Check className="h-4 w-4 text-purple-400" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium">Support SLA</td>
                    <td className="p-4 sm:p-5 text-slate-400">Community</td>
                    <td className="p-4 sm:p-5 font-bold text-teal-300">24/7 Priority Email</td>
                    <td className="p-4 sm:p-5 font-bold text-purple-300">Dedicated Account Exec</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto mb-20 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = faqOpenIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-700/70 bg-slate-800/40 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm sm:text-base text-white hover:text-teal-400"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-teal-400' : 'text-slate-400'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/50 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* PayU Test Checkout Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setPaymentStep('INIT');
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>

              {paymentStep === 'SUCCESS' ? (
                <div className="text-center py-6">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Subscription Activated!</h3>
                  <p className="text-sm text-slate-300 mt-2">{statusMessage}</p>

                  <div className="mt-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plan:</span>
                      <span className="font-bold text-white">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Gateway:</span>
                      <span className="font-bold text-teal-400">PayU India (Sandbox Test)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Doctor Limit:</span>
                      <span className="font-bold text-emerald-400">{selectedPlan.doctorLimit} Doctors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-emerald-400">ACTIVE &bull; 100% Verified</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href="/clinic"
                      className="flex-1 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs text-center transition-all"
                    >
                      Go to Clinic Workspace
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Modal Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        PayU India Test Checkout
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        Sandbox Environment &bull; key: gtKFFx
                      </span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  {(() => {
                    const price = calculatePrice(selectedPlan.priceMonthly);
                    const { net, gst, total } = getTaxBreakdown(price);

                    return (
                      <div className="space-y-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs mb-5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Selected Tier:</span>
                          <span className="font-bold text-white text-sm">{selectedPlan.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Billing Term:</span>
                          <span className="font-bold text-teal-400 uppercase">{billingCycle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Base Price:</span>
                          <span className="text-slate-200">₹{net.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">GST (18%):</span>
                          <span className="text-slate-200">₹{gst.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-700/80 font-black text-sm text-white">
                          <span>Total Amount:</span>
                          <span className="text-teal-300">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Sandbox credentials hint */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-xs text-indigo-300 mb-5 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-indigo-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>PayU Test Credentials (Sandbox):</span>
                    </div>
                    <p className="text-[11px] text-indigo-300/90 font-mono">
                      Test Cards: 5123 4567 8901 2346 | Any CVV & Future Expiry
                    </p>
                    <p className="text-[11px] text-indigo-300/90 font-mono">
                      UPI VPA: success@payu
                    </p>
                  </div>

                  {statusMessage && (
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 mb-5">
                      {statusMessage}
                    </div>
                  )}

                  {/* PayU Actions */}
                  {!payuParams ? (
                    <button
                      type="button"
                      onClick={handleInitiatePayU}
                      disabled={isInitiating}
                      className="w-full py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      {isInitiating ? (
                        <span>Preparing PayU Hash...</span>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Generate PayU SHA-512 Hash</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        disabled={isVerifying}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-95"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isVerifying ? 'Verifying...' : '⚡ 1-Click PayU Test Simulation'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePayURedirect}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-teal-400" />
                        <span>Redirect to Official PayU Sandbox Page</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

