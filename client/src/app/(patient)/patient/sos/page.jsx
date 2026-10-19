'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  HeartPulse, 
  RefreshCw, 
  PhoneCall,
  CheckCircle2,
  Stethoscope,
  Info
} from 'lucide-react';
import { useTriggerEmergencyMutation } from '@/store/api/emergencyApi';

const EMERGENCY_TYPES = [
  { id: 'CARDIAC', label: 'Chest Pain / Suspected Cardiac Arrest', icon: HeartPulse, priority: 'CRITICAL' },
  { id: 'RESPIRATORY', label: 'Severe Breathing Distress / Asthma', icon: Activity, priority: 'CRITICAL' },
  { id: 'TRAUMA', label: 'Trauma / Heavy Bleeding / Fall Injury', icon: AlertTriangle, priority: 'HIGH' },
  { id: 'UNCONSCIOUS', label: 'Unconsciousness / Stroke / Seizure', icon: ShieldAlert, priority: 'CRITICAL' },
  { id: 'PEDIATRIC', label: 'Pediatric Acute Illness / High Fever', icon: Stethoscope, priority: 'HIGH' },
  { id: 'OTHER', label: 'Other Acute Medical Emergency', icon: AlertTriangle, priority: 'MEDIUM' }
];

export default function PatientSOSTriggerPage() {
  const router = useRouter();
  const [triggerEmergency, { isLoading: isDispatching }] = useTriggerEmergencyMutation();

  const [selectedType, setSelectedType] = useState('CARDIAC');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [coords, setCoords] = useState({ latitude: 18.5204, longitude: 73.8567 });
  const [locationStatus, setLocationStatus] = useState('Default Location: Pune Central (18.5204°N, 73.8567°E)');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [dispatchError, setDispatchError] = useState('');

  const detectLocation = () => {
    setIsDetectingLocation(true);
    setLocationStatus('Acquiring precise GPS satellite fix...');

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setLocationStatus(`GPS Locked: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (±${Math.round(pos.coords.accuracy)}m)`);
          setIsDetectingLocation(false);
        },
        () => {
          setCoords({ latitude: 18.5204, longitude: 73.8567 });
          setLocationStatus('Default Location: Pune Central (18.5204°N, 73.8567°E)');
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocationStatus('Default Location: Pune Central (18.5204°N, 73.8567°E)');
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setLocationStatus(`GPS Locked: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (±${Math.round(pos.coords.accuracy)}m)`);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const handleTriggerDispatch = async (e) => {
    e.preventDefault();
    setDispatchError('');

    try {
      const typeObj = EMERGENCY_TYPES.find(t => t.id === selectedType);
      const combinedNeeds = `${typeObj?.label || 'Emergency Assistance'}${medicalNotes.trim() ? ` — Notes: ${medicalNotes.trim()}` : ''}`;

      const response = await triggerEmergency({
        latitude: coords.latitude,
        longitude: coords.longitude,
        medicalNeeds: combinedNeeds
      }).unwrap();

      const requestId = response?.data?.emergencyRequest?.id;
      if (requestId) {
        router.push(`/patient/sos/tracking?requestId=${requestId}`);
      } else {
        router.push('/patient/sos/tracking');
      }
    } catch (err) {
      setDispatchError(err?.data?.message || 'Failed to trigger emergency dispatch. Please call national emergency 112 immediately.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Warning Pulses */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-600/15 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-red-500/30 overflow-hidden relative z-10">
        
        {/* Warning Banner Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/20 animate-pulse">
              <ShieldAlert className="h-9 w-9 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-red-100 text-xs font-black uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-white animate-spin" />
              Rapid Response Protocol (BRD Sec 7)
            </div>
            <h1 className="text-3xl font-black tracking-tight">Doctor SOS Dispatch</h1>
            <p className="mt-1 text-red-100 text-xs sm:text-sm font-medium max-w-md mx-auto">
              Simultaneously alerts all verified doctors within a 5km radius via real-time satellite PostGIS routing.
            </p>
          </div>
        </div>

        <form onSubmit={handleTriggerDispatch} className="p-6 sm:p-8 space-y-6">
          
          {dispatchError && (
            <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-bold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{dispatchError}</span>
            </div>
          )}

          {/* Emergency Category Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
              1. Select Emergency Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-snug">{type.label}</div>
                      <span className={`text-[10px] font-black uppercase tracking-wider mt-1 block ${
                        type.priority === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {type.priority} PRIORITY
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Detection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                2. Your Dispatch Coordinates
              </label>
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="text-[11px] text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} /> Refresh GPS
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="truncate flex-1">
                <span className="font-mono text-slate-200 font-bold block truncate">{locationStatus}</span>
                <span className="text-[10px] text-slate-400">Nearest mobile medical unit will route to this pin</span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
              3. Critical Patient Symptoms / Flat Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Patient is conscious but has high BP. Building 4, 3rd floor."
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>

          {/* Trigger Dispatch Button */}
          <button
            type="submit"
            disabled={isDispatching}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Dispatching to 5km Network...
              </>
            ) : (
              <>
                <span>Broadcast Emergency SOS</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Regulatory Disclaimer (BRD Sec 7 & 15) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-[11px] text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Statutory Notice:</strong> This service dispatches licensed on-call medical practitioners for acute home care. If the patient has suffered severe cardiac arrest or heavy blood loss, also immediately dial national emergency ambulance at <span className="text-red-400 font-bold">108</span> or <span className="text-red-400 font-bold">112</span>.
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}
