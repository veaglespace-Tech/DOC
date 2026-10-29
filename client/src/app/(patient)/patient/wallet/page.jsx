'use client';

import React, { useState, useMemo } from 'react';
import { useGetPatientBillingHistoryQuery } from '@/store/api/billingApi';
import { 
  Receipt, 
  Download, 
  CreditCard, 
  ShieldCheck, 
  TrendingDown, 
  Calendar, 
  Search, 
  ArrowUpRight, 
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function PatientWalletPage() {
  const { data: historyData, isLoading, error } = useGetPatientBillingHistoryQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const history = useMemo(() => historyData?.data || [], [historyData]);

  const totalSpent = useMemo(() => {
    return history.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) return history;
    const term = searchTerm.toLowerCase();
    return history.filter(p => 
      p.appointment?.doctor?.user?.name?.toLowerCase().includes(term) ||
      (p.razorpayPaymentId || '').toLowerCase().includes(term) ||
      `CC-PAY-${p.id}`.toLowerCase().includes(term)
    );
  }, [history, searchTerm]);

  const handleDownloadInvoice = async (paymentId) => {
    setDownloadingId(paymentId);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/billing/invoice/${paymentId}/download`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await res.blob();
      const objUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `doctoroncall-invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Invoice Download Error", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading Billing History & Invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto my-12 text-center bg-rose-50 border border-rose-200 rounded-3xl">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-900">Failed to load billing records</h3>
        <p className="text-sm text-rose-600 mt-1">Please check your internet connection or login status.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black uppercase tracking-wider">
              BRD Section 10 & 16
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> GST Tax Compliant
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Wallet & Tax Invoices</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your past consultation expenses, download 18% GST invoices, and view receipts.
          </p>
        </div>

        <Link
          href="/patient/appointments"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all self-start sm:self-center"
        >
          <Calendar className="h-4 w-4 text-teal-400" /> Bookings Roster
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Spent */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Receipt className="h-28 w-28 text-white" />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Total Consultation Spend</p>
          <h3 className="text-3xl font-black mt-2 tracking-tight text-white flex items-center">
            ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" /> All payments verified via Razorpay
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Invoices</span>
            <div className="h-10 w-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black mt-2 text-slate-900">{history.length}</h3>
          <p className="text-xs text-slate-500 mt-2">100% downloadable with GST breakdowns</p>
        </div>

        {/* Settlement & Security */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Protection</span>
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-xl font-black mt-2 text-slate-900">24-Hr Escrow Hold</h3>
          <p className="text-xs text-slate-500 mt-2">Instant refunds guaranteed on unfulfilled visits</p>
        </div>
      </div>

      {/* Transactions List Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Table Header & Search Filter */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Transaction & Invoice Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing confirmed payments and generated tax receipts</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor or TXN ID..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
        </div>

        {/* List Content */}
        {filteredHistory.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <Receipt className="h-12 w-12 mx-auto text-slate-300 stroke-[1.5]" />
            <h4 className="text-base font-bold text-slate-700">No Transactions Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm ? 'No payments match your search filter.' : 'When you book consultations or emergency visits, your invoices will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredHistory.map((payment) => (
              <div 
                key={payment.id} 
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Consultation with Dr. {payment.appointment?.doctor?.user?.name || 'Practitioner'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        TXN: {payment.razorpayPaymentId || `CC-PAY-${payment.id}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xl font-black text-slate-900">
                      ₹{Number(payment.amount).toFixed(2)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> PAID
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDownloadInvoice(payment.id)}
                    disabled={downloadingId === payment.id}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {downloadingId === payment.id ? 'Generating...' : 'GST Invoice PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety & Compliance Card */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 shrink-0">
          <ShieldCheck className="h-6 w-6 text-teal-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-800">Strict Financial Traceability & GST Compliance</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Doctor On Call generates compliant GST invoices with distinct 9% CGST + 9% SGST breakdown. All transactions are logged in a tamper-proof financial ledger.
          </p>
        </div>
        <Link 
          href="/terms" 
          className="text-xs font-bold text-teal-700 hover:text-teal-800 underline shrink-0"
        >
          View Billing Terms
        </Link>
      </div>

    </div>
  );
}
