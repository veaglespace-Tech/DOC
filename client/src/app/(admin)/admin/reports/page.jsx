'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  IndianRupee, 
  Users, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Receipt, 
  Clock, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloadingType, setDownloadingType] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const setPresetRange = (preset) => {
    const today = new Date();
    const endStr = today.toISOString().split('T')[0];
    let startStr = '';

    if (preset === '7d') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      startStr = d.toISOString().split('T')[0];
    } else if (preset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      startStr = d.toISOString().split('T')[0];
    } else if (preset === 'month') {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      startStr = d.toISOString().split('T')[0];
    } else {
      // All time
      startStr = '';
    }

    setStartDate(startStr);
    setEndDate(preset === 'all' ? '' : endStr);
  };

  const handleDownloadReport = async (reportType, filenameLabel) => {
    setDownloadingType(reportType);
    setFeedback({ text: '', type: '' });

    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const params = new URLSearchParams();
      params.append('type', reportType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/admin/reports/export?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const objUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      const dateTag = new Date().toISOString().split('T')[0];
      a.download = `doctoroncall-${filenameLabel}-${dateTag}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objUrl);

      setFeedback({
        text: `✓ Successfully exported ${filenameLabel.toUpperCase()} report! File saved to Downloads.`,
        type: 'success'
      });
      setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
    } catch (err) {
      console.error('Report download error:', err);
      setFeedback({
        text: `Failed to download report. Please ensure you are logged in as Super Admin.`,
        type: 'error'
      });
    } finally {
      setDownloadingType(null);
    }
  };

  const reportsList = [
    {
      id: 'gst',
      type: 'gst',
      title: 'Monthly GST & Tax Ledger (GSTR-1)',
      subtitle: 'Tax Invoice compliance data with CGST (9%) + SGST (9%) splits and gross transaction amounts.',
      filename: 'monthly-gst-gstr1-ledger',
      icon: Receipt,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      badge: 'Section 10 & 21 Compliant',
      columns: ['Payment ID', 'Order ID', 'Patient', 'Doctor', 'Gross Fee', 'GST (18%)', 'CGST (9%)', 'SGST (9%)', 'Doctor Net (80%)']
    },
    {
      id: 'revenue',
      type: 'revenue',
      title: 'Financial Transactions & Revenue',
      subtitle: 'Complete financial ledger with platform 20% fees, doctor payouts, gateway order IDs, and payment statuses.',
      filename: 'platform-revenue-transactions',
      icon: IndianRupee,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      badge: 'Escrow & Splits',
      columns: ['Payment ID', 'Gateway ID', 'Patient', 'Doctor', 'Gross Amount', 'Platform Fee', 'Doctor Payable', 'Status', 'Date']
    },
    {
      id: 'doctors',
      type: 'doctors',
      title: 'Registered Doctors Roster',
      subtitle: 'Comprehensive doctor directory with medical council registration numbers, KYC status, fees, and wallet earnings.',
      filename: 'all-registered-doctors',
      icon: Stethoscope,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      badge: 'MCI & Verification',
      columns: ['Doctor ID', 'Name', 'Email', 'Phone', 'MCI Reg No', 'Specializations', 'KYC Status', 'Consult Fee', 'Total Earnings']
    },
    {
      id: 'patients',
      type: 'patients',
      title: 'Patient Encounters Directory',
      subtitle: 'Patient registration profiles with demographic details, cities, emergency contacts, and cumulative healthcare spend.',
      filename: 'all-patients-directory',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      badge: 'EHR & Contacts',
      columns: ['Patient ID', 'Name', 'Email', 'Phone', 'Gender', 'Blood Group', 'City', 'Emergency Contact', 'Total Visits', 'Total Spent']
    },
    {
      id: 'clinics',
      type: 'clinics',
      title: 'Clinics & SaaS Organizations',
      subtitle: 'Multi-tenant hospital and clinic accounts, subdomains, tier plans (Starter, Growth, Enterprise), and doctor limits.',
      filename: 'clinics-saas-organizations',
      icon: Building2,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      badge: 'SaaS Multi-Tenant',
      columns: ['Clinic ID', 'Name', 'Subdomain', 'Plan Name', 'Monthly Fee', 'Doctor Limit', 'Patient Limit', 'Active Status']
    },
    {
      id: 'settlements',
      type: 'settlements',
      title: 'Doctor Escrow Settlements & Payouts',
      subtitle: 'Doctor withdrawal requests, 24-hour hold releases, bank account credentials, IFSC, UTR numbers, and approval timestamps.',
      filename: 'doctor-settlements-payouts',
      icon: Clock,
      color: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
      badge: '24-Hr Hold Pool',
      columns: ['Withdrawal ID', 'Doctor Name', 'Amount (INR)', 'Bank Account', 'IFSC Code', 'UTR Number', 'Status', 'Requested At']
    },
    {
      id: 'appointments',
      type: 'appointments',
      title: 'Clinical Consultations & Bookings History',
      subtitle: 'Full record of booked OPD consultations, virtual video consults, home visits, tokens, and medical encounter statuses.',
      filename: 'appointments-history',
      icon: Calendar,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      badge: 'OPD & Visits',
      columns: ['Appointment ID', 'Token Number', 'Patient', 'Doctor', 'Service Type', 'Scheduled At', 'Consultation Status']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-600" /> Super Admin Report Center
            </span>
            <span className="text-xs text-slate-400 font-bold">1-Click Live CSV Data Exports</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Downloads & Compliance Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            Download comprehensive operational ledgers, tax filings, provider rosters, and audit records with customizable date filtering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all hover:bg-slate-50 shadow-xs"
          >
            ← Operations Overview
          </Link>
          <Link
            href="/admin/billing"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" /> GST Ledger
          </Link>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-indigo-600" /> Filter Date Range:
          </span>
          <div className="flex items-center gap-2">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <span className="text-slate-400 text-xs font-bold">to</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline ml-2"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Quick Range Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-1">Presets:</span>
          <button
            onClick={() => setPresetRange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !startDate && !endDate ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setPresetRange('7d')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setPresetRange('30d')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Past 30 Days
          </button>
          <button
            onClick={() => setPresetRange('month')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            This Month
          </button>
        </div>
      </div>

      {/* Action Notification Feedback */}
      {feedback.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-sm ${
          feedback.type === 'error'
            ? 'bg-rose-50 border border-rose-200 text-rose-700'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {feedback.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportsList.map((item) => {
          const Icon = item.icon;
          const isDownloading = downloadingType === item.type;

          return (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300/80 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">
                  {item.subtitle}
                </p>

                {/* Columns Included */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                    Key Data Fields Included:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.columns.map((col, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-50 text-[10px] font-semibold text-slate-600 border border-slate-100">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDownloadReport(item.type, item.filename)}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating CSV...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download CSV Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Information Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Statutory Compliance Ready</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Audit-Proof Financial Ledgers & Encrypted Healthcare Records</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            All reports are compiled directly from the MySQL 8.x database with live transaction data. Financial records adhere to India GST 18% compliance with automated 9% CGST and 9% SGST breakdown. Doctor withdrawals follow 24-hour escrow hold verification under Doctor On Call Marketplace guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
