'use client';

import React from 'react';
import { Activity, Heart, ShieldAlert, Droplets, User, Calendar } from 'lucide-react';

export default function VitalsCard({ profile, onEdit }) {
  const bloodGroup = profile?.bloodGroup || 'Not set';
  const gender = profile?.gender || 'Not set';
  const dob = profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set';
  const emergency = profile?.emergencyContact || 'Not set';

  const vitals = [
    { label: 'Blood Group', value: bloodGroup, icon: Droplets, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Gender', value: gender, icon: User, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Date of Birth', value: dob, icon: Calendar, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Emergency Contact', value: emergency, icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Personal Health Attributes</h3>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors"
          >
            Update
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {vitals.map((vital, index) => {
          const Icon = vital.icon;
          return (
            <div key={index} className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-colors hover:bg-slate-50">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${vital.bg}`}>
                <Icon className={`h-5 w-5 ${vital.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{vital.label}</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 break-words">{vital.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
