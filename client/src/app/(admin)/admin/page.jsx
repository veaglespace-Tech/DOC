'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  IndianRupee, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Building2,
  FileCheck,
  TrendingUp,
  Receipt,
  Search,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  ExternalLink,
  Download,
  Sliders,
  RotateCcw,
  Filter,
  DollarSign,
  Activity,
  ArrowRight,
  UserCheck,
  Building,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { 
  useGetAdminStatsQuery, 
  useGetAdminDoctorsQuery, 
  useVerifyDoctorMutation,
  useGetAdminWithdrawalsQuery,
  useUpdateWithdrawalStatusMutation,
  useGetAdminComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useGetAdminAuditLogsQuery,
  useGetAdminEmergencyDispatchesQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetFinancialReportQuery,
  useGetAdminRefundsQuery,
  useGetAdminPatientsQuery,
  useGetAdminClinicsQuery,
  useGetAdminTransactionsQuery
} from '@/store/api/adminApi';


export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const authState = useSelector((state) => state.auth);
  const hasToken = !!authState?.token || (typeof window !== 'undefined' && !!localStorage.getItem('careconnect_token'));

  // Search & Filter state
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [clinicSearch, setClinicSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Admin API hooks
  const { data: statsResponse, isLoading: loadingStats } = useGetAdminStatsQuery(undefined, { skip: !hasToken });
  const { data: doctorsResponse, refetch: refetchDoctors } = useGetAdminDoctorsQuery({
    search: doctorSearch || undefined,
    status: doctorFilter !== 'ALL' ? doctorFilter : undefined
  }, { skip: !hasToken });
  const { data: patientsResponse, refetch: refetchPatients } = useGetAdminPatientsQuery({
    search: patientSearch || undefined
  }, { skip: !hasToken });
  const { data: clinicsResponse, refetch: refetchClinics } = useGetAdminClinicsQuery({
    search: clinicSearch || undefined
  }, { skip: !hasToken });
  const { data: transactionsResponse, refetch: refetchTransactions } = useGetAdminTransactionsQuery({
    search: transactionSearch || undefined,
    status: transactionStatus !== 'ALL' ? transactionStatus : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined
  }, { skip: !hasToken });
  const { data: withdrawalsResponse, refetch: refetchWithdrawals } = useGetAdminWithdrawalsQuery(undefined, { skip: !hasToken });
  const { data: complaintsResponse, refetch: refetchComplaints } = useGetAdminComplaintsQuery(undefined, { skip: !hasToken });
  const { data: auditResponse } = useGetAdminAuditLogsQuery(undefined, { skip: !hasToken });
  const { data: emergencyResponse } = useGetAdminEmergencyDispatchesQuery(undefined, { skip: !hasToken });
  const { data: settingsResponse, refetch: refetchSettings } = useGetAdminSettingsQuery(undefined, { skip: !hasToken });
  const [updateAdminSettings, { isLoading: isUpdatingSettings }] = useUpdateAdminSettingsMutation();
  const { data: refundsResponse } = useGetAdminRefundsQuery(undefined, { skip: !hasToken });

  const { data: reportResponse, refetch: refetchReport } = useGetFinancialReportQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined
  }, { skip: !hasToken });

  const [verifyDoctor, { isLoading: isVerifying }] = useVerifyDoctorMutation();
  const [updateWithdrawal, { isLoading: isUpdatingWithdrawal }] = useUpdateWithdrawalStatusMutation();
  const [updateComplaint] = useUpdateComplaintStatusMutation();

  const [utrModal, setUtrModal] = useState(null); // withdrawal item
  const [utrNumber, setUtrNumber] = useState('');

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState({
    platform_commission_percent: '20',
    gst_percent: '18',
    settlement_hold_hours: '24',
    emergency_timeout_seconds: '90',
    emergency_search_radius_km: '5.0'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (settingsResponse?.data?.configMap) {
      setSettingsForm(prev => ({
        ...prev,
        ...settingsResponse.data.configMap
      }));
    }
  }, [settingsResponse]);

  const stats = statsResponse?.data || {
    totalPatients: 0,
    totalDoctors: 0,
    activeDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    emergencyRequests: 0,
    financials: { grossRevenue: 0, platformCommission: 0 },
    pendingWithdrawals: 0,
    openComplaints: 0
  };

  const doctors = doctorsResponse?.data || [];
  const patients = patientsResponse?.data || [];
  const clinics = clinicsResponse?.data || [];
  const transactions = transactionsResponse?.data || [];
  const withdrawals = withdrawalsResponse?.data || [];
  const complaints = complaintsResponse?.data || [];
  const auditLogs = auditResponse?.data || [];
  const emergencyDispatches = emergencyResponse?.data || [];
  const refunds = refundsResponse?.data || [];
  const reportData = reportResponse?.data || null;

  const handleVerify = async (doctorId, status) => {
    try {
      await verifyDoctor({ id: doctorId, status }).unwrap();
      refetchDoctors();
    } catch (err) {
      alert(err?.data?.message || 'Verification update failed');
    }
  };

  const handleApproveWithdrawal = async (e) => {
    e.preventDefault();
    if (!utrModal) return;
    try {
      await updateWithdrawal({
        id: utrModal.id,
        status: 'COMPLETED',
        utrNumber
      }).unwrap();
      setUtrModal(null);
      setUtrNumber('');
      refetchWithdrawals();
    } catch (err) {
      alert(err?.data?.message || 'Payout approval failed');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaved(false);
    try {
      await updateAdminSettings(settingsForm).unwrap();
      setSettingsSaved(true);
      refetchSettings();
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      alert(err?.data?.message || 'Failed to update settings');
    }
  };

  const handleExportCsv = (type) => {
    const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    let url = `${base}/admin/reports/export?type=${type}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const objUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = `doctoroncall-${type}-report.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => alert('Export failed'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs text-slate-400 font-bold">BRD Sections 10, 13, 15, 16 & 21 Compliant</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Super Admin Operations</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage doctors, KYC approvals, payouts, refunds, reports, platform settings and audit logs.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 overflow-x-auto max-w-full cards-scroller">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'doctors', label: `Doctors (${stats.totalDoctors})`, icon: Stethoscope },
            { id: 'patients', label: `Patients (${stats.totalPatients})`, icon: Users },
            { id: 'clinics', label: `Clinics (${clinics.length})`, icon: Building2 },
            { id: 'transactions', label: `Transactions (${transactions.length})`, icon: CreditCard },
            { id: 'reports', label: 'Reports & Export', icon: Download },
            { id: 'kyc', label: `Doctor KYC (${stats.pendingDoctors})`, icon: FileCheck },
            { id: 'withdrawals', label: `Payouts (${stats.pendingWithdrawals})`, icon: IndianRupee },
            { id: 'refunds', label: `Refunds (${refunds.length})`, icon: RotateCcw },
            { id: 'complaints', label: `Complaints (${stats.openComplaints})`, icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Sliders },
            { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>


      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Patients</span>
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600"><Users className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.totalPatients}</div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Active platform consumers</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Verified Doctors</span>
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600"><Stethoscope className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.activeDoctors} <span className="text-sm font-semibold text-slate-400">/ {stats.totalDoctors} total</span></div>
              <p className="text-xs text-amber-600 font-bold mt-2">{stats.pendingDoctors} pending verification</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Appointments</span>
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600"><Calendar className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.totalAppointments}</div>
              <p className="text-xs text-purple-600 font-bold mt-2">{stats.todayAppointments} scheduled today</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Platform Revenue</span>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600"><IndianRupee className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                ₹{parseFloat(stats.financials.platformCommission || 0).toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Gross: ₹{parseFloat(stats.financials.grossRevenue || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Quick Action Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Action Needed</span>
                <h3 className="text-xl font-bold text-amber-900 mt-1">{stats.pendingDoctors} Doctors Pending KYC</h3>
                <p className="text-xs text-amber-700/80 mt-1">Review medical licenses and qualifications before approving.</p>
              </div>
              <button onClick={() => setActiveTab('kyc')} className="mt-4 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs self-start hover:bg-amber-700 transition-colors shadow-sm">
                Review KYC Documents
              </button>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Financial Payouts</span>
                <h3 className="text-xl font-bold text-indigo-900 mt-1">{stats.pendingWithdrawals} Pending Withdrawals</h3>
                <p className="text-xs text-indigo-700/80 mt-1">Review doctor bank accounts and disburse transfers.</p>
              </div>
              <button onClick={() => setActiveTab('withdrawals')} className="mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs self-start hover:bg-indigo-700 transition-colors shadow-sm">
                Process Payouts
              </button>
            </div>

            <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Patient Support</span>
                <h3 className="text-xl font-bold text-rose-900 mt-1">{stats.openComplaints} Open Support Tickets</h3>
                <p className="text-xs text-rose-700/80 mt-1">Resolve patient complaints and service inquiries.</p>
              </div>
              <button onClick={() => setActiveTab('complaints')} className="mt-4 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs self-start hover:bg-rose-700 transition-colors shadow-sm">
                Manage Complaints
              </button>
            </div>
          </div>

          {/* Quick Cross-Entity Previews: Recent Transactions & Key Roster */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Payments & Ledger Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
                      <p className="text-xs text-slate-400">Captured payments & commission settlements</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {transactions.slice(0, 4).map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{tx.patient?.name || 'Patient'} ➔ {tx.appointment?.doctor?.name || 'Doctor'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">PAY-{tx.id} • {new Date(tx.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-slate-900">₹{parseFloat(tx.grossAmount || 0).toFixed(2)}</div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">No transactions recorded yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Registered Clinics Snapshot */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Multi-Tenant Clinics</h3>
                      <p className="text-xs text-slate-400">Active medical centers & SaaS tiers</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('clinics')}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {clinics.slice(0, 4).map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.subdomain}.doctoroncall.health</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">
                          {c.plan?.name || 'SaaS Pro'}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.doctorCount || 0} Doctors</div>
                      </div>
                    </div>
                  ))}
                  {clinics.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">No clinics registered yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL DOCTORS DIRECTORY TAB */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors by name, email, or registration..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL">All KYC Statuses ({doctors.length})</option>
                <option value="APPROVED">Approved Doctors</option>
                <option value="PENDING">Pending KYC ({stats.pendingDoctors})</option>
                <option value="REJECTED">Rejected Doctors</option>
              </select>

              <button
                onClick={() => handleExportCsv('doctors')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" /> Export Doctors CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Doctor Directory & Practice Roster</h3>
                <p className="text-xs text-slate-500">Total {doctors.length} healthcare professionals registered on Doctor On Call</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Reg No / License</th>
                    <th className="px-6 py-3">Specialization</th>
                    <th className="px-6 py-3">Consult Fee</th>
                    <th className="px-6 py-3">Wallet Earnings</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center shrink-0">
                            {doc.name?.[0] || 'D'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-xs text-slate-400">{doc.user?.email || doc.phone || 'No contact'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                        {doc.medicalRegNumber || 'MCI-PENDING'}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {doc.specializations?.map(s => s.specialization || s.name).join(', ') || 'General Physician'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        ₹{parseFloat(doc.consultationFee || 500).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-bold text-emerald-600">₹{parseFloat(doc.wallet?.totalEarnings || 0).toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">Avail: ₹{parseFloat(doc.wallet?.availableBalance || 0).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          doc.verificationStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                          doc.verificationStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700 animate-pulse'
                        }`}>
                          {doc.verificationStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href="/admin/kyc"
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          Docs <ExternalLink className="w-3 h-3" />
                        </Link>
                        {doc.verificationStatus !== 'APPROVED' && (
                          <button
                            onClick={() => handleVerify(doc.id, 'APPROVED')}
                            disabled={isVerifying}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                        {doc.verificationStatus !== 'REJECTED' && (
                          <button
                            onClick={() => handleVerify(doc.id, 'REJECTED')}
                            disabled={isVerifying}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                        No doctors matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ALL PATIENTS DIRECTORY TAB */}
      {activeTab === 'patients' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, phone, city..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleExportCsv('patients')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" /> Export Patients CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient Directory & Health Consumers</h3>
                <p className="text-xs text-slate-500">Total {patients.length} registered patients across Doctor On Call</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Demographics</th>
                    <th className="px-6 py-3">Emergency Contact</th>
                    <th className="px-6 py-3">Total Visits</th>
                    <th className="px-6 py-3">Total Spent</th>
                    <th className="px-6 py-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {patients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                            {pat.name?.[0] || 'P'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{pat.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">ID: PT-{pat.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-medium text-slate-800">{pat.email}</div>
                        <div className="text-slate-400">{pat.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div>{pat.gender} • <span className="font-bold text-rose-600">{pat.bloodGroup}</span></div>
                        <div className="text-slate-400 text-[11px]">{pat.city}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-700">
                        {pat.emergencyContact || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
                          {pat.totalAppointments} visits
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 text-sm">
                        ₹{parseFloat(pat.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(pat.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                        No patients matching your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-TENANT CLINICS TAB */}
      {activeTab === 'clinics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clinics by name or subdomain..."
                value={clinicSearch}
                onChange={(e) => setClinicSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleExportCsv('clinics')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs transition-colors whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" /> Export Clinics CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Multi-Tenant Clinic Facilities</h3>
                <p className="text-xs text-slate-500">Total {clinics.length} enterprise and clinic tenant organizations</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Clinic Facility</th>
                    <th className="px-6 py-3">Subdomain URL</th>
                    <th className="px-6 py-3">SaaS Subscription</th>
                    <th className="px-6 py-3">Doctor Roster</th>
                    <th className="px-6 py-3">Total Appointments</th>
                    <th className="px-6 py-3">Gross Revenue</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {clinics.map((cl) => (
                    <tr key={cl.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 font-black flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{cl.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">Tenant ID: #{cl.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-teal-700">
                        {cl.subdomain}.doctoroncall.health
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-bold text-slate-800">{cl.plan?.name || 'Clinic Standard'}</div>
                        <div className="text-[11px] text-slate-400">₹{cl.plan?.priceMonthly || 2999}/mo</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {cl.doctorCount} / {cl.plan?.doctorLimit || 15} Doctors
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                        {cl.appointmentCount || 0} Visits
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 text-sm">
                        ₹{parseFloat(cl.grossRevenue || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          cl.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {cl.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {clinics.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                        No clinics registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ALL TRANSACTIONS & FINANCIAL LEDGER TAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions by Order ID, Patient, Doctor..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={transactionStatus}
                onChange={(e) => setTransactionStatus(e.target.value)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="CAPTURED">Captured / Paid</option>
                <option value="INITIATED">Initiated / Pending</option>
                <option value="REFUNDED">Refunded</option>
                <option value="FAILED">Failed</option>
              </select>

              <button
                onClick={() => handleExportCsv('revenue')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" /> Export Ledger CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platform Financial Ledger & Captured Payments</h3>
                <p className="text-xs text-slate-500">Every payment event, 20% platform commission, 18% GST tax, and 80% doctor payable</p>
              </div>
              <div className="text-xs font-bold text-slate-500">
                Total: <span className="text-slate-900 font-black">{transactions.length} Records</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Payment / Order ID</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Gross Fee</th>
                    <th className="px-6 py-3">Platform 20%</th>
                    <th className="px-6 py-3">GST 18%</th>
                    <th className="px-6 py-3">Doctor 80%</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-slate-900">PAY-{tx.id}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{tx.gatewayOrderId || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">
                        <div>{tx.patient?.name || 'Patient'}</div>
                        <div className="text-[11px] text-slate-400">{tx.patient?.user?.phone || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-700">
                        <div>{tx.appointment?.doctor?.name || 'Doctor'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{tx.appointment?.doctor?.medicalRegNumber || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">
                        ₹{parseFloat(tx.grossAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">
                        ₹{parseFloat(tx.platformFee || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-amber-600">
                        ₹{parseFloat(tx.taxAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-emerald-600">
                        ₹{parseFloat(tx.doctorPayable || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          tx.status === 'CAPTURED' ? 'bg-emerald-50 text-emerald-700' :
                          tx.status === 'REFUNDED' ? 'bg-purple-50 text-purple-700' :
                          tx.status === 'FAILED' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 text-sm">
                        No transactions recorded matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR KYC TAB */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Doctor Verification & KYC Review</h3>
              <p className="text-xs text-slate-500">Live MySQL data — doctors must be APPROVED to receive bookings</p>
            </div>
            <Link
              href="/admin/kyc"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 inline-flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              Open Full Document Review Console <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-3">Doctor</th>
                  <th className="px-6 py-3">Medical Reg No</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Consultation Fee</th>
                  <th className="px-6 py-3">KYC Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-xs text-slate-400">{doc.user?.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{doc.medicalRegNumber || doc.licenseNumber || 'MCI-PENDING'}</td>
                    <td className="px-6 py-4 text-xs">
                      {doc.specializations?.map(s => s.specialization || s.name).join(', ') || 'General Physician'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{parseFloat(doc.consultationFee || 500).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        doc.verificationStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        doc.verificationStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {doc.verificationStatus || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href="/admin/kyc"
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        Inspect Docs <ExternalLink className="w-3 h-3" />
                      </Link>
                      {doc.verificationStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleVerify(doc.id, 'APPROVED')}
                          disabled={isVerifying}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                      )}
                      {doc.verificationStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleVerify(doc.id, 'REJECTED')}
                          disabled={isVerifying}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WITHDRAWALS TAB */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Doctor Withdrawal Requests</h3>
              <p className="text-xs text-slate-500">Approve payouts and provide bank transfer UTR number</p>
            </div>
          </div>

          {withdrawals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No withdrawal requests found.</div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Request ID</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Bank Details</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">WTH-{w.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{w.wallet?.doctor?.name || 'Doctor'}</div>
                        <div className="text-xs text-slate-400">{w.wallet?.doctor?.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        <div>A/C: {w.bankAccount}</div>
                        <div className="text-slate-400">IFSC: {w.ifscCode}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{parseFloat(w.amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          w.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                          w.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {w.status}
                        </span>
                        {w.utrNumber && <div className="text-xs text-slate-400 font-mono mt-0.5">UTR: {w.utrNumber}</div>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {w.status === 'REQUESTED' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setUtrModal(w); setUtrNumber(`UTR-${Date.now()}`); }}
                              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateWithdrawal({ id: w.id, status: 'REJECTED', rejectReason: 'Invalid bank details' })}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Patient Complaints & Support Tickets</h3>
            <p className="text-xs text-slate-500">Track and resolve customer concerns</p>
          </div>

          {complaints.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No complaints logged.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <div key={c.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{c.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 mt-2 text-sm">{c.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Submitted by {c.patient?.name || 'Patient'} on {new Date(c.createdAt).toLocaleString()}</p>
                  </div>

                  {c.status !== 'RESOLVED' && (
                    <button
                      onClick={async () => {
                        await updateComplaint({ id: c.id, status: 'RESOLVED' }).unwrap();
                        refetchComplaints();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs self-start sm:self-center transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AUDIT TRAIL TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">System Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable audit logs for compliance per BRD Section 21</p>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Entity</th>
                  <th className="px-6 py-3">Actor Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{log.action}</td>
                    <td className="px-6 py-4 text-xs">{log.entity} #{log.entityId || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                        {log.userRole || 'SYSTEM'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTS & ANALYTICS TAB (BRD Sec 16) */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Reports & Compliance Export Hub</h3>
              <p className="text-xs text-slate-500">Download filtered system audits, transactions, and directory rosters in CSV</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-indigo-600" /> Filter Date:
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 6 Downloadable Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Revenue & Transactions</h4>
                  <p className="text-xs text-slate-500 mt-1">Full payment breakdown, 20% platform commission, 18% GST tax, and doctor payables.</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCsv('revenue')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Revenue CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Appointments & Encounters</h4>
                  <p className="text-xs text-slate-500 mt-1">All OPD, home visit, and emergency visit logs with service type and token tracking.</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCsv('appointments')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Appointments CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600 shrink-0">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Doctor Payouts & Settlements</h4>
                  <p className="text-xs text-slate-500 mt-1">Historical withdrawal disbursals, bank details, IFSC, and NEFT/RTGS UTR numbers.</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCsv('settlements')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Payouts CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Doctors Practice Roster</h4>
                  <p className="text-xs text-slate-500 mt-1">MCI registration numbers, specialties, consultation rates, KYC status, and lifetime earnings.</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCsv('doctors')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Doctors CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Patient Health Directory</h4>
                  <p className="text-xs text-slate-500 mt-1">Patient demographics, blood groups, emergency contacts, lifetime visits, and spend.</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCsv('patients')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Patients CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-600 shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Multi-Tenant Clinics & SaaS</h4>
                  <p className="text-xs text-slate-500 mt-1">Tenant subdomains, subscribed tiers, doctor roster limits, and gross clinic volumes.</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCsv('clinics')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Clinics CSV
              </button>
            </div>
          </div>

          {/* Metric Summary Cards Scroller */}
          <div className="cards-scroller pb-2">
            <div className="flex gap-6 min-w-max xl:min-w-0 xl:grid xl:grid-cols-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-w-[240px] flex-1 shrink-0">
                <span className="text-xs font-bold uppercase text-slate-400">Gross Processed Volume</span>
                <div className="text-3xl font-black text-slate-900 mt-2">₹{reportData?.summary?.grossVolume?.toLocaleString() || 0}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{reportData?.summary?.totalPaymentsCount || 0} Captured Payments</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-w-[240px] flex-1 shrink-0">
                <span className="text-xs font-bold uppercase text-indigo-600">Platform Commission</span>
                <div className="text-3xl font-black text-indigo-600 mt-2">₹{reportData?.summary?.platformCommission?.toLocaleString() || 0}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Net Platform Revenue: ₹{reportData?.summary?.netPlatformRevenue?.toLocaleString() || 0}</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-w-[240px] flex-1 shrink-0">
                <span className="text-xs font-bold uppercase text-emerald-600">Doctor Net Disbursements</span>
                <div className="text-3xl font-black text-emerald-600 mt-2">₹{reportData?.summary?.doctorPayables?.toLocaleString() || 0}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{reportData?.summary?.completedVisits || 0} Completed Appointments</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-w-[240px] flex-1 shrink-0">
                <span className="text-xs font-bold uppercase text-rose-600">Total Refunds Issued</span>
                <div className="text-3xl font-black text-rose-600 mt-2">₹{reportData?.summary?.totalRefunds?.toLocaleString() || 0}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{reportData?.summary?.refundsCount || 0} Reversed Transactions</div>
              </div>
            </div>
          </div>

          {/* Recent Financial Transactions Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Financial Ledger Transactions</h3>
                <p className="text-xs text-slate-500">Every payment event fully traceable per BRD Section 12</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Payment ID / Order</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Gross Amount</th>
                    <th className="px-6 py-3">Platform 20%</th>
                    <th className="px-6 py-3">GST 18%</th>
                    <th className="px-6 py-3">Doctor Net</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(reportData?.recentTransactions || []).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-slate-900">PAY-{t.id}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{t.gatewayOrderId || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">{t.patient?.name || 'Patient'}</td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-700">{t.appointment?.doctor?.name || 'Doctor'}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">₹{parseFloat(t.grossAmount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">₹{parseFloat(t.platformFee).toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-amber-600">₹{parseFloat(t.taxAmount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs font-black text-emerald-600">₹{parseFloat(t.doctorPayable).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REFUNDS TAB (BRD Sec 13) */}
      {activeTab === 'refunds' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Refund & Cancellation Ledger</h3>
              <p className="text-xs text-slate-500">Atomic refund entries linked to original payments per BRD Section 13</p>
            </div>
          </div>

          {refunds.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No refunds processed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Refund ID</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Initiated By</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Gateway Ref</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {refunds.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">RFND-{r.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">{r.payment?.patient?.name || 'Patient'}</td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-700">{r.payment?.appointment?.doctor?.name || 'Doctor'}</td>
                      <td className="px-6 py-4 text-xs font-black text-rose-600">₹{parseFloat(r.amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                          {r.initiatedBy}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">{r.reason}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{r.gatewayRefId || 'N/A'}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PLATFORM SETTINGS TAB (BRD Sec 10, 11, 15) */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-3xl">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900">Platform Configuration Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Configure commission rates, holding periods, and emergency dispatch parameters.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {settingsSaved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Settings saved successfully and applied across all modules.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={settingsForm.platform_commission_percent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platform_commission_percent: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 20%. Percentage deducted as Doctor On Call platform fee.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  GST Tax on Commission (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={settingsForm.gst_percent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, gst_percent: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 18% (9% CGST + 9% SGST).</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Doctor Settlement Hold (Hours)
                </label>
                <input
                  type="number"
                  value={settingsForm.settlement_hold_hours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, settlement_hold_hours: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 24h. Period earnings remain on hold before release to wallet.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Emergency Doctor Response Timeout (Seconds)
                </label>
                <input
                  type="number"
                  value={settingsForm.emergency_timeout_seconds}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergency_timeout_seconds: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 90s. Reassigns to next nearest doctor or escalates to Admin.</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Home Visit Service Radius (km)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={settingsForm.emergency_search_radius_km}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergency_search_radius_km: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 10.0 km. Maximum radial distance for home doctor consultations.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingSettings}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Sliders className="h-4 w-4" /> Save System Settings
              </button>
            </div>
          </form>
        </div>
      )}


      {/* UTR APPROVAL MODAL */}
      {utrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-900">Approve Payout</h3>
            <p className="text-xs text-slate-500 mt-1">
              Disbursing ₹{parseFloat(utrModal.amount).toFixed(2)} to {utrModal.wallet?.doctor?.name}
            </p>

            <form onSubmit={handleApproveWithdrawal} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Banking UTR / Reference Number</label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. UTR-982138912"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUtrModal(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingWithdrawal}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
