import { Receipt, Search, Download, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function AdminBillingPage() {
  const invoices = [
    { id: 'INV-2026-001', clinic: 'City Care Hospital', amount: '₹12,500', gst: '₹2,250', date: '2026-09-28', status: 'Paid' },
    { id: 'INV-2026-002', clinic: 'Sharma Heart Clinic', amount: '₹8,200', gst: '₹1,476', date: '2026-09-27', status: 'Pending' },
    { id: 'INV-2026-003', clinic: 'Metro Diagnostics', amount: '₹15,000', gst: '₹2,700', date: '2026-09-25', status: 'Paid' },
    { id: 'INV-2026-004', clinic: 'Sunrise Medical Center', amount: '₹22,400', gst: '₹4,032', date: '2026-09-22', status: 'Paid' },
    { id: 'INV-2026-005', clinic: 'Dr. Patils Clinic', amount: '₹5,600', gst: '₹1,008', date: '2026-09-20', status: 'Overdue' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">GST Billing & Invoicing</h2>
          <p className="text-sm text-slate-500 mt-1">Manage platform invoices, GST calculations, and clinic billing.</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Generate New Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Filter by Status
            </button>
            <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Clinic / Organization</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">GST (18%)</th>
                <th className="px-6 py-4">Date Issued</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.id}</td>
                  <td className="px-6 py-4 font-medium">{inv.clinic}</td>
                  <td className="px-6 py-4 font-bold">{inv.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.gst}</td>
                  <td className="px-6 py-4">{inv.date}</td>
                  <td className="px-6 py-4">
                    {inv.status === 'Paid' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </span>
                    )}
                    {inv.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                    {inv.status === 'Overdue' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold">
                        <Clock className="h-3 w-3" /> Overdue
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-teal-600 hover:text-teal-800 font-medium flex items-center justify-end gap-1 w-full">
                      <FileText className="h-4 w-4" /> View
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
