'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, MessageCircle, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export default function LiveTrackingMap() {
  const [eta, setEta] = useState(12); // minutes
  const [distance, setDistance] = useState(2.4); // km

  // Simulate real-time tracking updates
  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => (prev > 1 ? prev - 1 : 1));
      setDistance(prev => (prev > 0.2 ? Number((prev - 0.2).toFixed(1)) : 0.2));
    }, 15000); // update every 15 seconds for simulation
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-[calc(100vh-10rem)] w-full flex-col overflow-hidden rounded-3xl bg-zinc-100 shadow-xl ring-1 ring-zinc-200 lg:flex-row animate-in fade-in zoom-in-95 duration-500">
      
      {/* Map Area (Simulated) */}
      <div className="relative flex-1 bg-zinc-200">
        {/* We use a static map image for UI scaffolding; normally replace with Google Maps / Mapbox */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
          alt="Live Map" 
          className="h-full w-full object-cover opacity-60"
        />
        
        {/* Map Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent"></div>
        
        {/* Simulated Route Line & Pins */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Patient Location */}
          <div className="absolute left-10 top-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          
          {/* Doctor / Ambulance Location (Animated) */}
          <div className="absolute left-32 top-32 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-xl">
              <Navigation className="h-5 w-5" />
            </div>
          </div>
          
          {/* SVG Dotted Line Connecting Them */}
          <svg className="absolute left-16 top-16 h-32 w-32 overflow-visible">
            <path 
              d="M 0,0 Q 50,50 100,100" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="4" 
              strokeDasharray="8 8" 
              className="animate-[dash_1s_linear_infinite]" 
            />
          </svg>
        </div>

        {/* Floating SOS Badge */}
        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold tracking-widest text-white shadow-lg animate-pulse">
          <AlertTriangle className="h-5 w-5" />
          ACTIVE SOS
        </div>
      </div>

      {/* Tracking Info Panel */}
      <div className="z-10 flex w-full flex-col bg-white p-6 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] lg:w-[400px]">
        
        {/* ETA Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">{eta} <span className="text-xl font-semibold text-gray-500">mins</span></h2>
          <p className="font-medium text-emerald-600">Arriving soon • {distance} km away</p>
          
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-1.5 w-full rounded-full bg-emerald-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.max(10, 100 - (eta * 5))}%` }}></div>
            </div>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-md">
              <img src="https://i.pravatar.cc/150?u=DOC-SOS" alt="Doctor" className="h-full w-full object-cover" />
              <div className="absolute bottom-0 right-0 rounded-full border border-white bg-blue-500 p-0.5">
                <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Dr. Ramesh Sharma</h3>
              <p className="text-sm text-gray-500">Emergency Physician</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                <Clock className="h-3 w-3" /> Dispatched via CareConnect
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800">
              <Phone className="h-4 w-4" /> Call Doctor
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-all hover:bg-gray-50">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
          
          <button className="flex w-full items-center justify-center rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100">
            Cancel Emergency Request
          </button>
        </div>
      </div>
      
    </div>
  );
}
