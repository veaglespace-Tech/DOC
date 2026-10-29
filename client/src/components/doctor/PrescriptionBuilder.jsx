'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Trash2, 
  FileSignature, 
  Save, 
  Stethoscope, 
  FileHeart,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer
} from 'lucide-react';
import { useGetPrescriptionQuery, useCreatePrescriptionMutation } from '@/store/api/appointmentApi';

const DRUG_CATALOG = [
  { id: 1, name: 'Paracetamol', defaultDose: '650mg', type: 'Tablet' },
  { id: 2, name: 'Amoxicillin + Clavulanic Acid (Augmentin)', defaultDose: '625mg', type: 'Tablet' },
  { id: 3, name: 'Cetirizine', defaultDose: '10mg', type: 'Tablet' },
  { id: 4, name: 'Azithromycin', defaultDose: '500mg', type: 'Tablet' },
  { id: 5, name: 'Pantoprazole', defaultDose: '40mg', type: 'Tablet' },
  { id: 6, name: 'Montelukast + Levocetirizine', defaultDose: '10mg/5mg', type: 'Tablet' },
  { id: 7, name: 'Cough Syrup (Ascoril D)', defaultDose: '10ml', type: 'Syrup' },
  { id: 8, name: 'Metformin', defaultDose: '500mg', type: 'Tablet' },
  { id: 9, name: 'Atorvastatin', defaultDose: '10mg', type: 'Tablet' },
  { id: 10, name: 'Oral Rehydration Salts (ORS)', defaultDose: '1 Sachet in 1L Water', type: 'Powder' }
];

