'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Activity, Heart, Droplets, Wind, TrendingUp, Calendar, Info } from 'lucide-react';

// Sample clinical longitudinal readings
const MOCK_VITALS_DATA = [
  { date: '01 Nov', systolic: 118, diastolic: 76, heartRate: 72, sugar: 94, spo2: 99 },
  { date: '03 Nov', systolic: 122, diastolic: 79, heartRate: 75, sugar: 98, spo2: 98 },
  { date: '05 Nov', systolic: 120, diastolic: 78, heartRate: 70, sugar: 102, spo2: 99 },
  { date: '07 Nov', systolic: 124, diastolic: 82, heartRate: 78, sugar: 105, spo2: 98 },
  { date: '09 Nov', systolic: 119, diastolic: 77, heartRate: 71, sugar: 96, spo2: 99 },
  { date: '11 Nov', systolic: 121, diastolic: 80, heartRate: 74, sugar: 99, spo2: 99 },
  { date: 'Today', systolic: 118, diastolic: 78, heartRate: 72, sugar: 95, spo2: 99 }
];

export default function VitalsTrendChart() {
  const [metric, setMetric] = useState('bp'); // 'bp' | 'heart' | 'sugar' | 'spo2'

  const metricsConfig = {
    bp: {
      name: 'Blood Pressure',
      unit: 'mmHg',
      icon: Activity,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      normalRange: 'Systolic: 90-120 mmHg | Diastolic: 60-80 mmHg',
      status: 'Normal',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      current: '118/78 mmHg'
    },
    heart: {
      name: 'Heart Rate',
      unit: 'bpm',
      icon: Heart,
      color: 'text-rose-600',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
      normalRange: 'Normal Resting: 60 - 100 bpm',
      status: 'Optimal',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      current: '72 bpm'
    },
    sugar: {
      name: 'Fasting Blood Sugar',
      unit: 'mg/dL',
      icon: Droplets,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
      normalRange: 'Normal Fasting: 70 - 100 mg/dL',
      status: 'Normal',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      current: '95 mg/dL'
    },
    spo2: {
      name: 'Blood Oxygen (SpO2)',
      unit: '%',
      icon: Wind,
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
      normalRange: 'Normal: 95% - 100%',
      status: 'Excellent',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      current: '99%'
    }
  };

  const activeConf = metricsConfig[metric];
  const Icon = activeConf.icon;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/50 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Vitals Trends &amp; Longitudinal History
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track vital health markers across regular home and video consultations
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/70">
          {[
            { id: 'bp', label: 'BP', icon: Activity },
            { id: 'heart', label: 'Heart Rate', icon: Heart },
            { id: 'sugar', label: 'Sugar', icon: Droplets },
            { id: 'spo2', label: 'SpO2', icon: Wind }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = metric === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMetric(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Metric Highlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Latest Reading
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {activeConf.current}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Clinical Status
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-xs font-bold border ${activeConf.statusColor}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {activeConf.status}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Normal Reference Band
          </span>
          <span className="text-xs font-semibold text-slate-600 mt-1 block">
            {activeConf.normalRange}
          </span>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_VITALS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />

            {metric === 'bp' && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  name="Systolic (mmHg)" 
                  stroke="#4f46e5" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  name="Diastolic (mmHg)" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}

            {metric === 'heart' && (
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                name="Heart Rate (bpm)" 
                stroke="#e11d48" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#e11d48' }}
                activeDot={{ r: 6 }}
              />
            )}

            {metric === 'sugar' && (
              <Line 
                type="monotone" 
                dataKey="sugar" 
                name="Blood Sugar (mg/dL)" 
                stroke="#d97706" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#d97706' }}
                activeDot={{ r: 6 }}
              />
            )}

            {metric === 'spo2' && (
              <Line 
                type="monotone" 
                dataKey="spo2" 
                name="SpO2 (%)" 
                stroke="#0d9488" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#0d9488' }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Info className="h-3.5 w-3.5 text-indigo-500" />
          Values logged during online consultations &amp; doctor home visits
        </span>
        <span className="font-mono font-bold text-slate-500">Auto-synchronized</span>
      </div>
    </div>
  );
}
