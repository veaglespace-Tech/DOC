'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  FileText, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  Search, 
  Filter, 
  ArrowUpRight,
  Receipt,
  Sparkles,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetClinicBillingQuery } from '@/store/api/saasApi';

export default function ClinicBillingPage() {
  const { data: billingData, isLoading, refetch } = useGetClinicBillingQuery();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const summary = billingData?.data?.summary || {
    totalInvoices: 0,
    totalRevenue: 0,
    gstCollected: 0,
    pendingAmount: 0
  };

  const invoices = billingData?.data?.invoices || [];

  const filteredInvoices = invoices.filter(inv => {
    const patientName = inv.appointment?.patient?.name?.toLowerCase() || '';
    const doctorName = inv.appointment?.doctor?.name?.toLowerCase() || '';
    const matchesSearch = patientName.includes(searchQuery.toLowerCase()) || 
                          doctorName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (paymentId) => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token')) : '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    window.open(`${apiUrl}/billing/invoice/${paymentId}/download?token=${token}`, '_blank');
  };

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            Clinic Financials & GST
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Billing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Invoices</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Real-time OPD collections, automated GST invoices, and settlement ledgers.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
        >
          <Printer className="h-4 w-4 text-emerald-600" />
          Print Ledger
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 flex items-center">
              <IndianRupee className="h-6 w-6 text-slate-400" />
              {summary.totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-500">GST Collected (18%)</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 flex items-center">
              <IndianRupee className="h-6 w-6 text-slate-400" />
              {summary.gstCollected.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Receipt className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Pending Dues</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 flex items-center">
              <IndianRupee className="h-6 w-6 text-slate-400" />
              {summary.pendingAmount.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Invoices</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{summary.totalInvoices}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4 relative z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, doctor, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Invoices</option>
            <option value="COMPLETED">Paid / Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Fetching clinic billing logs...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm relative z-10">
          <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Invoices Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
            No transactions match your current search or status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-6">Patient</th>
                  <th className="py-4 px-6">Doctor / Service</th>
                  <th className="py-4 px-6">Amount (INR)</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      INV-{String(inv.id).padStart(5, '0')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{inv.appointment?.patient?.name || 'Walk-in'}</div>
                      <div className="text-xs text-slate-400">{inv.appointment?.patient?.phone || '—'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>Dr. {inv.appointment?.doctor?.name || 'Staff'}</div>
                      <div className="text-xs text-slate-400">{inv.appointment?.type || 'OPD'}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ₹ {Number(inv.amount).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                        {inv.paymentMethod || 'RAZORPAY'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                        inv.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        inv.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(inv.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