export default function PrescriptionBuilder({ appointmentId }) {
  const { data: response, isLoading: loadingData, refetch } = useGetPrescriptionQuery(appointmentId);
  const [createPrescription, { isLoading: isSubmitting }] = useCreatePrescriptionMutation();

  const appointmentData = response?.data || {};
  const patient = appointmentData.patient || {};
  const doctor = appointmentData.doctor || {};
  const existingPrescription = appointmentData.prescription;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  
  // Current Form State
  const [customDrugName, setCustomDrugName] = useState('');
  const [currentDrug, setCurrentDrug] = useState(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1-0-1');
  const [duration, setDuration] = useState('5 Days');
  const [instructions, setInstructions] = useState('After Food');
  const [diagnosis, setDiagnosis] = useState('');
  const [isIssued, setIsIssued] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Populate if prescription already exists in DB
  useEffect(() => {
    if (existingPrescription) {
      if (Array.isArray(existingPrescription.medicines)) {
        setSelectedDrugs(existingPrescription.medicines);
      }
      setDiagnosis(existingPrescription.notes || '');
      setSignatureInfo(existingPrescription.signature || '');
      setIsIssued(true);
    }
  }, [existingPrescription]);

  const handleSelectDrug = (drug) => {
    setCurrentDrug(drug);
    setDosage(drug.defaultDose);
    setSearchTerm('');
  };

  const handleAddCustomDrug = () => {
    if (!customDrugName.trim()) return;
    const drug = { id: Date.now(), name: customDrugName.trim(), defaultDose: 'As directed', type: 'Medication' };
    handleSelectDrug(drug);
    setCustomDrugName('');
  };

  const handleAddDrug = () => {
    if (!currentDrug) return;
    
    const newEntry = {
      id: Date.now(),
      drug: currentDrug,
      name: currentDrug.name,
      dosage: dosage || currentDrug.defaultDose || 'As directed',
      frequency,
      duration,
      instructions
    };
    
    setSelectedDrugs([...selectedDrugs, newEntry]);
    
    // Reset Form
    setCurrentDrug(null);
    setDosage('');
    setFrequency('1-0-1');
    setDuration('5 Days');
    setInstructions('After Food');
  };

  const handleRemoveDrug = (id) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== id));
  };

  const filteredDrugs = searchTerm 
    ? DRUG_CATALOG.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSignAndIssue = async () => {
    if (selectedDrugs.length === 0) {
      alert('Please add at least one medication to the prescription.');
      return;
    }

    try {
      const res = await createPrescription({
        appointmentId,
        data: {
          diagnosis: diagnosis || 'General Clinical Consultation',
          medicines: selectedDrugs,
          notes: diagnosis
        }
      }).unwrap();

      setIsIssued(true);
      setSignatureInfo(res.data?.prescription?.signature || `Digitally Signed by Dr. ${doctor.name || 'Doctor'}`);
      alert('Prescription successfully saved and digitally signed! Synced to patient medical records.');
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Failed to save and issue prescription.');
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/appointments/${appointmentId}/prescription/pdf`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to generate PDF');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Prescription-CC-${appointmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error downloading prescription PDF: ' + err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column: Builder & Search */}
      <div className="flex w-full flex-col gap-6 lg:w-1/2">
        
        {/* Patient Info & Diagnosis */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Patient Details</h2>
              <p className="text-sm text-slate-500">
                {patient.name || 'Patient'} • Gender: {patient.gender || 'Not specified'} • Blood: {patient.bloodGroup || 'N/A'}
              </p>
              <p className="text-xs text-indigo-600 font-mono mt-0.5">Token: {appointmentData.tokenNumber || `T-${appointmentId}`}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FileHeart className="h-6 w-6" />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Clinical Diagnosis / Chief Complaint</label>
            <input 
              type="text" 
              placeholder="e.g. Viral upper respiratory tract infection, Acute pharyngitis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Drug Search & Add Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Pill className="h-5 w-5 text-indigo-600" />
            Prescribe Medication
          </h2>

          {!currentDrug ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search standard medicine catalog (e.g. Paracetamol, Augmentin)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                
                {/* Autocomplete Dropdown */}
                {searchTerm && filteredDrugs.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-2xl border border-slate-100 bg-white shadow-xl max-h-56 overflow-y-auto">
                    {filteredDrugs.map(drug => (
                      <button
                        key={drug.id}
                        type="button"
                        onClick={() => handleSelectDrug(drug)}
                        className="flex w-full items-center justify-between border-b border-slate-50 p-3 text-left hover:bg-indigo-50 last:border-0 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800 text-sm">{drug.name}</span>
                          <span className="text-xs text-indigo-600 ml-2">({drug.defaultDose})</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{drug.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Or Add Custom Drug */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or type custom drug name..."
                  value={customDrugName}
                  onChange={(e) => setCustomDrugName(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDrug}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
              <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-3">
                <span className="text-base font-bold text-indigo-950">
                  {currentDrug.name} <span className="text-xs font-normal text-indigo-600">({currentDrug.type})</span>
                </span>
                <button 
                  type="button"
                  onClick={() => setCurrentDrug(null)} 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Change
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-600 uppercase">Dosage / Strength</label>
                  <input 
                    type="text" 
                    value={dosage} 
                    onChange={(e) => setDosage(e.target.value)} 
                    placeholder="e.g. 500mg or 10ml"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-600 uppercase">Duration</label>
                  <select 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option>3 Days</option>
                    <option>5 Days</option>
                    <option>7 Days</option>
                    <option>10 Days</option>
                    <option>14 Days</option>
                    <option>1 Month</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-600 uppercase">Frequency</label>
                  <select 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1-0-1">1-0-1 (Morning & Night)</option>
                    <option value="1-1-1">1-1-1 (Morning, Noon & Night)</option>
                    <option value="1-0-0">1-0-0 (Morning only)</option>
                    <option value="0-0-1">0-0-1 (Night only)</option>
                    <option value="PRN">PRN (As and when needed)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-600 uppercase">Instructions</label>
                  <select 
                    value={instructions} 
                    onChange={(e) => setInstructions(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option>After Food</option>
                    <option>Before Food</option>
                    <option>Empty Stomach</option>
                    <option>At Bedtime</option>
                    <option>With Milk</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleAddDrug}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" /> Add to Prescription Table
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Real-time Prescription Document Preview */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex-1 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden">
          
          <div>
            <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <Stethoscope className="h-32 w-32 -translate-y-8 translate-x-8" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-black tracking-wider uppercase text-teal-400">Doctor On Call RX</h3>
                  <p className="text-xs text-slate-300">Certified Electronic Medical Prescription</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    Official e-Prescription
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 flex justify-between border-b border-dashed border-slate-200 pb-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Patient: {patient.name || 'Patient'}</p>
                  <p className="text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-slate-400 font-mono">Appt: DOC-{appointmentId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">Dr. {doctor.name || 'Doctor'}</p>
                  <p className="text-slate-500">{doctor.specializations?.[0]?.specialization || 'Consultant'}</p>
                  <p className="text-teal-600 font-mono text-[11px]">Reg: {doctor.medicalRegNumber || 'MCI-DOCTOR-ON-CALL'}</p>
                </div>
              </div>

              {diagnosis && (
                <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Diagnosis</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">{diagnosis}</p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-black text-teal-600 font-serif">Rx</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescribed Medications</p>
                </div>
                
                {selectedDrugs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-400">
                    <Pill className="mb-2 h-8 w-8 opacity-40" />
                    <p className="text-xs font-medium">No medications added to the prescription yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {selectedDrugs.map((entry, idx) => (
                      <li key={entry.id || idx} className="group relative flex items-start justify-between rounded-2xl border border-slate-100 p-3.5 transition-colors hover:bg-slate-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-[10px] font-black text-teal-800">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{entry.drug?.name || entry.name}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {entry.dosage}
                            </span>
                          </div>
                          <p className="ml-7 mt-1 text-xs text-slate-500 font-medium">
                            {entry.frequency} • {entry.duration} • <span className="text-teal-700">{entry.instructions}</span>
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveDrug(entry.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                          title="Remove medicine"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>
          
          {/* Action Footer */}
          <div className="border-t border-slate-100 bg-slate-50 p-5">
            {isIssued ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Digitally Signed & Issued</p>
                    <p className="text-[11px] text-emerald-700 font-mono truncate">{signatureInfo || `Signed by Dr. ${doctor.name || 'Doctor'}`}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={downloadingPdf}
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {downloadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span>Download Official PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-3 px-4 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => alert('Prescription draft saved in working session.')}
                  className="flex-1 py-3 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Draft
                </button>
                <button 
                  type="button"
                  onClick={handleSignAndIssue}
                  disabled={isSubmitting || selectedDrugs.length === 0}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />}
                  <span>Digitally Sign & Issue</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
