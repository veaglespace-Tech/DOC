import React from 'react';
import { ShieldAlert, PlusCircle } from 'lucide-react';

export default function AllergiesCard() {
  const allergies = [
    { name: 'Penicillin', severity: 'High', type: 'Medication' },
    { name: 'Peanuts', severity: 'Medium', type: 'Food' },
    { name: 'Dust Mites', severity: 'Low', type: 'Environmental' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-800">Allergies</h3>
        </div>
        <button className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
          <PlusCircle className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {allergies.map((allergy, index) => (
          <div key={index} className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
            <div>
              <p className="font-semibold text-gray-900">{allergy.name}</p>
              <p className="text-xs text-gray-500">{allergy.type}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getSeverityColor(allergy.severity)}`}>
              {allergy.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
