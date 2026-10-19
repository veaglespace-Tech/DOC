'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Stethoscope, 
  Pill, 
  Loader2, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Filter, 
  Search, 
  X, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetPatientPrescriptionsQuery } from '@/store/api/appointmentApi';
import { useGetMedicalRecordsQuery, useAddMedicalRecordMutation } from '@/store/api/patientApi';

export default function PatientRecordsPage() {
  const { data: prescriptions = [], isLoading: isLoadingPrescriptions } = useGetPatientPrescriptionsQuery();
  const { data: medicalRecordsResponse, isLoading: isLoadingRecords, refetch: refetchRecords } = useGetMedicalRecordsQuery();
  const [addMedicalRecord, { isLoading: isUploading }] = useAddMedicalRecordMutation();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'PRESCRIPTIONS', 'LABS'
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    recordType: 'LAB_REPORT',
    recordDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    doctorName: '',
    notes: ''
  });

  const records = medicalRecordsResponse?.data || [];

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

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedicalRecord(formData).unwrap();
      setUploadSuccess(true);
      refetchRecords();
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setFormData({
          title: '',
          recordType: 'LAB_REPORT',
          recordDate: new Date().toISOString().split('T')[0],
          diagnosis: '',
          doctorName: '',
          notes: ''
        });
      }, 1500);
    } catch (err) {
      alert(err?.data?.message || 'Failed to upload medical record');
    }
  };

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            EHR & Medical Vault
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Records & Prescriptions</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Access digitally signed doctor prescriptions, laboratory reports, and personal health documents.
          </p>
        </div>

        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <Upload className="h-4 w-4" />
          Upload Health Record
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Vault Items
          </button>
          <button
            onClick={() => setActiveTab('PRESCRIPTIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PRESCRIPTIONS' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            EHR Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('LABS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'LABS' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Lab Reports & Scans ({records.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Content Stream */}
      <div className="space-y-6 relative z-10">
        
        {/* Prescriptions Section */}
        {(activeTab === 'ALL' || activeTab === 'PRESCRIPTIONS') && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-lg">Doctor Prescriptions</h3>
            </div>

            {isLoadingPrescriptions ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-medium">Fetching verified prescriptions...</p>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-400">
                <p className="text-sm font-semibold text-slate-600">No prescriptions found</p>
                <p className="text-xs mt-1">Prescriptions issued during consultations will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((p) => {
                  let meds = [];
                  try {
                    meds = typeof p.medicines === 'string' ? JSON.parse(p.medicines) : (p.medicines || []);
                  } catch (e) {
                    meds = [];
                  }

                  return (
                    <div key={p.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200/60 uppercase">
                              Verified Prescription
                            </span>
                            <h4 className="font-bold text-slate-900 text-base mt-2">
                              {p.diagnosis || 'General Consultation'}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Dr. {p.doctor?.name || 'CareConnect Specialist'}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDownloadPDF(p.appointmentId)}
                            disabled={downloadingId === p.appointmentId}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors shrink-0"
                          >
                            {downloadingId === p.appointmentId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            PDF
                          </button>
                        </div>

                        {meds.length > 0 && (
                          <div className="bg-slate-50 p-3 rounded-xl my-3 space-y-1 text-xs">
                            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Prescribed Medications:</span>
                            {meds.slice(0, 3).map((m, idx) => (
                              <div key={idx} className="flex justify-between text-slate-700 font-medium">
                                <span>{m.name || m.medicine}</span>
                                <span className="text-slate-400">{m.dosage} ({m.timing || m.duration})</span>
                              </div>
                            ))}
                            {meds.length > 3 && (
                              <span className="text-[11px] text-indigo-600 font-semibold block pt-1">
                                +{meds.length - 3} more medicines listed
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-slate-500 font-medium">Appointment #{p.appointmentId}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lab & Diagnostic Reports Section */}
        {(activeTab === 'ALL' || activeTab === 'LABS') && (
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-lg">Diagnostics & Diagnostic Documents</h3>
            </div>

            {isLoadingRecords ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-medium">Loading uploaded records...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-400">
                <p className="text-sm font-semibold text-slate-600">No diagnostic records uploaded yet</p>
                <p className="text-xs mt-1">Use the "Upload Health Record" button above to upload blood tests, scans or hospital summaries.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {records.map((rec) => (
                  <div key={rec.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] uppercase">
                          {rec.recordType || 'REPORT'}
                        </span>
                        <span className="text-xs text-slate-400">{rec.recordDate || 'Recent'}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{rec.title || rec.diagnosis || 'Health Document'}</h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">{rec.notes || 'Document verified in EHR records.'}</p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Dr. {rec.doctorName || 'Self Uploaded'}</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Encrypted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Upload Health Record Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-lg">Upload Medical Document</h3>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-lg">Document Saved!</h4>
                  <p className="text-xs text-slate-500 mt-1">Successfully stored in your encrypted EHR vault.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CBC Blood Test Report"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Record Type</label>
                      <select
                        value={formData.recordType}
                        onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="LAB_REPORT">Lab Report</option>
                        <option value="XRAY">Radiology / X-Ray</option>
                        <option value="DISCHARGE_SUMMARY">Hospital Summary</option>
                        <option value="VACCINATION">Vaccination</option>
                        <option value="OTHER">Other Document</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Date of Test</label>
                      <input
                        type="date"
                        value={formData.recordDate}
                        onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Doctor / Lab Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Lal PathLabs"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Clinical Notes / Summary</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Hemoglobin normal, Vit D deficiency..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all mt-4 disabled:opacity-50"
                  >
                    {isUploading ? 'Encrypting & Uploading...' : 'Save Health Record'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
