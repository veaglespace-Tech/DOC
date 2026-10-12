'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  Send, 
  ShieldCheck, 
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getClientSocket } from '@/utils/socket';

export default function PatientConsultationRoom() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id || '1';

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Real-time Chat State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/${appointmentId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: messageText, type: 'TEXT' })
      });
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col gap-6 lg:flex-row p-4 max-w-7xl mx-auto">
      
      {/* Video Call Section */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl relative ring-1 ring-zinc-800">
        
        {/* Main Video (Doctor feed) */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80" 
            alt="Doctor Video Feed" 
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-white">Consultation with Doctor • Apt #{appointmentId}</span>
          </div>
        </div>

        {/* Patient Pip (Bottom Right) */}
        <div className="absolute bottom-24 right-6 h-44 w-32 overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-800 shadow-xl sm:h-52 sm:w-36">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" 
            alt="Your Video" 
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            You (Patient)
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

          <Link 
            href="/patient/appointments"
            className="flex h-12 px-6 items-center justify-center gap-2 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700"
          >
            <PhoneOff className="h-5 w-5" />
            <span className="font-semibold text-sm">Leave Room</span>
          </Link>
        </div>
      </div>

      {/* Side Panel (Encrypted Live Chat) */}
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:w-[400px]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">Secure Live Chat</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Encrypted
          </span>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              Chat directly with your attending physician during this consultation.
            </div>
          ) : (
            messages.map((m, idx) => {
              const isPatient = m.senderId?.toString() !== 'doctor' && !m.senderName?.includes('Dr');
              return (
                <div key={m.id || idx} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs ${
                    isPatient 
                      ? 'bg-teal-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    <p className="font-medium">{m.content}</p>
                    <span className={`block text-[10px] mt-1 ${isPatient ? 'text-teal-200 text-right' : 'text-gray-400'}`}>
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
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message to doctor..." 
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs shadow-inner focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button 
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white transition-transform hover:scale-105 disabled:bg-gray-300 shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
