'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';

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

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-gray-800">Weekly Recurring Schedule</h2>
        </div>
        <button className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100">
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex flex-col gap-4 rounded-xl border border-gray-50 bg-gray-50/30 p-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex w-32 items-center gap-2 sm:mt-2">
              <input
                type="checkbox"
                checked={schedule[day].length > 0}
                onChange={() => {
                  if (schedule[day].length > 0) setSchedule({ ...schedule, [day]: [] });
                  else addSlot(day);
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-gray-700">{day}</span>
            </div>
            
            <div className="flex-1 space-y-3">
              {schedule[day].length === 0 ? (
                <div className="flex h-10 items-center text-sm text-gray-400">Unavailable</div>
              ) : (
                schedule[day].map((slot, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                        className="border-none bg-transparent p-0 text-sm focus:ring-0"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                        className="border-none bg-transparent p-0 text-sm focus:ring-0"
                      />
                    </div>
                    <button
                      onClick={() => removeSlot(day, index)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="sm:mt-2">
              <button
                onClick={() => addSlot(day)}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
