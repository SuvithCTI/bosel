import { resetStoredEvents } from '../../data/eventsData';
import React from 'react';
import {
  Calendar,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  Search
} from 'lucide-react';

export default function AdminEventsPage({
  filteredEvents,
  eventsList = [],
  setEventsList,
  setEditingEvent,
  setShowAddEventModal,
  handleDeleteEvent,
  showToast,
  eventSearch = '',
  setEventSearch
}) {
  const displayEvents = filteredEvents || eventsList || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span>Public Event Page Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage competitions, Olympiads, dates, fees, venues, and live registration links on the B★SEL website.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {setEventSearch && (
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none font-medium focus:ring-1 focus:ring-amber-400"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAddEventModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset events schedule to official default calendar?')) {
                setEventsList(resetStoredEvents());
                showToast?.('Events reset to official default schedule.');
              }
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Event List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
              <tr>
                <th className="py-3 px-4">S.No & Event</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location & Venue</th>
                <th className="py-3 px-3">Event Date</th>
                <th className="py-3 px-3">Reg. Fee</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayEvents.map((event, index) => (
                <tr key={event?.sNo || index} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-400 mr-1.5">#{event?.sNo || `0${index + 1}`}</span>
                    <strong className="text-slate-950 text-xs">{event?.eventName || 'Unnamed Competition'}</strong>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                      {event?.category || 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-900 font-bold">{event?.place || 'Venue'}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{event?.venue || '-'}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {event?.date || '-'}
                  </td>
                  <td className="py-3 px-3 font-black text-emerald-700">
                    {event?.fee || '₹400'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {event?.status || 'Registration Open'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(event)}
                        className="px-2 py-1 text-slate-700 hover:text-white bg-slate-100 hover:bg-[#081d3d] rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                        title="Edit Event Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent?.(event?.sNo, event?.eventName)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayEvents.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-semibold">
                    No competitions or events found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
