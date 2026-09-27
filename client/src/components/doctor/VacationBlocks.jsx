'use client';

import React, { useState } from 'react';
import { Palmtree, Plus, Trash2 } from 'lucide-react';

export default function VacationBlocks() {
  const [vacations, setVacations] = useState([
    { id: 1, startDate: '2026-11-10', endDate: '2026-11-15', reason: 'Family Vacation' }
  ]);

  const addVacation = () => {
    setVacations([
      ...vacations,
      { id: Date.now(), startDate: '', endDate: '', reason: '' }
    ]);
  };

  const removeVacation = (id) => {
    setVacations(vacations.filter(v => v.id !== id));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palmtree className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-800">Vacation & Time Off</h2>
        </div>
        <button 
          onClick={addVacation}
          className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100"
        >
          <Plus className="h-4 w-4" />
          Add Time Off
        </button>
      </div>

      {vacations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-gray-500">
          <Palmtree className="mb-2 h-8 w-8 text-gray-300" />
          <p>No upcoming vacations scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vacations.map((vacation) => (
            <div key={vacation.id} className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500">Start Date</label>
                <input
                  type="date"
                  value={vacation.startDate}
                  onChange={(e) => {
                    const newVacations = vacations.map(v => v.id === vacation.id ? { ...v, startDate: e.target.value } : v);
                    setVacations(newVacations);
                  }}
                  className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500">End Date</label>
                <input
                  type="date"
                  value={vacation.endDate}
                  onChange={(e) => {
                    const newVacations = vacations.map(v => v.id === vacation.id ? { ...v, endDate: e.target.value } : v);
                    setVacations(newVacations);
                  }}
                  className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="flex-[2] space-y-1">
                <label className="text-xs font-semibold text-gray-500">Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Conference"
                  value={vacation.reason}
                  onChange={(e) => {
                    const newVacations = vacations.map(v => v.id === vacation.id ? { ...v, reason: e.target.value } : v);
                    setVacations(newVacations);
                  }}
                  className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={() => removeVacation(vacation.id)}
                className="rounded-lg p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
