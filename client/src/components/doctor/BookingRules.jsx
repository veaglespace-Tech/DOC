'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export default function BookingRules() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-800">Booking Rules</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Slot Duration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Slot Duration (Minutes)</label>
            <p className="text-xs text-gray-500 mb-2">Duration of each patient visit.</p>
            <select className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500">
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          {/* Buffer Time */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Buffer Time (Minutes)</label>
            <p className="text-xs text-gray-500 mb-2">Rest time between two appointments.</p>
            <select className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500">
              <option value="0">0 Minutes (No buffer)</option>
              <option value="5">5 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="15">15 Minutes</option>
            </select>
          </div>

          {/* Advance Booking Limit */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Maximum Advance Booking</label>
            <p className="text-xs text-gray-500 mb-2">How far in advance can patients book?</p>
            <select className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500">
              <option value="7">1 Week</option>
              <option value="14">2 Weeks</option>
              <option value="30">1 Month</option>
              <option value="90">3 Months</option>
            </select>
          </div>

          {/* Minimum Notice */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Minimum Notice for Booking</label>
            <p className="text-xs text-gray-500 mb-2">Minimum time required before appointment.</p>
            <select className="block w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500">
              <option value="0">0 Hours (Immediate)</option>
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="24">24 Hours</option>
            </select>
          </div>
        </div>

        {/* Emergency Availability Toggle */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <div>
            <h4 className="font-semibold text-gray-900">Emergency Availability</h4>
            <p className="text-sm text-gray-500">Allow patients to request emergency home visits based on your radius.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300"></div>
          </label>
        </div>

      </div>
    </div>
  );
}
