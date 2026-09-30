import React from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PatientWalletPage() {
  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CareConnect Wallet</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your funds for seamless bookings and prescriptions.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-teal-900/20 hover:-translate-y-0.5">
          <Plus className="h-5 w-5" /> Add Funds
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wallet Card & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Main Balance Card */}
          <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-3xl p-8 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute -right-10 -top-10 opacity-10">
              <Wallet className="h-48 w-48" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-teal-100 font-semibold mb-2">
                <Wallet className="h-5 w-5" /> Total Balance
              </div>
              <div className="text-5xl font-extrabold tracking-tight mb-8">
                ₹12,450
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium border-t border-teal-400/30 pt-4">
                  <span className="text-teal-100">Card Linked</span>
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> **** 4920
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-xl font-extrabold text-slate-900">₹4,200</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Added</p>
              <p className="text-xl font-extrabold text-slate-900">₹16,650</p>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 transition-all"
                />
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              
              {/* Transaction 1 */}
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Consultation - Dr. Rahul Sharma</h4>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5" /> Today, 10:45 AM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">- ₹850</p>
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">Completed</p>
                </div>
              </div>

              {/* Transaction 2 */}
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Wallet Top-up</h4>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5" /> Yesterday, 06:20 PM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">+ ₹5,000</p>
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">Completed</p>
                </div>
              </div>

              {/* Transaction 3 */}
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Pharmacy Bill - Apollo Meds</h4>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5" /> 24 Sep, 02:15 PM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">- ₹1,240</p>
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">Completed</p>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-100 text-center bg-slate-50">
              <button className="text-sm font-bold text-teal-600 hover:text-teal-700">View All Transactions</button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
