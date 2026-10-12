'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Search, MapPin, Star, Clock, Filter, IndianRupee, ShieldCheck } from 'lucide-react';

const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', experience: '15 Years', location: 'Mumbai, MH', fee: 1500, rating: 4.9, reviews: 124, availableToday: true, avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff' },
  { id: 2, name: 'Dr. Amit Patel', specialty: 'Orthopedics', experience: '10 Years', location: 'Pune, MH', fee: 1200, rating: 4.8, reviews: 98, availableToday: true, avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10B981&color=fff' },
  { id: 3, name: 'Dr. Sneha Desai', specialty: 'Pediatrics', experience: '8 Years', location: 'Mumbai, MH', fee: 1000, rating: 4.7, reviews: 156, availableToday: false, avatar: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=F43F5E&color=fff' },
  { id: 4, name: 'Dr. Vikram Singh', specialty: 'Neurology', experience: '20 Years', location: 'Delhi, DL', fee: 2500, rating: 5.0, reviews: 312, availableToday: true, avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=8B5CF6&color=fff' },
  { id: 5, name: 'Dr. Anjali Mehta', specialty: 'Cardiology', experience: '12 Years', location: 'Bangalore, KA', fee: 1800, rating: 4.9, reviews: 201, availableToday: true, avatar: 'https://ui-avatars.com/api/?name=Anjali+Mehta&background=0D8ABC&color=fff' },
  { id: 6, name: 'Dr. Rohan Kumar', specialty: 'Orthopedics', experience: '14 Years', location: 'Mumbai, MH', fee: 1400, rating: 4.6, reviews: 87, availableToday: false, avatar: 'https://ui-avatars.com/api/?name=Rohan+Kumar&background=10B981&color=fff' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const querySpecialty = searchParams?.get('specialty') || '';
  const queryLocation = searchParams?.get('location') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(querySpecialty);
  const [locationFilter, setLocationFilter] = useState(queryLocation);

  const specialties = ['All', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Gynecology'];
  const locations = ['All', 'Mumbai, MH', 'Pune, MH', 'Delhi, DL', 'Bangalore, KA'];

  const filteredDoctors = mockDoctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || specialtyFilter === '' || doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
    const matchesLocation = locationFilter === 'All' || locationFilter === '' || doc.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Header */}
      <section className="bg-slate-900 text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Find & Book Top Doctors</h1>
          
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-full flex flex-col md:flex-row items-center gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search doctors by name..." 
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-slate-200">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <select 
                className="w-full bg-transparent border-none outline-none text-slate-800 font-medium cursor-pointer"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="All">All Locations</option>
                <option value="Mumbai, MH">Mumbai, MH</option>
                <option value="Pune, MH">Pune, MH</option>
                <option value="Delhi, DL">Delhi, DL</option>
                <option value="Bangalore, KA">Bangalore, KA</option>
              </select>
            </div>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-bold w-full md:w-auto transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Filter className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-lg text-slate-800">Filters</h3>
            </div>
            
            <div className="mb-8">
              <h4 className="font-semibold text-slate-700 mb-4">Specialty</h4>
              <div className="space-y-3">
                {specialties.map(spec => (
                  <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${specialtyFilter === spec ? 'bg-teal-500 border-teal-500' : 'border-slate-300 group-hover:border-teal-500'}`}>
                      {specialtyFilter === spec && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                    </div>
                    <span className="text-slate-600 font-medium group-hover:text-slate-900">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-4">Availability</h4>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-teal-500 focus:ring-teal-500 cursor-pointer" />
                <span className="text-slate-600 font-medium group-hover:text-slate-900">Available Today</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Doctor List */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
            </h2>
            <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 font-medium text-slate-600 outline-none cursor-pointer">
              <option>Relevance</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="space-y-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6">
                
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative rounded-2xl overflow-hidden bg-slate-100">
                  <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded px-2 py-0.5 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {doctor.rating}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{doctor.name}</h3>
                        <ShieldCheck className="h-5 w-5 text-teal-500" />
                      </div>
                      <p className="text-teal-600 font-bold text-sm tracking-wide uppercase mb-3">{doctor.specialty}</p>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm font-medium text-slate-500 mb-4">
                        <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {doctor.experience} Experience</div>
                        <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {doctor.location}</div>
                        <div className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" /> {doctor.fee} / Consultation</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      {doctor.availableToday ? (
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border border-emerald-100">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Available Today
                        </div>
                      ) : (
                        <div className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200">
                          Next Available Tmrw
                        </div>
                      )}
                      
                      <Link href={`/doctors/${doctor.id}`} className="bg-slate-900 hover:bg-slate-800 text-white w-full md:w-auto text-center px-6 py-3 rounded-xl font-bold transition-colors">
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}

            {filteredDoctors.length === 0 && (
              <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Doctors Found</h3>
                <p className="text-slate-500 max-w-md mx-auto">We couldn't find any doctors matching your search criteria. Try adjusting your filters or searching for something else.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSpecialtyFilter('All'); setLocationFilter('All'); }}
                  className="mt-6 text-teal-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
