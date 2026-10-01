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
    avatarColor: "bg-teal-500 text-white"
  },
  {
    id: 2,
    name: "Rahul Desai",
    role: "Cardiology Patient",
    content: "I had an emergency cardiac arrest and the ambulance dispatch was lightning fast. The robotic surgery team saved my life.",
    rating: 5,
    avatarColor: "bg-emerald-500 text-white"
  },
  {
    id: 3,
    name: "Anita Verma",
    role: "Orthopedics Patient",
    content: "My knee replacement surgery went so smoothly. The HD video consults for follow-ups mean I don't have to travel in pain.",
    rating: 5,
    avatarColor: "bg-sky-500 text-white"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Neurology Patient",
    content: "State-of-the-art facilities and a highly compassionate staff. My recovery post-surgery was monitored closely using their app.",
    rating: 5,
    avatarColor: "bg-indigo-500 text-white"
  },
  {
    id: 5,
    name: "Meera Patel",
    role: "Pediatrics Parent",
    content: "Finding the right care for my child was stressful, but CareConnect made it seamless. The pediatric ward is wonderfully designed.",
    rating: 5,
    avatarColor: "bg-purple-500 text-white"
  },
  {
    id: 6,
    name: "Arjun Reddy",
    role: "General Surgery",
    content: "From admission to discharge, everything was digitized and paperless. It’s exactly how modern healthcare should be delivered.",
    rating: 5,
    avatarColor: "bg-rose-500 text-white"
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
    <section className="py-32 relative overflow-hidden bg-white/30 backdrop-blur-xl text-slate-900 border-y border-white/50">
      
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 -left-32 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Quote className="h-12 w-12 text-teal-500/30 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]" />
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-500">Patients Say</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">Real stories from real patients who experienced our world-class healthcare.</p>
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

        {/* Scroll Container */}
        <div 
          ref={containerRef}
          className="flex overflow-x-auto gap-6 px-6 sm:px-24 pb-16 pt-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="snap-center shrink-0 w-[280px] lg:w-[300px] xl:w-[320px] group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-2xl border border-white p-8 rounded-[2rem] text-center shadow-[0_20px_60px_-15px_rgba(13,148,136,0.15)] h-full flex flex-col justify-between transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_80px_-20px_rgba(13,148,136,0.3)] hover:border-teal-100 relative overflow-hidden group">
                {/* Luxurious inner glow */}
                <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_30px_rgba(255,255,255,1)] pointer-events-none"></div>
                
                {/* Moving gradient hover background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-transparent to-sky-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div>
                  <div className="flex justify-center gap-1 mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-teal-400 text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]" />
                    ))}
                  </div>
                  
                  <p className="text-base font-bold leading-relaxed mb-8 text-slate-700 relative z-10">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-3 relative z-10 mt-auto">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-[0_5px_15px_rgba(0,0,0,0.1)] ${testimonial.avatarColor}`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 tracking-wide">{testimonial.name}</h4>
                    <p className="text-teal-600 text-xs uppercase tracking-[0.1em] font-bold mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient Edges for scroll indication */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-slate-50/80 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}
