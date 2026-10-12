'use client';

import React, { useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';

export default function BookingRules() {
  const [slotDuration, setSlotDuration] = useState('30');
  const [bufferTime, setBufferTime] = useState('5');
  const [advanceLimit, setAdvanceLimit] = useState('30');
  const [minNotice, setMinNotice] = useState('1');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking Rules & Buffers</h2>
            <p className="text-xs text-gray-500">Configure appointment pacing, emergency radius, and advance limits</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="rounded-xl bg-orange-600 hover:bg-orange-700 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-md shadow-orange-600/20"
        >
          Save Rules
        </button>
      </div>

      {isSaved && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Booking rules and slot duration updated successfully!
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Slot Duration */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Slot Duration (Minutes)</label>
            <p className="text-xs text-gray-500 mb-1">Standard allocated time for each consultation.</p>
            <select 
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-orange-500 bg-white"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          {/* Buffer Time */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Buffer Time (Minutes)</label>
            <p className="text-xs text-gray-500 mb-1">Intermission between consecutive appointments.</p>
            <select 
              value={bufferTime}
              onChange={(e) => setBufferTime(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-orange-500 bg-white"
            >
              <option value="0">0 Minutes (No buffer)</option>
              <option value="5">5 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="15">15 Minutes</option>
            </select>
          </div>

          {/* Advance Booking Limit */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Maximum Advance Window</label>
            <p className="text-xs text-gray-500 mb-1">How far ahead can patients reserve slots?</p>
            <select 
              value={advanceLimit}
              onChange={(e) => setAdvanceLimit(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-orange-500 bg-white"
            >
              <option value="7">1 Week</option>
              <option value="14">2 Weeks</option>
              <option value="30">1 Month (Standard)</option>
              <option value="90">3 Months</option>
            </select>
          </div>

          {/* Minimum Notice */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Minimum Lead Time</label>
            <p className="text-xs text-gray-500 mb-1">Minimum notice required prior to start time.</p>
            <select 
              value={minNotice}
              onChange={(e) => setMinNotice(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-orange-500 bg-white"
            >
              <option value="0">Immediate / Walk-in</option>
              <option value="1">1 Hour in advance</option>
              <option value="2">2 Hours in advance</option>
              <option value="24">24 Hours in advance</option>
            </select>
          </div>
        </div>

        {/* Emergency Availability Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Emergency SOS Dispatch Availability</h4>
            <p className="text-xs text-gray-600 mt-0.5">Receive immediate SOS alerts when emergency doctor dispatch is triggered within your 15km service radius.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input 
              type="checkbox" 
              className="peer sr-only" 
              checked={emergencyAvailable}
              onChange={(e) => setEmergencyAvailable(e.target.checked)}
            />
            <div className="peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          </label>
        </div>

      </div>
    </div>
  );
}
