import React from 'react';
import { Activity, Heart, Scale, Droplets } from 'lucide-react';

export default function VitalsCard() {
  const vitals = [
    { label: 'Blood Group', value: 'O+', icon: Droplets, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Height', value: '175 cm', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Weight', value: '72 kg', icon: Scale, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Blood Pressure', value: '120/80', icon: Heart, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Personal Vitals</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80">Edit</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {vitals.map((vital, index) => {
          const Icon = vital.icon;
          return (
            <div key={index} className="flex items-center gap-4 rounded-xl border border-gray-50 p-4 transition-colors hover:bg-gray-50">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${vital.bg}`}>
                <Icon className={`h-6 w-6 ${vital.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{vital.label}</p>
                <p className="text-lg font-bold text-gray-900">{vital.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
