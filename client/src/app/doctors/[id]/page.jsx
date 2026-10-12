'use client';
import React, { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Star, MapPin, Clock, ShieldCheck, IndianRupee, Calendar, CheckCircle, ChevronLeft } from 'lucide-react';

const mockDoctor = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  qualifications: 'MBBS, MD - Cardiology, FACC',
  experience: '15 Years Experience',
  location: 'Mumbai, MH',
  address: 'Apollo Hospitals, Greams Road, Thousand Lights',
  fee: 1500,
  rating: 4.9,
  reviews: 124,
  about: 'Dr. Sarah Johnson is a highly experienced Cardiologist with a passion for providing comprehensive heart care. She specializes in interventional cardiology and has performed over 2000 successful surgeries. She believes in a patient-first approach, ensuring that every individual receives personalized and compassionate care.',
  avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff&size=256'
};

const dates = [
  { id: 1, day: 'Mon', date: '12 Oct', available: true },
  { id: 2, day: 'Tue', date: '13 Oct', available: true },
  { id: 3, day: 'Wed', date: '14 Oct', available: false },
  { id: 4, day: 'Thu', date: '15 Oct', available: true },
  { id: 5, day: 'Fri', date: '16 Oct', available: true },
];

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

export default function DoctorProfilePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id || '1';
  
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-24 mt-10">
        <Link href="/search" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-semibold mb-8 transition-colors">
          <ChevronLeft className="h-5 w-5" /> Back to Search
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: DOCTOR DETAILS */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-lg">
                  <img src={mockDoctor.avatar} alt={mockDoctor.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{mockDoctor.name}</h1>
                    <ShieldCheck className="h-7 w-7 text-teal-500" />
                  </div>
                  
                  <p className="text-xl font-bold text-teal-600 mb-2">{mockDoctor.specialty}</p>
                  <p className="text-slate-500 font-medium mb-4">{mockDoctor.qualifications}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-yellow-200">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> {mockDoctor.rating} ({mockDoctor.reviews} Reviews)
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200">
                      <Clock className="h-4 w-4 text-slate-500" /> {mockDoctor.experience}
                    </div>
                  </div>

                  <div className="space-y-2 text-slate-600 font-medium">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                      <p>{mockDoctor.location} &bull; <span className="text-slate-500 font-normal">{mockDoctor.address}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About Dr. {mockDoctor.name.split(' ')[1]}</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {mockDoctor.about}
              </p>
            </div>
          </div>

          {/* RIGHT: BOOKING WIDGET */}
          <div className="w-full lg:w-[450px] shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-28 overflow-hidden">
              
              <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/30 blur-[40px] rounded-full pointer-events-none"></div>
                <h3 className="text-xl font-bold mb-1 relative z-10">Consultation Fee</h3>
                <div className="flex justify-center items-center gap-1 text-3xl font-extrabold text-teal-400 relative z-10">
                  <IndianRupee className="h-7 w-7" /> {mockDoctor.fee}
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <h4 className="font-bold text-lg text-slate-900">Select Date</h4>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {dates.map((d) => (
                    <button 
                      key={d.id}
                      disabled={!d.available}
                      onClick={() => setSelectedDate(d.id)}
                      className={`shrink-0 snap-center w-20 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                        !d.available ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' :
                        selectedDate === d.id ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/30 transform scale-105' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-500'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase ${selectedDate === d.id ? 'text-teal-100' : 'text-slate-400'}`}>{d.day}</span>
                      <span className={`text-lg font-black ${selectedDate === d.id ? 'text-white' : 'text-slate-900'}`}>{d.date.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-6 mt-6">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <h4 className="font-bold text-lg text-slate-900">Select Time</h4>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {timeSlots.map((time, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        selectedTime === time 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!selectedDate || !selectedTime}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-xl shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  <CheckCircle className="h-6 w-6" /> Proceed to Book
                </button>
                <p className="text-center text-xs text-slate-400 font-medium mt-4">You won't be charged yet.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
