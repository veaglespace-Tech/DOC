'use client';
import { useState } from 'react';
import { useGetAdminBillingReportsQuery } from '@/store/api/billingApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminBillingDashboard() {
  const { data: reportData, isLoading, error } = useGetAdminBillingReportsQuery();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Billing Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading billing data.</div>;

  const metrics = reportData?.data?.metrics;
  const recentPayments = reportData?.data?.recentPayments || [];

  const statCards = [
    { title: 'Total Processed', value: `Rs. ${metrics?._sum?.amount?.toFixed(2) || '0.00'}`, icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
    { title: 'Gross Revenue (Doctors)', value: `Rs. ${metrics?._sum?.grossAmount?.toFixed(2) || '0.00'}`, icon: '👨‍⚕️', color: 'bg-blue-100 text-blue-700' },
    { title: 'Platform Fee (10%)', value: `Rs. ${metrics?._sum?.platformFee?.toFixed(2) || '0.00'}`, icon: '🏦', color: 'bg-indigo-100 text-indigo-700' },
    { title: 'GST Collected (18%)', value: `Rs. ${metrics?._sum?.taxAmount?.toFixed(2) || '0.00'}`, icon: '🏛️', color: 'bg-purple-100 text-purple-700' },
  ];

  // Dummy chart data for visualization (in a real app, backend would group by date)
  const chartData = [
    { name: 'Mon', revenue: 4000, gst: 240, fee: 400 },
    { name: 'Tue', revenue: 3000, gst: 139, fee: 221 },
    { name: 'Wed', revenue: 2000, gst: 980, fee: 229 },
    { name: 'Thu', revenue: 2780, gst: 390, fee: 200 },
    { name: 'Fri', revenue: 1890, gst: 480, fee: 218 },
    { name: 'Sat', revenue: 2390, gst: 380, fee: 250 },
    { name: 'Sun', revenue: 3490, gst: 430, fee: 210 },
  ];

  const handleDownloadInvoice = (paymentId) => {
    const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/billing/invoice/${paymentId}/download`;
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => console.error("Invoice Download Error", err));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">GST Billing & Revenue</h1>
          <p className="text-slate-500 mt-1">Real-time platform financials and compliance reporting.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <span>⬇️</span> Download Monthly GST Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className={`p-4 rounded-xl ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Breakdown (7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} name="Gross Revenue" />
                <Bar dataKey="fee" stackId="a" fill="#6366f1" name="Platform Fee" />
                <Bar dataKey="gst" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} name="GST (18%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-100 mb-2">Pending Settlements</h3>
            <p className="text-4xl font-extrabold mt-4">Rs. 12,450.00</p>
            <p className="text-indigo-200 mt-2 text-sm">Owed to 14 Doctors this week.</p>
          </div>
          <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl mt-8 hover:bg-indigo-50 transition-colors">
            Process Payouts Now
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Transactions & Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Patient / Doctor</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">No recent transactions found.</td>
                </tr>
              ) : recentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{payment.razorpayPaymentId || `TXN-${payment.id}`}</td>
                  <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{payment.appointment?.patient?.user?.name}</p>
                    <p className="text-xs text-slate-400">Dr. {payment.appointment?.doctor?.user?.name}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">Rs. {payment.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      PAID
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDownloadInvoice(payment.id)}
                      className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
