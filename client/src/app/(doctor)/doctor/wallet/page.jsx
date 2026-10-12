'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  History,
  ShieldCheck,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { 
  useGetDoctorWalletQuery, 
  useRequestWithdrawalMutation 
} from '@/store/api/doctorApi';

export default function DoctorWalletPage() {
  const { data: walletResponse, isLoading, refetch } = useGetDoctorWalletQuery();
  const [requestWithdrawal, { isLoading: isWithdrawing }] = useRequestWithdrawalMutation();

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [msg, setMsg] = useState(null);

  const wallet = walletResponse?.data || {
    totalEarnings: 0,
    pendingBalance: 0,
    availableBalance: 0,
    withdrawnAmount: 0,
    transactions: [],
    settlements: [],
    withdrawals: []
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await requestWithdrawal({
        amount: parseFloat(withdrawAmount),
        bankAccount,
        ifscCode
      }).unwrap();

      setMsg({ type: 'success', text: res.message || 'Withdrawal requested successfully!' });
      setWithdrawAmount('');
      setWithdrawModalOpen(false);
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err?.data?.message || 'Failed to request withdrawal' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title & Withdraw CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings & Financial Wallet</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Compliant with BRD Section 11 & 12 — 24-hour settlement hold with verifiable transaction ledger.
          </p>
        </div>

        <button
          onClick={() => setWithdrawModalOpen(true)}
          disabled={parseFloat(wallet.availableBalance) <= 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-0.5"
        >
          <CreditCard className="h-5 w-5" /> Request Bank Payout
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
          {msg.text}
        </div>
      )}

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Earnings</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{parseFloat(wallet.totalEarnings).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">All completed consultations</p>
        </div>

        {/* Pending Balance (24h Hold) */}
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-700 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Settlement Hold</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900">
            ₹{parseFloat(wallet.pendingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-amber-600/80 mt-2 font-medium">Auto-releases after 24 hrs</p>
        </div>

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-600/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-teal-100">
            <span className="text-xs font-bold uppercase tracking-wider">Available for Payout</span>
            <div className="p-2.5 rounded-2xl bg-white/20 text-white">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            ₹{parseFloat(wallet.availableBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-teal-100 mt-2 font-medium">Eligible for instant bank transfer</p>
        </div>

        {/* Withdrawn Amount */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Withdrawn</span>
            <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-600">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{parseFloat(wallet.withdrawnAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Paid out to bank accounts</p>
        </div>

      </div>

      {/* Settlements & Pending Holds Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">24-Hour Settlement Holds</h3>
              <p className="text-xs text-slate-500">Scheduled earnings clearing to your available balance</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {wallet.settlements?.length || 0} scheduled
          </span>
        </div>

        {(!wallet.settlements || wallet.settlements.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No active settlement holds right now. Completed visits will appear here during their 24h clearing period.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-3">Settlement ID</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Release Time</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {wallet.settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">SET-{s.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{parseFloat(s.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(s.holdUntil).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {s.status === 'RELEASED' ? 'Released' : 'Holding (24h)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Financial Transaction Ledger</h3>
              <p className="text-xs text-slate-500">Immutable trace of all credits, releases and payouts</p>
            </div>
          </div>
        </div>

        {(!wallet.transactions || wallet.transactions.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No transactions recorded in ledger yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-3">Txn Ref</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {wallet.transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.referenceId || `TXN-${t.id}`}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                        t.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' :
                        t.type === 'WITHDRAWAL' ? 'bg-purple-50 text-purple-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 max-w-xs truncate">{t.description}</td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'WITHDRAWAL' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.type === 'WITHDRAWAL' ? '-' : '+'}₹{parseFloat(t.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Request Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-2xl font-black text-slate-900">Request Bank Payout</h3>
            <p className="text-xs text-slate-500 mt-1">
              Available balance: <span className="font-bold text-teal-600">₹{parseFloat(wallet.availableBalance).toFixed(2)}</span>
            </p>

            <form onSubmit={handleWithdraw} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  max={wallet.availableBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Enter 12-16 digit account number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm uppercase font-mono"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors text-sm shadow-lg shadow-teal-600/20 disabled:bg-slate-300"
                >
                  {isWithdrawing ? 'Submitting...' : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
