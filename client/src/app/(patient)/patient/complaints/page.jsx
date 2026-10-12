'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  ChevronRight,
  LifeBuoy
} from 'lucide-react';

export default function PatientComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState('Doctor issue');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/feedback/my-complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/feedback/complaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, description })
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Complaint registered successfully! Ticket #' + data.data.id });
        setDescription('');
        fetchComplaints();
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to submit complaint' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Network error submitting complaint' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider">
              Patient Care & Resolution
            </span>
            <span className="text-xs text-slate-400 font-bold">BRD Section 19</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Help, Support & Complaints</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Submit any issue regarding doctors, payments, appointments, or technical problems.
          </p>
        </div>

        <Link
          href="/patient"
          className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-center"
        >
          Back to Dashboard
        </Link>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Lodge a Complaint */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 h-fit">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-rose-500" /> Lodge a Ticket
            </h3>
            <p className="text-xs text-slate-500 mt-1">Our support operations team will inspect and respond within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Doctor issue">Doctor issue</option>
                <option value="Payment issue">Payment issue</option>
                <option value="Visit issue">Visit issue</option>
                <option value="Refund issue">Refund issue</option>
                <option value="Technical issue">Technical issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what went wrong in detail..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow-lg shadow-rose-600/20 disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Registering...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* Right List: Past Tickets */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">My Support Tickets</h3>
            <span className="text-xs font-bold text-slate-500">{complaints.length} tickets</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading tickets...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              You haven't submitted any complaints.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <div key={c.id} className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {c.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">#{c.id}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' :
                      c.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-800 font-medium">{c.description}</p>
                  
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Filed on {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
