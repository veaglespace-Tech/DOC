'use client';

import React, { useState } from 'react';
import { useGetMyAppointmentsQuery } from '@/store/api/appointmentApi';
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
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { data: response, isLoading, refetch } = useGetMyAppointmentsQuery();
  const appointments = response?.data || [];

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleOpenReview = (apt) => {
    setSelectedAppointment(apt);
    setRating(5);
    setReviewText('');
    setReviewSuccess(false);
    setReviewModalOpen(true);
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
            <p className="text-slate-500 font-medium mb-6">You don't have any upcoming or past appointments.</p>
            <Link href="/search">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                Find a Doctor
              </button>
            </Link>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <img 
                      src={apt.doctor?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(apt.doctor?.name || "Doctor") + "&background=0D8ABC&color=fff"} 
                      alt="Doctor"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{apt.doctor?.name || "Doctor"}</h3>
                    <p className="text-sm font-bold text-teal-600 mb-2">{apt.doctor?.specializations?.[0]?.specialization || "General Physician"}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(apt.scheduledAt || apt.createdAt))}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" /> {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(apt.scheduledAt || apt.createdAt))}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {apt.serviceType === 'VIRTUAL' ? <Video className="h-4 w-4 text-indigo-400" /> : apt.serviceType === 'HOME_VISIT' ? <Navigation className="h-4 w-4 text-amber-400" /> : <MapPin className="h-4 w-4 text-rose-400" />} 
                        {apt.serviceType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 md:items-end md:flex-col h-full justify-between">
                  <div className="w-full sm:w-auto text-center">
                    <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl inline-block w-full ${
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      apt.status === 'PAID' || apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                      apt.status === 'REQUESTED' ? 'bg-amber-100 text-amber-700' : 
                      apt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {apt.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleOpenReview(apt)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Review Doctor
                      </button>
                    )}

                    <Link
                      href={`/patient/consultation/${apt.id}`}
                      className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Video className="h-3.5 w-3.5" /> Join Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
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

    </div>
  );
}
