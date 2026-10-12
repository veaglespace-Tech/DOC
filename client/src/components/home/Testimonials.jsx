'use client';
import React, { useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Maternity Patient",
    content: "The care and attention I received during my pregnancy was unparalleled. The nursing staff made me feel at home. Best hospital in the city.",
    rating: 5,
    avatarColor: "bg-teal-500 text-white shadow-teal-500/30",
    shadowColor: "shadow-teal-200/40 hover:shadow-teal-300/50 hover:border-teal-200",
    innerGlow: "shadow-[inset_0_0_30px_rgba(20,184,166,0.1)]",
    gradientHover: "from-teal-50/60 via-transparent to-teal-100/40",
    starColor: "fill-teal-400 text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.4)]",
    quoteColor: "text-teal-500/10",
    roleColor: "text-teal-600"
  },
  {
    id: 2,
    name: "Rahul Desai",
    role: "Cardiology Patient",
    content: "I had an emergency cardiac arrest and the ambulance dispatch was lightning fast. The robotic surgery team saved my life.",
    rating: 5,
    avatarColor: "bg-emerald-500 text-white shadow-emerald-500/30",
    shadowColor: "shadow-emerald-200/40 hover:shadow-emerald-300/50 hover:border-emerald-200",
    innerGlow: "shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]",
    gradientHover: "from-emerald-50/60 via-transparent to-emerald-100/40",
    starColor: "fill-emerald-400 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]",
    quoteColor: "text-emerald-500/10",
    roleColor: "text-emerald-600"
  },
  {
    id: 3,
    name: "Anita Verma",
    role: "Orthopedics Patient",
    content: "My knee replacement surgery went so smoothly. The HD video consults for follow-ups mean I don't have to travel in pain.",
    rating: 5,
    avatarColor: "bg-sky-500 text-white shadow-sky-500/30",
    shadowColor: "shadow-sky-200/40 hover:shadow-sky-300/50 hover:border-sky-200",
    innerGlow: "shadow-[inset_0_0_30px_rgba(14,165,233,0.1)]",
    gradientHover: "from-sky-50/60 via-transparent to-sky-100/40",
    starColor: "fill-sky-400 text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.4)]",
    quoteColor: "text-sky-500/10",
    roleColor: "text-sky-600"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Neurology Patient",
    content: "State-of-the-art facilities and a highly compassionate staff. My recovery post-surgery was monitored closely using their app.",
    rating: 5,
    avatarColor: "bg-indigo-500 text-white shadow-indigo-500/30",
    shadowColor: "shadow-indigo-200/40 hover:shadow-indigo-300/50 hover:border-indigo-200",
    innerGlow: "shadow-[inset_0_0_30px_rgba(99,102,241,0.1)]",
    gradientHover: "from-indigo-50/60 via-transparent to-indigo-100/40",
    starColor: "fill-indigo-400 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]",
    quoteColor: "text-indigo-500/10",
    roleColor: "text-indigo-600"
  },
  {
    id: 5,
    name: "Meera Patel",
    role: "Pediatrics Parent",
    content: "Finding the right care for my child was stressful, but CareConnect made it seamless. The pediatric ward is wonderfully designed.",
    rating: 5,
    avatarColor: "bg-purple-500 text-white shadow-purple-500/30",
    shadowColor: "shadow-purple-200/40 hover:shadow-purple-300/50 hover:border-purple-200",
    innerGlow: "shadow-[inset_0_0_30px_rgba(168,85,247,0.1)]",
    gradientHover: "from-purple-50/60 via-transparent to-purple-100/40",
    starColor: "fill-purple-400 text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]",
    quoteColor: "text-purple-500/10",
    roleColor: "text-purple-600"
  },
  {
    id: 6,
    name: "Arjun Reddy",
    role: "General Surgery",
    content: "From admission to discharge, everything was digitized and paperless. It’s exactly how modern healthcare should be delivered.",
    rating: 5,
    avatarColor: "bg-rose-500 text-white shadow-rose-500/30",
    shadowColor: "shadow-rose-200/40 hover:shadow-rose-300/50 hover:border-rose-200",
    innerGlow: "shadow-[inset_0_0_30px_rgba(244,63,94,0.1)]",
    gradientHover: "from-rose-50/60 via-transparent to-rose-100/40",
    starColor: "fill-rose-400 text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.4)]",
    quoteColor: "text-rose-500/10",
    roleColor: "text-rose-600"
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) containerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (containerRef.current) containerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="py-32 relative overflow-hidden bg-slate-50 text-slate-900 border-y border-slate-100">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Quote className="h-12 w-12 text-slate-300 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">What Our <span className="text-slate-500">Patients Say</span></h2>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg">Real stories from real patients who experienced our world-class healthcare.</p>
        </div>
      </div>

      <div className="relative w-full z-10 group/slider">
        {/* Navigation Buttons (Absolute to the slider) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button onClick={scrollLeft} className="p-3 bg-white/90 hover:bg-white backdrop-blur border border-slate-200 rounded-full transition-all hover:scale-110 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group">
            <ChevronLeft className="h-6 w-6 text-slate-400 group-hover:text-teal-600" />
          </button>
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button onClick={scrollRight} className="p-3 bg-white/90 hover:bg-white backdrop-blur border border-slate-200 rounded-full transition-all hover:scale-110 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group">
            <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-teal-600" />
          </button>
        </div>

        <div 
          ref={containerRef}
          className="flex overflow-x-auto gap-8 px-6 sm:px-24 pb-20 pt-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div 
              key={`${testimonial.id}-${idx}`}
              className="snap-center shrink-0 w-[300px] lg:w-[350px] group cursor-pointer"
            >
              <div className={`bg-white/80 backdrop-blur-3xl border border-white p-8 rounded-3xl text-left shadow-xl h-full flex flex-col justify-between transition-all duration-700 hover:-translate-y-3 relative overflow-hidden group ${testimonial.shadowColor} ${testimonial.innerGlow}`}>
                
                {/* Large Watermark Quote */}
                <Quote className={`absolute top-6 right-6 h-20 w-20 transform rotate-12 pointer-events-none transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110 ${testimonial.quoteColor}`} />

                {/* Luxurious inner glow */}
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(255,255,255,1)] pointer-events-none"></div>
                
                {/* Moving gradient hover background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradientHover} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

                <div className="relative z-10 flex-1">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${testimonial.starColor}`} />
                    ))}
                  </div>
                  
                  <p className="text-base font-semibold leading-relaxed mb-8 text-slate-700">
                    "{testimonial.content}"
                  </p>
                </div>
                
                {/* User Info Horizontal Layout */}
                <div className="flex items-center gap-4 relative z-10 mt-auto pt-6 border-t border-slate-100/50">
                  <div className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-lg font-black shadow-lg border-2 border-white ${testimonial.avatarColor}`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 tracking-tight">{testimonial.name}</h4>
                    <p className={`text-xs uppercase tracking-[0.1em] font-bold mt-0.5 ${testimonial.roleColor}`}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient Edges for scroll indication */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}
