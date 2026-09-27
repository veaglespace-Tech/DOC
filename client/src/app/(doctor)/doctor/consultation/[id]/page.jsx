'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquare, FileText, ClipboardList, Send, CheckCircle2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ConsultationRoom() {
  const params = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'chat'
  const [notes, setNotes] = useState('');

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col gap-6 lg:flex-row animate-in fade-in zoom-in-95 duration-500">
      
      {/* Video Call Section */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl relative ring-1 ring-zinc-800">
        
        {/* Main Video (Patient) */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" 
            alt="Patient Video Feed" 
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-white">Riya Sharma (Patient)</span>
          </div>
        </div>

        {/* Picture-in-Picture (Doctor) */}
        <div className="absolute bottom-24 right-6 h-48 w-32 overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-800 shadow-xl transition-transform hover:scale-105 sm:h-56 sm:w-40">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" 
            alt="Doctor Video Feed" 
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            You
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex h-20 items-center justify-center gap-4 bg-zinc-900/90 px-6 backdrop-blur-xl">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white transition-all hover:bg-zinc-700">
            <MonitorUp className="h-5 w-5" />
          </button>

          <button className="flex h-12 w-24 items-center justify-center gap-2 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700">
            <PhoneOff className="h-5 w-5" />
            <span className="font-semibold text-sm">End</span>
          </button>
        </div>
      </div>

      {/* Side Panel (Notes & Chat) */}
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:w-[400px]">
        {/* Panel Tabs */}
        <div className="flex border-b border-gray-100 p-2">
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${activeTab === 'notes' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ClipboardList className="h-4 w-4" /> Live Notes
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <MessageSquare className="h-4 w-4" /> Chat
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 bg-gray-50/50 p-4">
          {activeTab === 'notes' ? (
            <div className="flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Clinical Notes</h3>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Auto-saving
                </span>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type patient symptoms, diagnosis, and prescription details here... These notes will be attached to the final prescription."
                className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg">
                <FileText className="h-4 w-4" /> Generate Prescription
              </button>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm text-gray-700 shadow-sm border border-gray-100">
                    Hello Doctor, I have been experiencing severe headaches since yesterday.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-indigo-600 p-3 text-sm text-white shadow-sm">
                    Don't worry, let's discuss this on the call. Are you taking any medications?
                  </div>
                </div>
              </div>
              
              <div className="relative mt-auto flex items-center">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full rounded-full border border-gray-200 bg-white py-3 pl-4 pr-12 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white transition-transform hover:scale-105">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
