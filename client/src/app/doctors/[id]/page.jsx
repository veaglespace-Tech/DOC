'use client';

import React, { use, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  IndianRupee, 
  Calendar, 
  CheckCircle, 
  ChevronLeft,
  Video,
  Home,
  Building,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  FileText,
  Loader2,
  PhoneCall,
  Lock,
  User,
  ArrowRight
} from 'lucide-react';
import { useGetDoctorByIdQuery } from '@/store/api/doctorApi';
import { useCreateAppointmentMutation } from '@/store/api/appointmentApi';
import { useInitiatePaymentMutation, useVerifyPaymentMutation } from '@/store/api/paymentApi';

export default function DoctorProfilePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id || '1';
  const router = useRouter();

  const { user, token, role: currentRole } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeRole = currentRole || user?.role || user?.roles?.[0];
  const isLoggedIn = mounted && Boolean(token && user);
  const isPatient = mounted && Boolean(activeRole === 'PATIENT');

  const { data: response, isLoading, isError } = useGetDoctorByIdQuery(id);
  const doctor = response?.data;

  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();
  const [initiatePayment, { isLoading: isInitiatingPay }] = useInitiatePaymentMutation();
  const [verifyPayment, { isLoading: isVerifyingPay }] = useVerifyPaymentMutation();

  // Dynamic 7 upcoming days
  const upcomingDays = useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        index: i,
        dayName: i === 0 ? 'Today' : dayNames[d.getDay()],
        dayNumber: d.getDate(),
        month: monthNames[d.getMonth()],
        fullDate: d.toISOString().split('T')[0]
      });
    }
    return days;
  }, []);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [serviceType, setServiceType] = useState('NORMAL'); // NORMAL, VIRTUAL, HOME_VISIT
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Booking & Payment Flow Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const timeSlots = [
    '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '12:00 PM', '04:00 PM', '04:30 PM', 
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  const currentFee = useMemo(() => {
    if (!doctor) return 500;
    if (serviceType === 'HOME_VISIT') return doctor.homeVisitFee || 1000;
    if (serviceType === 'VIRTUAL') return doctor.fee || 600;
    return doctor.fee || 600;
  }, [doctor, serviceType]);

  const handleProceedToBook = async () => {
    setErrorMsg('');

    if (!token || !user) {
      router.push(`/login/patient?returnUrl=${encodeURIComponent(`/doctors/${id}`)}`);
      return;
    }

    if (activeRole && activeRole !== 'PATIENT') {
      setErrorMsg(`You are currently signed in as ${activeRole}. Doctor appointments can only be booked by registered Patient accounts.`);
      return;
    }

    try {
      // Calculate scheduled ISO timestamp
      const chosenDay = upcomingDays[selectedDayIndex];
      const [timeStr, meridiem] = selectedTime.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      const scheduledDate = new Date(`${chosenDay.fullDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000Z`);

      const appointmentRes = await createAppointment({
        doctorId: parseInt(id),
        serviceType,
        scheduledAt: scheduledDate.toISOString(),
        notes: notes || undefined
      }).unwrap();

      const createdApt = appointmentRes.data;
      setPendingAppointment(createdApt);

      // Initiate payment
      const payRes = await initiatePayment({ appointmentId: createdApt.id }).unwrap();
      setPaymentDetails(payRes.data);
      setShowPaymentModal(true);
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Failed to book appointment. Please check availability and login status.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!pendingAppointment || !paymentDetails) return;

    try {
      await verifyPayment({
        appointmentId: pendingAppointment.id,
        razorpay_order_id: paymentDetails.orderId,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: 'signature_verified_mock'
      }).unwrap();

      setPaymentSuccess(true);
    } catch (err) {
      alert(err?.data?.message || 'Payment verification failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800">
        <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-4" />
        <p className="font-bold text-slate-500">Loading Doctor Profile...</p>
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Doctor Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">The requested doctor profile could not be loaded or is unavailable.</p>
          <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all">
            <ChevronLeft className="h-4 w-4" /> Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-6">
        <Link href="/search" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-semibold mb-8 transition-colors">
          <ChevronLeft className="h-5 w-5" /> Back to Doctor Search
        </Link>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: DOCTOR DETAILS */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row gap-8 relative z-10">
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-lg">
                  <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{doctor.name}</h1>
                    <ShieldCheck className="h-7 w-7 text-teal-500" />
                  </div>
                  
                  <p className="text-xl font-bold text-teal-600 mb-2">{doctor.specialty}</p>
                  <p className="text-slate-500 font-medium mb-4">{doctor.qualifications}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-yellow-200">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> {doctor.rating} ({doctor.reviews} Reviews)
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200">
                      <Clock className="h-4 w-4 text-slate-500" /> {doctor.experience}
                    </div>
                  </div>

                  <div className="space-y-2 text-slate-600 font-medium">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                      <p>{doctor.location} &bull; <span className="text-slate-500 font-normal">{doctor.address}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Doctor</h2>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                {doctor.about}
              </p>

              {doctor.specializations?.length > 1 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Patient Reviews Section */}
            {doctor.recentReviews?.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Verified Patient Reviews</h3>
                <div className="space-y-4">
                  {doctor.recentReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 text-sm">{rev.patient?.name || 'Verified Patient'}</span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> {rev.rating} / 5
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm">{rev.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: INTERACTIVE BOOKING WIDGET */}
          <div className="w-full lg:w-[450px] shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-28 overflow-hidden">
              
              {/* Fee banner */}
              <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/30 blur-[40px] rounded-full pointer-events-none"></div>
                <h3 className="text-sm uppercase tracking-wider text-teal-300 font-bold mb-1 relative z-10">Consultation Charges</h3>
                <div className="flex justify-center items-center gap-1 text-4xl font-extrabold text-teal-400 relative z-10">
                  <IndianRupee className="h-8 w-8" /> {currentFee}
                </div>
                <p className="text-xs text-slate-400 mt-1">Inclusive of GST & Platform Service Charge</p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* User Auth Status Banner */}
                {mounted && (
                  <>
                    {!isLoggedIn ? (
                      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-amber-950 flex items-center gap-1.5">
                            <span>Patient Login Required</span>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                              Compulsory
                            </span>
                          </p>
                          <p className="text-amber-800 mt-1 leading-relaxed">
                            Booking consultations requires an active Patient account for EHR sync and token generation.
                          </p>
                          <Link
                            href={`/login/patient?returnUrl=${encodeURIComponent(`/doctors/${id}`)}`}
                            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold mt-2 underline underline-offset-2"
                          >
                            Sign in now <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ) : !isPatient ? (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-700 mt-0.5">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-rose-950">Patient Role Required</p>
                          <p className="text-rose-800 mt-1 leading-relaxed">
                            You are signed in as <strong className="uppercase">{activeRole || 'User'}</strong>. Please switch to a Patient account to book.
                          </p>
                          <Link
                            href={`/login/patient?returnUrl=${encodeURIComponent(`/doctors/${id}`)}`}
                            className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-bold mt-2 underline underline-offset-2"
                          >
                            Switch to Patient Account <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                            {user.name ? user.name[0].toUpperCase() : 'P'}
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-slate-900 leading-snug">Booking as {user.name || 'Patient'}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                          Verified Patient
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* 1. Select Service Type */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">1. Select Service Mode</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setServiceType('NORMAL')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        serviceType === 'NORMAL'
                          ? 'border-teal-500 bg-teal-50/70 text-teal-800 font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Building className="h-5 w-5 text-teal-600" />
                      <span className="text-xs">Clinic Visit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('VIRTUAL')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        serviceType === 'VIRTUAL'
                          ? 'border-teal-500 bg-teal-50/70 text-teal-800 font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Video className="h-5 w-5 text-indigo-600" />
                      <span className="text-xs">Video Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('HOME_VISIT')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        serviceType === 'HOME_VISIT'
                          ? 'border-teal-500 bg-teal-50/70 text-teal-800 font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Home className="h-5 w-5 text-amber-600" />
                      <span className="text-xs">Home Visit</span>
                    </button>
                  </div>
                </div>

                {/* 2. Select Date */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">2. Select Date</h4>
                  </div>
                  
                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {upcomingDays.map((d) => (
                      <button 
                        key={d.index}
                        onClick={() => setSelectedDayIndex(d.index)}
                        className={`shrink-0 snap-center w-16 py-3 rounded-2xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                          selectedDayIndex === d.index 
                            ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/30 transform scale-105' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400'
                        }`}
                      >
                        <span className={`text-[10px] font-black uppercase ${selectedDayIndex === d.index ? 'text-teal-100' : 'text-slate-400'}`}>
                          {d.dayName}
                        </span>
                        <span className={`text-base font-black ${selectedDayIndex === d.index ? 'text-white' : 'text-slate-900'}`}>
                          {d.dayNumber}
                        </span>
                        <span className={`text-[10px] ${selectedDayIndex === d.index ? 'text-teal-100' : 'text-slate-400'}`}>
                          {d.month}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Select Time */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">3. Select Slot</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedTime === time 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Notes / Symptoms (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Reason / Symptoms (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fever, Routine Checkup, Followup"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Proceed Button */}
                {mounted && !isLoggedIn ? (
                  <button 
                    type="button"
                    onClick={() => router.push(`/login/patient?returnUrl=${encodeURIComponent(`/doctors/${id}`)}`)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-600/25 cursor-pointer"
                  >
                    <Lock className="h-5 w-5" />
                    <span>Log in as Patient to Book</span>
                  </button>
                ) : mounted && !isPatient ? (
                  <button 
                    type="button"
                    onClick={() => router.push(`/login/patient?returnUrl=${encodeURIComponent(`/doctors/${id}`)}`)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-rose-600/25 cursor-pointer"
                  >
                    <User className="h-5 w-5" />
                    <span>Switch to Patient Account</span>
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={handleProceedToBook}
                    disabled={isBooking || isInitiatingPay}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isBooking || isInitiatingPay ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating Appointment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" /> Proceed to Book & Pay
                      </>
                    )}
                  </button>
                )}

                <p className="text-center text-[11px] text-slate-400 font-medium">
                  🔒 100% Secure Checkout &bull; Instant Confirmation
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* PAYMENT & CONFIRMATION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            {!paymentSuccess ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Doctor On Call Checkout</h3>
                    <p className="text-xs text-slate-400">Order ID: {paymentDetails?.orderId || `DOC-ORD-${pendingAppointment?.id}`}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor</span>
                    <span className="font-bold text-slate-800">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service</span>
                    <span className="font-bold text-slate-800">{serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled At</span>
                    <span className="font-bold text-slate-800">
                      {new Date(pendingAppointment.scheduledAt).toLocaleDateString()} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black">
                    <span className="text-slate-900">Total Payable</span>
                    <span className="text-teal-600">₹ {paymentDetails?.amount || currentFee}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-6 flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Payment Gateway Sandbox active. Click <strong>Pay & Confirm</strong> to verify payment and complete booking.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isVerifyingPay}
                    className="flex-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    {isVerifyingPay ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>Pay ₹{paymentDetails?.amount || currentFee} & Confirm</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Your appointment with {doctor.name} is successfully scheduled and paid.
                </p>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 mb-6">
                  <p className="text-xs uppercase font-bold text-teal-700 tracking-wider">Your Visit Token</p>
                  <p className="text-2xl font-black text-teal-900 mt-1">{pendingAppointment?.tokenNumber || 'T-SUCCESS'}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/patient/appointments"
                    className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-600/30"
                  >
                    View in My Appointments
                  </Link>
                  <Link
                    href={`/patient/consultation/${pendingAppointment?.id}`}
                    className="w-full py-3 text-slate-600 hover:text-slate-900 font-bold text-xs"
                  >
                    Open Consultation Room
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
