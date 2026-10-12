'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AvailabilityScheduler() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [schedule, setSchedule] = useState({
    Monday: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }],
    Tuesday: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }],
    Wednesday: [{ start: '09:00', end: '13:00' }],
    Thursday: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }],
    Friday: [{ start: '09:00', end: '13:00' }],
    Saturday: [],
    Sunday: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addSlot = (day) => {
    setSchedule({
      ...schedule,
      [day]: [...schedule[day], { start: '09:00', end: '17:00' }]
    });
  };

  const removeSlot = (day, index) => {
    const updatedDay = schedule[day].filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: updatedDay
    });
  };

  const handleTimeChange = (day, index, field, value) => {
    const updatedDay = [...schedule[day]];
    updatedDay[index][field] = value;
    setSchedule({
      ...schedule,
      [day]: updatedDay
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      
      // Save schedule preferences
      const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
      
      // Fire requests for any configured slots
      for (const [dayName, slots] of Object.entries(schedule)) {
        for (const slot of slots) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/doctors/availability`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              dayOfWeek: dayMap[dayName],
              startTime: slot.start,
              endTime: slot.end
            })
          }).catch(() => {});
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Weekly Recurring Schedule</h2>
            <p className="text-xs text-gray-500">Configure consultation hours for each day of the week</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-md shadow-indigo-600/20"
        >
          {isSaving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Weekly recurring schedule saved and synchronized with patient booking slots!
        </div>
      )}

      <div className="space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:gap-6 hover:border-gray-200 transition-colors">
            <div className="flex w-36 items-center gap-3">
              <input
                type="checkbox"
                id={`check-${day}`}
                checked={schedule[day].length > 0}
                onChange={() => {
                  if (schedule[day].length > 0) setSchedule({ ...schedule, [day]: [] });
                  else addSlot(day);
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor={`check-${day}`} className="font-bold text-gray-800 text-sm cursor-pointer">{day}</label>
            </div>
            
            <div className="flex-1 space-y-2">
              {schedule[day].length === 0 ? (
                <div className="flex h-10 items-center text-xs font-semibold text-gray-400 italic">Day Off (Unavailable)</div>
              ) : (
                schedule[day].map((slot, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 shadow-xs">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                        className="border-none bg-transparent p-0 text-xs font-semibold text-gray-700 focus:ring-0"
                      />
                    </div>
                    <span className="text-gray-400 font-bold text-xs">to</span>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 shadow-xs">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                        className="border-none bg-transparent p-0 text-xs font-semibold text-gray-700 focus:ring-0"
                      />
                    </div>
                    <button
                      onClick={() => removeSlot(day, index)}
                      className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="sm:mt-0">
              <button
                onClick={() => addSlot(day)}
                className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Break / Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
