'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Activity, FileText, AlertCircle, Loader2 } from 'lucide-react';

export default function AIChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am the CareConnect AI Medical Assistant. I can help you check symptoms, find the right specialist, or summarize your recent medical reports. How can I assist you today?",
      time: "10:00 AM"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Based on your symptoms, I recommend scheduling a consultation with a General Physician. Would you like me to show you available doctors near you?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    "I have a severe headache",
    "Analyze my latest blood report",
    "Book an appointment for tomorrow",
    "What are the side effects of Paracetamol?"
  ];

  return (
    <div className="h-[calc(100vh-2rem)] p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-t-3xl p-6 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">CareConnect AI Intelligence</h1>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Online & Ready
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="flex items-center gap-2 text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
            <FileText className="h-4 w-4" /> Export Chat
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50/50 overflow-y-auto p-6 space-y-6 border-x border-slate-100 scroll-smooth">
        
        {/* Security Notice */}
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> AI responses do not constitute a final medical diagnosis. Always consult a verified doctor.
          </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                {msg.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed font-medium text-sm md:text-base">{msg.text}</p>
                </div>
                <span className="text-xs font-medium text-slate-400 mt-1.5 px-1">{msg.time}</span>
              </div>
              
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[80%]">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-3xl p-6 border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action, idx) => (
            <button 
              key={idx}
              onClick={() => setInput(action)}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              {action}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="relative flex items-center">
          <Activity className="h-6 w-6 absolute left-4 text-slate-400" />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask a medical question..." 
            className="w-full pl-12 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <Send className="h-5 w-5 ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
}
