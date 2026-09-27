'use client';

import React from 'react';
import LiveTrackingMap from '@/components/patient/LiveTrackingMap';

export default function SOSTrackingPage() {
  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-red-600">Emergency Dispatched</h1>
        <p className="text-gray-500">Please stay calm. A doctor is on the way to your location.</p>
      </div>

      <LiveTrackingMap />
    </div>
  );
}
