import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react';
import { getStoredEvents } from '../data/eventsData';

export default function EventsPage({ onRegisterEvent }) {
  const [eventsList, setEventsList] = useState(() => getStoredEvents());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const handleUpdate = () => setEventsList(getStoredEvents());
    window.addEventListener('bsel_events_updated', handleUpdate);
    return () => window.removeEventListener('bsel_events_updated', handleUpdate);
  }, []);

  const categories = ['All', 'Abacus', 'Drawing & Art', 'Handwriting', 'Language Speaking', 'Athletics', 'Colour Management'];

  const filteredEvents = eventsList.filter((evt) => {
    const matchesSearch = 
      evt.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 md:py-12">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 space-y-6 sm:space-y-8">
        
        {/* Page Banner Header */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight">
              State & National Competitions
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
              Explore scheduled Olympiads, fine arts talent hunts, speed math championships, and skill grade assessments organized by the Board of Skills and Educational Learning.
            </p>
          </div>
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event title, venue, or discipline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter Pills (Scrollable with nice spacing) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
            <span className="text-xs font-black text-black uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-sky-700" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-black whitespace-nowrap transition cursor-pointer active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-[#0F2B5C] text-white shadow-sm ring-2 ring-sky-300/40'
                    : 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-900 font-bold px-1">
          <span>Found <b>{filteredEvents.length}</b> events matching your selection</span>
          <span className="text-emerald-900 font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> All registrations open for 2026-2027
          </span>
        </div>

        {/* =========================================================================
            1. MOBILE CARD VIEW (< 768px): HIGHLY USABLE ON PHONES
           ========================================================================= */}
        <div className="block md:hidden space-y-3.5">
          {filteredEvents.map((evt) => (
            <div 
              key={evt.sNo}
              className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-[#0F2B5C] text-white">
                  Event #{evt.sNo}
                </span>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                  {evt.category}
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-950 text-base leading-snug">
                  {evt.eventName}
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed font-semibold">
                  {evt.description}
                </p>
              </div>

              {/* Event Schedule Info Pills */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 block">Date</span>
                    <strong className="text-slate-950 font-bold truncate block">{evt.date}</strong>
                  </div>
                </div>

                <div className="bg-rose-50/70 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-rose-600 block">Last Date</span>
                    <strong className="text-rose-950 font-bold truncate block">{evt.lastDate}</strong>
                  </div>
                </div>
              </div>

              {/* Venue & Fee Row */}
              <div className="flex items-center justify-between text-xs text-slate-800 pt-1 font-semibold">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{evt.place}</span>
                </div>
                <div className="text-right">
                  <span>Entry Fee: </span>
                  <strong className="text-emerald-800 text-sm font-black">{evt.fee}</strong>
                </div>
              </div>

              {/* Mobile Register Button (Full Width, Finger-Friendly) */}
              <button
                type="button"
                onClick={() => onRegisterEvent(evt)}
                className="w-full py-3 bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <span>Register & Download Hall Slip</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-600 border border-slate-200">
              No events found matching "{searchTerm}". Try selecting another category above.
            </div>
          )}
        </div>

        {/* =========================================================================
            2. DESKTOP TABLE VIEW (>= 768px)
           ========================================================================= */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F2B5C] text-white text-xs md:text-sm font-black uppercase tracking-wider">
                  <th className="py-4 px-4 md:px-6 w-16 text-center border-r border-sky-800/50">S.NO</th>
                  <th className="py-4 px-4 md:px-6">NAME OF THE POST AND EVENTS</th>
                  <th className="py-4 px-4 md:px-6 w-32 text-center border-l border-sky-800/50">EVENT DATE</th>
                  <th className="py-4 px-4 md:px-6 w-28 text-center border-l border-sky-800/50">LAST DATE</th>
                  <th className="py-4 px-4 md:px-6 w-32 text-center border-l border-sky-800/50">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs md:text-sm">
                {filteredEvents.map((evt) => (
                  <tr key={evt.sNo} className="hover:bg-sky-50/60 transition group">
                    <td className="py-4 px-4 md:px-6 text-center font-black text-black bg-slate-50/60 group-hover:bg-sky-100/40">
                      {evt.sNo}
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      <div className="font-black text-slate-950 flex items-center gap-2 flex-wrap text-sm md:text-base">
                        <span>{evt.eventName}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-950">
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-900 mt-1 line-clamp-1 font-semibold">
                        {evt.description}
                      </p>
                      <div className="text-xs text-slate-900 mt-1 flex items-center gap-3 font-semibold">
                        <span>Eligibility: <strong className="text-slate-950 font-bold">{evt.eligibility}</strong></span>
                        <span>•</span>
                        <span>Fee: <strong className="text-emerald-800 font-bold">{evt.fee}</strong></span>
                        <span>•</span>
                        <span>Place: <strong className="text-slate-950 font-bold">{evt.place}</strong></span>
                      </div>
                    </td>
                    <td className="py-4 px-4 md:px-6 text-center font-bold text-slate-950">
                      <div className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200">
                        <Calendar className="w-3 h-3 text-slate-700" />
                        <span>{evt.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 md:px-6 text-center text-xs text-rose-700 font-bold">
                      {evt.lastDate}
                    </td>
                    <td className="py-4 px-4 md:px-6 text-center">
                      <button
                        type="button"
                        onClick={() => onRegisterEvent(evt)}
                        className="w-full bg-[#0F2B5C] hover:bg-[#18458F] text-white font-bold py-2.5 px-3 rounded-lg text-xs transition shadow-sm hover:shadow flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      >
                        <span>Register</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                      No events found matching "{searchTerm}". Try another search term or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
