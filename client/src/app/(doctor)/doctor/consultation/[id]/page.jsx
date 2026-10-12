'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MonitorUp, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  ClipboardList, 
  Send, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getClientSocket } from '@/utils/socket';
import { useCompleteVisitMutation } from '@/store/api/appointmentApi';

export default function ConsultationRoom() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id || '1';

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'chat'
  const [notes, setNotes] = useState('');
  
  // Real-time Chat State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const messagesEndRef = useRef(null);

  const [completeVisit, { isLoading: isCompleting }] = useCompleteVisitMutation();

  // 1. Fetch Chat History & Join Socket Room
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/${appointmentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data?.conversation?.messages) {
          setMessages(data.data.conversation.messages);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchChat();

    // Socket Setup
    const socket = getClientSocket();
    if (socket) {
      socket.emit('join:appointment', appointmentId);

      socket.on('chat:message:new', (data) => {
        if (data.appointmentId == appointmentId && data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('chat:message:new');
      }
    };
  }, [appointmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const token = localStorage.getItem('careconnect_token') || sessionStorage.getItem('careconnect_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/${appointmentId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: messageText, type: 'TEXT' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Appended or received via socket
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // 3. Complete Visit & End Call (BRD Sec 8 & 11)
  const handleEndCall = async () => {
    try {
      await completeVisit({
        id: appointmentId,
        data: {
          doctorNotes: notes || 'Consultation concluded successfully.',
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }).unwrap();

      setCallEnded(true);
      setTimeout(() => {
        router.push(`/doctor/prescription/${appointmentId}`);
      }, 1500);
    } catch (err) {
      alert(err?.data?.message || 'Error finalizing visit');
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col gap-6 lg:flex-row animate-in fade-in zoom-in-95 duration-500">
      
      {/* Video Call Section */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl relative ring-1 ring-zinc-800">
        
        {/* Main Video (Patient) */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
          {callEnded ? (
            <div className="text-center p-8 text-white space-y-3">
              <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black">Consultation Completed!</h3>
              <p className="text-zinc-400 text-sm">Earnings credited to wallet under 24-hour hold. Redirecting to prescription pad...</p>
            </div>
          ) : (
            <>
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" 
                alt="Patient Video Feed" 
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-white">Patient Video Room • Apt #{appointmentId}</span>
              </div>
            </>
          )}
        </div>

        {/* Picture-in-Picture (Doctor) */}
        {!callEnded && (
          <div className="absolute bottom-24 right-6 h-48 w-32 overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-800 shadow-xl transition-transform hover:scale-105 sm:h-56 sm:w-40">
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" 
              alt="Doctor Video Feed" 
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
              You (Doctor)
            </div>
          </div>
        )}

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

          <button 
            onClick={handleEndCall}
            disabled={isCompleting || callEnded}
            className="flex h-12 px-6 items-center justify-center gap-2 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700 disabled:bg-zinc-700"
          >
            <PhoneOff className="h-5 w-5" />
            <span className="font-semibold text-sm">{isCompleting ? 'Finalizing...' : 'Complete Visit'}</span>
          </button>
        </div>
      </div>

      {/* Side Panel (Notes & Chat) */}
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:w-[420px]">
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
            <MessageSquare className="h-4 w-4" /> Live Chat ({messages.length})
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 bg-gray-50/50 p-4 overflow-hidden flex flex-col">
          {activeTab === 'notes' ? (
            <div className="flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Clinical Diagnosis Notes</h3>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Auto-attached to visit
                </span>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type symptoms, medical diagnosis, vitals observations... These will be saved when completing the visit."
                className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Link 
                href={`/doctor/prescription/${appointmentId}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
              >
                <FileText className="h-4 w-4" /> Open Digital Prescription Pad
              </Link>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 pb-3 pr-1">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    Start of secure encrypted consultation chat for Appointment #{appointmentId}.
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isDoc = m.senderId?.toString() === 'doctor' || m.senderName?.includes('Dr') || m.type === 'SYSTEM';
                    return (
                      <div key={m.id || idx} className={`flex ${isDoc ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs ${
                          isDoc 
                            ? 'bg-teal-600 text-white rounded-tr-sm' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                        }`}>
                          <p className="font-medium">{m.content}</p>
                          <span className={`block text-[10px] mt-1 ${isDoc ? 'text-teal-200 text-right' : 'text-gray-400'}`}>
                            {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="relative mt-auto flex items-center">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message to patient..." 
                  className="w-full rounded-full border border-gray-200 bg-white py-3 pl-4 pr-12 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button 
                  type="submit"
                  disabled={isSending || !inputMessage.trim()}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white transition-transform hover:scale-105 disabled:bg-gray-300"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
