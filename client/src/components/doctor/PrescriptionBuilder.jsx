'use client';

import React, { useState } from 'react';
import { Pill, Plus, Search, Trash2, FileSignature, Save, Stethoscope, FileHeart } from 'lucide-react';

const MOCK_DRUGS = [
  { id: 1, name: 'Paracetamol', defaultDose: '500mg', type: 'Tablet' },
  { id: 2, name: 'Amoxicillin', defaultDose: '250mg', type: 'Capsule' },
  { id: 3, name: 'Cetirizine', defaultDose: '10mg', type: 'Tablet' },
  { id: 4, name: 'Azithromycin', defaultDose: '500mg', type: 'Tablet' },
  { id: 5, name: 'Cough Syrup (Ascoril)', defaultDose: '10ml', type: 'Syrup' },
];

export default function PrescriptionBuilder({ patientId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  
  // Current Form State
  const [currentDrug, setCurrentDrug] = useState(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1-0-1');
  const [duration, setDuration] = useState('5 Days');
  const [instructions, setInstructions] = useState('After Food');
  const [diagnosis, setDiagnosis] = useState('');

  const handleSelectDrug = (drug) => {
    setCurrentDrug(drug);
    setDosage(drug.defaultDose);
    setSearchTerm('');
  };

  const handleAddDrug = () => {
    if (!currentDrug) return;
    
    const newEntry = {
      id: Date.now(),
      drug: currentDrug,
      dosage,
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
    ? MOCK_DRUGS.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col gap-6 lg:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column: Builder & Search */}
      <div className="flex w-full flex-col gap-6 lg:w-1/2">
        
        {/* Patient Info & Diagnosis */}
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Patient Details</h2>
              <p className="text-sm text-gray-500">Riya Sharma • 28 Female • ID: {patientId || 'PT-9921'}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <FileHeart className="h-5 w-5" />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Clinical Diagnosis / Chief Complaint</label>
            <input 
              type="text" 
              placeholder="e.g., Viral fever with upper respiratory tract infection"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Drug Search & Add Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
            <Pill className="h-5 w-5 text-indigo-600" />
            Prescribe Medication
          </h2>

          {!currentDrug ? (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search drug database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              
              {/* Autocomplete Dropdown */}
              {searchTerm && filteredDrugs.length > 0 && (
                <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-100 bg-white shadow-xl">
                  {filteredDrugs.map(drug => (
                    <button
                      key={drug.id}
                      onClick={() => handleSelectDrug(drug)}
                      className="flex w-full items-center justify-between border-b border-gray-50 p-3 text-left hover:bg-indigo-50 last:border-0"
                    >
                      <span className="font-semibold text-gray-800">{drug.name}</span>
                      <span className="text-xs text-gray-500">{drug.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-3">
                <span className="text-lg font-bold text-indigo-900">{currentDrug.name} <span className="text-sm font-normal text-indigo-600">({currentDrug.type})</span></span>
                <button onClick={() => setCurrentDrug(null)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Change</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Dosage</label>
                  <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-indigo-500 focus:outline-none">
                    <option>3 Days</option>
                    <option>5 Days</option>
                    <option>7 Days</option>
                    <option>14 Days</option>
                    <option>1 Month</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-indigo-500 focus:outline-none">
                    <option value="1-0-1">1-0-1 (Morning & Night)</option>
                    <option value="1-1-1">1-1-1 (Thrice a day)</option>
                    <option value="1-0-0">1-0-0 (Morning only)</option>
                    <option value="0-0-1">0-0-1 (Night only)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Instructions</label>
                  <select value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-indigo-500 focus:outline-none">
                    <option>After Food</option>
                    <option>Before Food</option>
                    <option>Empty Stomach</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleAddDrug}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" /> Add to Prescription
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Prescription Preview */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex-1 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
          <div className="rounded-t-2xl bg-indigo-900 p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <Stethoscope className="h-32 w-32 -translate-y-8 translate-x-8" />
            </div>
            <h3 className="text-xl font-bold tracking-widest uppercase">RX Prescription</h3>
            <p className="mt-1 text-sm text-indigo-200">CareConnect Digital Health Services</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 flex justify-between border-b border-dashed border-gray-200 pb-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900">Patient: Riya Sharma</p>
                <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">Dr. Sarah Connor</p>
                <p className="text-gray-500">Reg No: MED-88902</p>
              </div>
            </div>

            {diagnosis && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Diagnosis</p>
                <p className="font-medium text-gray-900">{diagnosis}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Medications</p>
              
              {selectedDrugs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-gray-400">
                  <Pill className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No medications added yet.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {selectedDrugs.map((entry, idx) => (
                    <li key={entry.id} className="group relative flex items-start justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{idx + 1}</span>
                          <span className="font-bold text-gray-900">{entry.drug.name} {entry.dosage}</span>
                        </div>
                        <p className="ml-7 mt-1 text-sm text-gray-600">
                          {entry.frequency} • {entry.duration} • {entry.instructions}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveDrug(entry.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 rounded-full p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
          
          <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50 p-4 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button 
              disabled={selectedDrugs.length === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSignature className="h-4 w-4" /> Digitally Sign & Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
