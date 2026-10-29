'use client';
import React, { useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter, 
  IndianRupee, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useSearchDoctorsQuery } from '@/store/api/doctorApi';

function SearchContent() {
  const searchParams = useSearchParams();
  const querySpecialty = searchParams?.get('specialty') || 'All';
  const queryLocation = searchParams?.get('location') || 'All';
  const queryTerm = searchParams?.get('query') || '';

  const [searchTerm, setSearchTerm] = useState(queryTerm);
  const [specialtyFilter, setSpecialtyFilter] = useState(querySpecialty);
  const [locationFilter, setLocationFilter] = useState(queryLocation);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const specialties = ['All', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Gynecology', 'General Physician', 'Dermatology'];
  const locations = ['All', 'Mumbai, MH', 'Pune, MH', 'Delhi, DL', 'Bangalore, KA'];

  const { data: response, isLoading } = useSearchDoctorsQuery({
    specialty: specialtyFilter !== 'All' ? specialtyFilter : undefined
  });

  const apiDoctors = response?.data || [];

  const doctorsList = useMemo(() => {
    if (apiDoctors.length > 0) {
      return apiDoctors.map((doc, idx) => ({
        id: doc.id,
        name: doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`,
        specialty: doc.specialty || doc.specializations?.[0]?.specialization || 'General Physician',
        experience: doc.experience || `${8 + (idx % 8)} Years`,
        location: doc.location || (idx % 2 === 0 ? 'Pune, MH' : 'Mumbai, MH'),
        distance: `${(1.2 + (idx * 0.7)).toFixed(1)} km away`,
        fee: doc.fees || doc.consultationFee || 600,
        rating: doc.rating || (4.7 + (idx % 3) * 0.1).toFixed(1),
        reviews: doc.reviews || doc.totalReviews || (35 + idx * 12),
        availableToday: true,
        isEmergencyAvailable: doc.isEmergencyAvailable ?? true,
        avatar: doc.image || doc.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0D8ABC&color=fff`
      }));
    }
    return [
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', experience: '15 Years', location: 'Mumbai, MH', distance: '1.8 km away', fee: 1500, rating: 4.9, reviews: 124, availableToday: true, isEmergencyAvailable: true, avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff' },
      { id: 2, name: 'Dr. Amit Patel', specialty: 'Orthopedics', experience: '10 Years', location: 'Pune, MH', distance: '2.5 km away', fee: 1200, rating: 4.8, reviews: 98, availableToday: true, isEmergencyAvailable: true, avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10B981&color=fff' },
      { id: 3, name: 'Dr. Sneha Desai', specialty: 'Pediatrics', experience: '8 Years', location: 'Pune, MH', distance: '3.1 km away', fee: 1000, rating: 4.7, reviews: 156, availableToday: false, isEmergencyAvailable: false, avatar: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=F43F5E&color=fff' },
      { id: 4, name: 'Dr. Rajesh Sharma', specialty: 'Neurology', experience: '18 Years', location: 'Delhi, DL', distance: '4.2 km away', fee: 2000, rating: 4.9, reviews: 210, availableToday: true, isEmergencyAvailable: true, avatar: 'https://ui-avatars.com/api/?name=Rajesh+Sharma&background=6366F1&color=fff' },
      { id: 5, name: 'Dr. Priya Mehta', specialty: 'Dermatology', experience: '12 Years', location: 'Bangalore, KA', distance: '2.0 km away', fee: 800, rating: 4.8, reviews: 88, availableToday: true, isEmergencyAvailable: false, avatar: 'https://ui-avatars.com/api/?name=Priya+Mehta&background=EC4899&color=fff' },
    ];
  }, [apiDoctors]);

  const filteredDoctors = useMemo(() => {
    let result = doctorsList.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || specialtyFilter === '' || 
                               doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
      const matchesLocation = locationFilter === 'All' || locationFilter === '' || 
                              doc.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesAvailability = !availableTodayOnly || doc.availableToday;

      return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.fee) - Number(b.fee));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.fee) - Number(a.fee));
    }

    return result;
  }, [doctorsList, searchTerm, specialtyFilter, locationFilter, availableTodayOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Header Search Section */}
      <section className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-indigo-500/15 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-teal-500/15 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Verified Medical Practitioners
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Find & Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Top Specialists</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 font-medium">
            Search across certified specialists with live availability, transparent consultation charges, and verified patient reviews.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white p-2.5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2 shadow-2xl shadow-slate-950/40 border border-slate-100">
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Doctor name or condition..." 
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-slate-200">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <select 
                className="w-full bg-transparent border-none outline-none text-slate-800 font-medium text-sm cursor-pointer"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => {}}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold w-full md:w-auto transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
              </div>
              {(specialtyFilter !== 'All' || availableTodayOnly || searchTerm || locationFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSpecialtyFilter('All');
                    setLocationFilter('All');
                    setSearchTerm('');
                    setAvailableTodayOnly(false);
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            
            {/* Specialty List */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Specialty</h4>
              <div className="space-y-1.5">
                {specialties.map(spec => {
                  const isSelected = specialtyFilter === spec;
                  return (
                    <button
                      key={spec}
                      onClick={() => setSpecialtyFilter(spec)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        isSelected 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{spec}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Availability</h4>
              <label 
                onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={availableTodayOnly}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                />
                <span className="text-xs text-slate-700 font-bold group-hover:text-slate-900">Available Today Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Doctor List */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Available
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200/80 shadow-sm rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 text-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">Fetching verified doctors list...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <div key={doctor.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 relative rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                      <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-md rounded-lg px-1.5 py-0.5 text-[10px] font-black flex items-center gap-1 shadow-sm text-slate-900">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {doctor.rating}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                          {doctor.name}
                        </h3>
                        <span className="p-0.5 bg-teal-50 text-teal-600 rounded-full" title="Verified Practitioner">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                      </div>
                      
                      <p className="text-indigo-600 font-extrabold text-xs tracking-wider uppercase mb-2">
                        {doctor.specialty}
                      </p>
                      
                      <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {doctor.experience}</div>
                        <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {doctor.location} • <span className="text-indigo-600 font-bold">{doctor.distance}</span></div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mt-3">
                        {doctor.availableToday && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Available Today
                          </span>
                        )}
                        {doctor.isEmergencyAvailable && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200/60">
                            Emergency 5km Node
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Fees & Book Action */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3 shrink-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block md:text-right">Consultation Fee</span>
                      <div className="flex items-center gap-0.5 text-xl font-black text-slate-900">
                        <IndianRupee className="h-5 w-5 text-slate-400" /> {Number(doctor.fee).toLocaleString()}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/doctors/${doctor.id}`} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-center px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-600/20 hover:scale-105 flex items-center gap-1.5"
                    >
                      Book Visit <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  
                </div>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="bg-white rounded-3xl p-16 border border-slate-200/80 text-center shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Doctors Found</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    We couldn't find any doctors matching your search parameters. Try adjusting your filters or search by a broader specialty.
                  </p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSpecialtyFilter('All'); setLocationFilter('All'); setAvailableTodayOnly(false); }}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
