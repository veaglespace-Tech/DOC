'use client';

import React, { useState } from 'react';
import { useGetMyAppointmentsQuery } from '@/store/api/appointmentApi';
import { useInitiatePaymentMutation, useVerifyPaymentMutation, useRequestRefundMutation } from '@/store/api/paymentApi';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Stethoscope, 
  Video, 
  Navigation,
  Star,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  X,
  Loader2,
  FileText,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { data: response, isLoading, refetch } = useGetMyAppointmentsQuery();
  const appointments = response?.data || [];

  const [initiatePayment] = useInitiatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [requestRefund, { isLoading: isRefunding }] = useRequestRefundMutation();
  const [payingAptId, setPayingAptId] = useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAppointment, setRefundAppointment] = useState(null);
  const [refundReason, setRefundReason] = useState('Change of schedule / Doctor unavailable');
  const [refundMsg, setRefundMsg] = useState('');
  const [downloadingPdfId, setDownloadingPdfId] = useState(null);

  const handleDownloadPrescription = async (appointmentId) => {
    setDownloadingPdfId(appointmentId);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/appointments/${appointmentId}/prescription/pdf`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Prescription PDF is not ready or could not be downloaded.');
      }
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Prescription-CC-${appointmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert(err.message || 'Error downloading prescription PDF');
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const handleOpenReview = (apt) => {
    setSelectedAppointment(apt);
    setRating(5);
    setReviewText('');
    setReviewSuccess(false);
    setReviewModalOpen(true);
  };

  const handleOpenRefund = (apt) => {
    setRefundAppointment(apt);
    setRefundReason('Change of schedule / Doctor unavailable');
    setRefundMsg('');
    setRefundModalOpen(true);
  };

  const submitRefund = async (e) => {
    e.preventDefault();
    if (!refundAppointment) return;
    try {
      await requestRefund({
        appointmentId: refundAppointment.id,
        reason: refundReason
      }).unwrap();
      setRefundMsg('Refund initiated successfully! Funds will reflect in your account per banking timelines.');
      setTimeout(() => {
        setRefundModalOpen(false);
        refetch();
      }, 1500);
    } catch (err) {
      alert(err?.data?.message || 'Failed to request refund');
    }
  };


  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/feedback/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          rating,
          review: reviewText
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setTimeout(() => {
          setReviewModalOpen(false);
          refetch();
        }, 1500);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePayNow = async (apt) => {
    setPayingAptId(apt.id);
    try {
      const payRes = await initiatePayment({ appointmentId: apt.id }).unwrap();
      const details = payRes.data;
      
      const mockPayId = `pay_${details?.orderId || apt.id}`;
      
      await verifyPayment({
        appointmentId: apt.id,
        razorpay_order_id: details.orderId,
        razorpay_payment_id: mockPayId,
        razorpay_signature: 'signature_verified_mock'
      }).unwrap();

      alert('Payment successful! Your appointment is now marked as PAID.');
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayingAptId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-slate-500 font-medium mt-1">Track and manage your upcoming and past visits.</p>
        </div>
        <Link href="/search">
          <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5">
            <Stethoscope className="h-5 w-5" />
            Book New Appointment
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
            <div className="h-20 w-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h3>
            <p className="text-slate-500 font-medium mb-6">You don&apos;t have any upcoming or past appointments.</p>
            <Link href="/search">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                Find a Doctor
              </button>
            </Link>
          </div>
        ) : (
          appointments.map((apt) => {
            const isCompleted = apt.status === 'COMPLETED';
            const isOnTheWay = apt.status === 'ON_THE_WAY';
            const isArrived = apt.status === 'ARRIVED';
            const isAccepted = apt.status === 'DOCTOR_ACCEPTED' || apt.status === 'PAID';
            const isPending = apt.status === 'REQUESTED' || apt.status === 'PAYMENT_PENDING';
            const isCancelled = apt.status === 'CANCELLED' || apt.status === 'REFUND';

            return (
              <div key={apt.id} className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-indigo-200 transition-all space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md shadow-indigo-500/20 flex items-center justify-center text-white font-black text-xl">
                      {apt.doctor?.profileImage ? (
                        <img 
                          src={apt.doctor.profileImage} 
                          alt="Doctor"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{apt.doctor?.name?.charAt(0) || "D"}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900">{apt.doctor?.name || "Doctor"}</h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold">
                          #{apt.id}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-indigo-600 mb-2">{apt.doctor?.specializations?.[0]?.specialization || "General Physician"}</p>
                      
                      <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(apt.scheduledAt || apt.createdAt))}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" /> {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(apt.scheduledAt || apt.createdAt))}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                          {apt.serviceType === 'VIRTUAL' ? <Video className="h-3 w-3 text-indigo-500" /> : apt.serviceType === 'HOME_VISIT' ? <Navigation className="h-3 w-3 text-amber-500" /> : <MapPin className="h-3 w-3 text-rose-500" />} 
                          {apt.serviceType}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 md:items-end md:flex-col h-full justify-between">
                    <div className="w-full sm:w-auto text-center">
                      <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl inline-block w-full ${
                        apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        apt.status === 'PAID' || apt.status === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 
                        apt.status === 'DOCTOR_ACCEPTED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        apt.status === 'ON_THE_WAY' ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300' :
                        apt.status === 'ARRIVED' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                        apt.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        apt.status === 'REQUESTED' || apt.status === 'PAYMENT_PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                        apt.status === 'CANCELLED' || apt.status === 'REFUND' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.status === 'ON_THE_WAY' ? '🚗 Doctor on the Way' : apt.status === 'ARRIVED' ? '📍 Doctor Arrived' : apt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      {(apt.status === 'REQUESTED' || apt.status === 'PAYMENT_PENDING') && (
                        <button
                          onClick={() => handlePayNow(apt)}
                          disabled={payingAptId === apt.id}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/25 disabled:opacity-50"
                        >
                          {payingAptId === apt.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                          <span>Pay Now</span>
                        </button>
                      )}

                      {/* Cancel & Refund Button (BRD Sec 13) */}
                      {(apt.status === 'PAID' || apt.status === 'DOCTOR_ACCEPTED' || apt.status === 'REQUESTED') && (
                        <button
                          onClick={() => handleOpenRefund(apt)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-rose-600" /> Cancel & Refund
                        </button>
                      )}

                      {apt.status === 'COMPLETED' && (
                        <>
                          <button
                            onClick={() => handleOpenReview(apt)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                          >
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Review Doctor
                          </button>
                          <button
                            onClick={() => handleDownloadPrescription(apt.id)}
                            disabled={downloadingPdfId === apt.id}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            {downloadingPdfId === apt.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <FileText className="h-3.5 w-3.5" />
                            )}
                            <span>{downloadingPdfId === apt.id ? 'Downloading...' : 'View Rx PDF'}</span>
                          </button>
                        </>
                      )}

                      <Link
                        href={`/patient/consultation/${apt.id}`}
                        className="flex-1 sm:flex-none bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Video className="h-3.5 w-3.5" /> Enter Room
                      </Link>
                    </div>
                  </div>

                </div>

                {/* Milestone Stepper Ribbon */}
                {!isCancelled && (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <div className={`flex items-center gap-1.5 ${isPending || isAccepted || isOnTheWay || isArrived || isCompleted ? 'text-indigo-600 font-black' : ''}`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${isPending || isAccepted || isOnTheWay || isArrived || isCompleted ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                        <span>1. Booked</span>
                      </div>
                      <div className="h-0.5 flex-1 mx-2 bg-slate-100 relative">
                        <div className={`h-full bg-indigo-500 transition-all ${isAccepted || isOnTheWay || isArrived || isCompleted ? 'w-full' : 'w-0'}`}></div>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isAccepted || isOnTheWay || isArrived || isCompleted ? 'text-indigo-600 font-black' : ''}`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${isAccepted || isOnTheWay || isArrived || isCompleted ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                        <span>2. Accepted</span>
                      </div>
                      {(apt.serviceType === 'HOME_VISIT' || apt.serviceType === 'EMERGENCY') && (
                        <>
                          <div className="h-0.5 flex-1 mx-2 bg-slate-100 relative">
                            <div className={`h-full bg-indigo-500 transition-all ${isOnTheWay || isArrived || isCompleted ? 'w-full' : 'w-0'}`}></div>
                          </div>
                          <div className={`flex items-center gap-1.5 ${isOnTheWay || isArrived || isCompleted ? 'text-indigo-600 font-black' : ''}`}>
                            <div className={`h-2.5 w-2.5 rounded-full ${isOnTheWay || isArrived || isCompleted ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                            <span>3. Transit</span>
                          </div>
                        </>
                      )}
                      <div className="h-0.5 flex-1 mx-2 bg-slate-100 relative">
                        <div className={`h-full bg-emerald-500 transition-all ${isCompleted ? 'w-full' : 'w-0'}`}></div>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isCompleted ? 'text-emerald-600 font-black' : ''}`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                        <span>{apt.serviceType === 'HOME_VISIT' || apt.serviceType === 'EMERGENCY' ? '4. Completed' : '3. Completed'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal per BRD Sec 19 */}
      {reviewModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            {reviewSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
                <p className="text-slate-500 text-sm mt-1">Your review and rating have been recorded.</p>
              </div>
            ) : (
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Rate Your Consultation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Dr. {selectedAppointment.doctor?.name} • Token {selectedAppointment.tokenNumber}
                  </p>
                </div>

                {/* Star Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-2 rounded-xl hover:bg-amber-50 transition-colors"
                      >
                        <Star className={`h-8 w-8 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Feedback (Optional)</label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe doctor's punctuality, friendliness and medical advice..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-lg shadow-teal-600/20 disabled:bg-slate-300"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Patient Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cancel & Refund Modal per BRD Sec 13 */}
      {refundModalOpen && refundAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setRefundModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-rose-600">
              <RotateCcw className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Appointment Cancellation & Refund</span>
            </div>

            <h3 className="text-xl font-black text-slate-900">Cancel & Refund</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cancelling appointment with {refundAppointment.doctor?.name || 'Doctor'}. Eligible refund will be initiated to your original payment method per BRD Section 13.
            </p>

            {refundMsg ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                {refundMsg}
              </div>
            ) : (
              <form onSubmit={submitRefund} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason for Cancellation</label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Change of schedule / Doctor unavailable">Change of schedule / Doctor unavailable</option>
                    <option value="Accidental booking / duplicate">Accidental booking / duplicate</option>
                    <option value="Medical condition resolved">Medical condition resolved</option>
                    <option value="Consulted another doctor">Consulted another doctor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Full payment amount including consultation fee will be refunded. Processing may take 3-5 business days based on bank gateway.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRefundModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 text-sm"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    disabled={isRefunding}
                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 disabled:opacity-50"
                  >
                    {isRefunding ? 'Processing...' : 'Confirm Refund'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

