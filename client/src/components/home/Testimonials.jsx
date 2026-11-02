'use client';
import React, { useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Maternity & Family Care",
    content: "The care and attention I received for follow-up home consultations was unparalleled. The digital prescription arrived instantly on the app, saving me a trip to the clinic.",
    rating: 5,
    city: "Mumbai",
    tag: "Verified Consultation"
  },
  {
    id: 2,
    name: "Dr. Rahul Desai",
    role: "Cardiology Patient",
    content: "I needed urgent specialist consultation on a Sunday night. Within 12 minutes, I was connected via encrypted video with an outstanding cardiologist who reviewed my ECG seamlessly.",
    rating: 5,
    city: "Pune",
    tag: "Instant Video Call"
  },
  {
    id: 3,
    name: "Anita Verma",
    role: "Orthopedics & Joint Care",
    content: "My post-operative knee recovery was managed smoothly through at-home visits. Having all my X-rays and surgical summaries in one secure health vault makes everything easy.",
    rating: 5,
    city: "Bangalore",
    tag: "Doorstep Doctor Visit"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Chronic Health Management",
    content: "Booking confirmed priority clinic slots without standing in endless reception queues is a game-changer. Doctor On Call has redefined healthcare delivery for our family.",
    rating: 5,
    city: "Delhi NCR",
    tag: "Priority Clinic OPD"
  }
];

export default function Testimonials() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-slate-50/60 relative overflow-hidden border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Patient Experiences
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Trusted by Over{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                100,000+ Families
              </span>
            </h2>
            
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Real stories from patients and families who trust Doctor On Call for their day-to-day healthcare.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm shadow-slate-200/60 hover:shadow-md cursor-pointer active:scale-95"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm shadow-slate-200/60 hover:shadow-md cursor-pointer active:scale-95"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Cards */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((t) => (
            <div 
              key={t.id}
              className="w-[84vw] max-w-[340px] sm:w-[380px] sm:max-w-none shrink-0 snap-start h-full"
            >
              <div className="h-full flex flex-col justify-between p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/70 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
                
                <div>
                  {/* Rating Stars & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                      {t.tag}
                    </span>
                  </div>

                  {/* Quote Text */}
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium mb-6">
                    "{t.content}"
                  </p>
                </div>

                {/* Patient Profile */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">{t.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{t.role} • {t.city}</p>
                    </div>
                  </div>

                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
