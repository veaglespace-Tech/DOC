'use client';

import React, { useState } from 'react';
import { FileText, Download, Calendar, Stethoscope, Pill, Loader2, CheckCircle2 } from 'lucide-react';
import { useGetPatientPrescriptionsQuery } from '@/store/api/appointmentApi';

export default function MedicalRecordsCard() {
  const { data: prescriptions = [], isLoading, error } = useGetPatientPrescriptionsQuery();
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadPDF = async (appointmentId) => {
    setDownloadingId(appointmentId);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/appointments/${appointmentId}/prescription/pdf`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Could not download PDF');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Prescription-CC-${appointmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error downloading prescription: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">EHR Prescriptions & Medical Records</h3>
            <p className="text-xs text-slate-400">Digitally signed prescriptions from your doctor consultations</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-400">
          <Pill className="mb-2 h-8 w-8 opacity-40 text-slate-500" />
          <p className="text-sm font-semibold text-slate-700">No Prescriptions Yet</p>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Prescriptions issued during or after your doctor consultations will appear here automatically with PDF download access.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rec) => (
            <div 
              key={rec.id} 
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 transition-all hover:border-teal-100 hover:bg-teal-50/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 font-bold">
                  <Pill className="h-6 w-6" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {rec.notes ? `Prescription: ${rec.notes}` : 'Doctor Prescription'}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Signed
                    </span>
                  </div>
                  
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                      <span>Dr. {rec.doctorName} ({rec.doctorSpecialty})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(rec.date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-teal-600 font-mono text-[11px]">
                      {rec.tokenNumber ? `Token: ${rec.tokenNumber}` : `Appt: #${rec.appointmentId}`}
                    </span>
                  </div>

                  {Array.isArray(rec.medicines) && rec.medicines.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rec.medicines.map((m, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {m.drug?.name || m.name} ({m.dosage || ''})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button 
                  onClick={() => handleDownloadPDF(rec.appointmentId)}
                  disabled={downloadingId === rec.appointmentId}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-teal-600/20 disabled:opacity-50"
                  title="Download Official PDF"
                >
                  {downloadingId === rec.appointmentId ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>PDF Rx</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
