import React from 'react';
import { FileText, Download, Calendar, Stethoscope } from 'lucide-react';

export default function MedicalRecordsCard() {
  const records = [
    {
      id: 'REC-001',
      date: '15 Sep, 2026',
      title: 'Complete Blood Count (CBC)',
      doctor: 'Dr. Sarah Connor',
      type: 'Lab Report',
    },
    {
      id: 'REC-002',
      date: '02 Aug, 2026',
      title: 'General Consultation Prescription',
      doctor: 'Dr. Michael Chang',
      type: 'Prescription',
    },
    {
      id: 'REC-003',
      date: '10 Jun, 2026',
      title: 'Chest X-Ray',
      doctor: 'Dr. Emily Rose',
      type: 'Scan',
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-800">Previous Medical Records</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80">View All</button>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="group relative flex items-start gap-4 rounded-xl border border-gray-100 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FileText className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{record.title}</h4>
                <span className="text-xs font-medium text-gray-500">{record.date}</span>
              </div>
              
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-4 w-4" />
                  <span>{record.doctor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{record.type}</span>
                </div>
              </div>
            </div>

            <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 opacity-0 transition-all hover:bg-indigo-100 hover:text-indigo-600 group-hover:opacity-100">
              <Download className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
