'use client';
import { useGetPatientBillingHistoryQuery } from '@/store/api/billingApi';

export default function PatientWalletPage() {
  const { data: historyData, isLoading, error } = useGetPatientBillingHistoryQuery();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Billing History...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading billing history.</div>;

  const history = historyData?.data || [];

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
      a.download = `careconnect-invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => console.error("Invoice Download Error", err));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Wallet & Invoices</h1>
        <p className="text-slate-500 mt-1">View your past transactions and download tax invoices.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="text-4xl mb-4">🧾</div>
            <p>You have no past transactions.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map(payment => (
              <div key={payment.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                    💰
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Consultation with Dr. {payment.appointment?.doctor?.user?.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">TXN: {payment.razorpayPaymentId || `CC-PAY-${payment.id}`}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">Rs. {payment.amount}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">PAID</span>
                  </div>
                  
                  <button 
                    onClick={() => handleDownloadInvoice(payment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors"
                  >
                    <span>⬇️</span> PDF Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
