'use client';

import React, { useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { 
  useGetAdminStatsQuery, 
  useGetAdminDoctorsQuery, 
  useVerifyDoctorMutation,
  useGetAdminWithdrawalsQuery,
  useUpdateWithdrawalStatusMutation,
  useGetAdminComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useGetAdminAuditLogsQuery
} from '@/store/api/adminApi';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'kyc', 'withdrawals', 'complaints', 'audit'

  // Admin API hooks
  const { data: statsResponse, isLoading: loadingStats } = useGetAdminStatsQuery();
  const { data: doctorsResponse, refetch: refetchDoctors } = useGetAdminDoctorsQuery();
  const { data: withdrawalsResponse, refetch: refetchWithdrawals } = useGetAdminWithdrawalsQuery();
  const { data: complaintsResponse, refetch: refetchComplaints } = useGetAdminComplaintsQuery();
  const { data: auditResponse } = useGetAdminAuditLogsQuery();

  const [verifyDoctor, { isLoading: isVerifying }] = useVerifyDoctorMutation();
  const [updateWithdrawal, { isLoading: isUpdatingWithdrawal }] = useUpdateWithdrawalStatusMutation();
  const [updateComplaint] = useUpdateComplaintStatusMutation();

  const [utrModal, setUtrModal] = useState(null); // withdrawal item
  const [utrNumber, setUtrNumber] = useState('');

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
  const withdrawals = withdrawalsResponse?.data || [];
  const complaints = complaintsResponse?.data || [];
  const auditLogs = auditResponse?.data || [];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs text-slate-400 font-bold">BRD Section 15 & 21 Compliant</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Super Admin Operations</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage doctors, KYC approvals, payouts, complaints and audit logs.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'kyc', label: `Doctor KYC (${stats.pendingDoctors})`, icon: FileCheck },
            { id: 'withdrawals', label: `Payouts (${stats.pendingWithdrawals})`, icon: IndianRupee },
            { id: 'complaints', label: `Complaints (${stats.openComplaints})`, icon: MessageSquare },
            { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Total Patients</span>
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600"><Users className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.totalPatients}</div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Active platform consumers</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Verified Doctors</span>
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600"><Stethoscope className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.activeDoctors} <span className="text-sm font-semibold text-slate-400">/ {stats.totalDoctors} total</span></div>
              <p className="text-xs text-amber-600 font-bold mt-2">{stats.pendingDoctors} pending verification</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Appointments</span>
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600"><Calendar className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.totalAppointments}</div>
              <p className="text-xs text-purple-600 font-bold mt-2">{stats.todayAppointments} scheduled today</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Platform Revenue</span>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600"><IndianRupee className="h-5 w-5" /></div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                ₹{parseFloat(stats.financials.platformCommission || 0).toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Gross: ₹{parseFloat(stats.financials.grossRevenue || 0).toFixed(2)}</p>
            </div>

          </div>

          {/* Quick Action Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase">Action Needed</span>
                <h3 className="text-xl font-bold text-amber-900 mt-1">{stats.pendingDoctors} Doctors Pending KYC</h3>
                <p className="text-xs text-amber-700/80 mt-1">Review medical licenses and qualifications before approving.</p>
              </div>
              <button onClick={() => setActiveTab('kyc')} className="mt-4 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs self-start hover:bg-amber-700 transition-colors">
                Review KYC Documents
              </button>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-200 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase">Financial Payouts</span>
                <h3 className="text-xl font-bold text-indigo-900 mt-1">{stats.pendingWithdrawals} Pending Withdrawals</h3>
                <p className="text-xs text-indigo-700/80 mt-1">Review doctor bank accounts and disburse transfers.</p>
              </div>
              <button onClick={() => setActiveTab('withdrawals')} className="mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs self-start hover:bg-indigo-700 transition-colors">
                Process Payouts
              </button>
            </div>

            <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase">Patient Support</span>
                <h3 className="text-xl font-bold text-rose-900 mt-1">{stats.openComplaints} Open Support Tickets</h3>
                <p className="text-xs text-rose-700/80 mt-1">Resolve patient complaints and service inquiries.</p>
              </div>
              <button onClick={() => setActiveTab('complaints')} className="mt-4 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs self-start hover:bg-rose-700 transition-colors">
                Manage Complaints
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR KYC TAB */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Doctor Verification & KYC Review</h3>
              <p className="text-xs text-slate-500">Live MySQL data — doctors must be APPROVED to receive bookings</p>
            </div>
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
                    <td className="px-6 py-4 font-mono text-xs">{doc.medicalRegNumber || 'MCI-PENDING'}</td>
                    <td className="px-6 py-4 text-xs">
                      {doc.specializations?.map(s => s.specialization).join(', ') || 'General Physician'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{parseFloat(doc.consultationFee || 500).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        doc.verificationStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        doc.verificationStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
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
