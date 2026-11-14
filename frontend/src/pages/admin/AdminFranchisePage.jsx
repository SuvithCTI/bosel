import { deleteFranchiseLead, getFranchiseDisplayId } from '../../data/franchiseData';
import React, { useState, useEffect } from 'react';
import {
  Building,
  Check,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  MessageSquare,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export default function AdminFranchisePage({
  franchiseList,
  setFranchiseList,
  filteredFranchiseLeads,
  franchiseStatusFilter,
  setFranchiseStatusFilter,
  handleUpdateFranchiseStatus,
  handleApproveFranchiseToBranch,
  showToast
}) {
  const [selectedLead, setSelectedLead] = useState(null);

  // Lock background scroll when modal is open so the background page cannot move
  useEffect(() => {
    if (selectedLead) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedLead(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedLead]);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* Top Header & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-950 flex items-center gap-2">
            <Building className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span>Franchise Partner Enquiries & Applications</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Click any enquiry card to inspect full application form details and approve authorized branches.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">Filter:</span>
          <select
            value={franchiseStatusFilter}
            onChange={(e) => setFranchiseStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold outline-none cursor-pointer"
          >
            <option value="All">All Leads ({franchiseList.length})</option>
            <option value="New Franchise Lead">New Lead</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Site Inspection Scheduled">Site Inspection</option>
            <option value="Approved Franchise Branch">Approved Branch</option>
          </select>
        </div>
      </div>

      {/* Small & Sleek Franchise Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFranchiseLeads.map((lead) => (
          <div 
            key={lead.refId} 
            onClick={() => setSelectedLead(lead)}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all p-3.5 flex flex-col justify-between cursor-pointer group select-none"
          >
            <div>
              {/* Header: Name + Status */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition truncate" title={lead.name}>
                  {lead.name}
                </h3>
                <select
                  value={lead.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleUpdateFranchiseStatus(lead.refId, e.target.value, lead.message);
                  }}
                  className={`text-[9.5px] font-black uppercase rounded-md px-2 py-0.5 border outline-none cursor-pointer shrink-0 ${
                    lead.status === 'Approved Franchise Branch' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : lead.status === 'Site Inspection Scheduled'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : lead.status === 'In Discussion'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-sky-50 text-sky-800 border-sky-300'
                  }`}
                >
                  <option value="New Franchise Lead">New Lead</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Site Inspection Scheduled">Site Inspection</option>
                  <option value="Approved Franchise Branch">Approved Branch</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Ref ID, Date, Location */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 mb-2">
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  {getFranchiseDisplayId(lead)}
                </span>
                <span>•</span>
                <span className="text-slate-400">{lead.date}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 flex items-center gap-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  {lead.city}, {lead.district}
                </span>
              </div>

              {/* Compact Contact & Program Summary */}
              <div className="flex items-center justify-between gap-1 text-[11px] text-slate-700 bg-slate-50/90 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <span className="font-bold flex items-center gap-1 truncate text-slate-800">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{lead.phone}</span>
                </span>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 truncate max-w-[150px]">
                  {lead.interestedProgram || 'All Programs'}
                </span>
              </div>
            </div>

            {/* Footer: View Details hint + Action buttons */}
            <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10.5px] font-bold text-indigo-600 group-hover:underline flex items-center gap-0.5">
                View full data &rarr;
              </span>

              <div className="flex items-center gap-1.5">
                {lead.status !== 'Approved Franchise Branch' ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveFranchiseToBranch(lead);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-md text-[10.5px] font-black transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-2.5 h-2.5" />
                    <span>Approved</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete enquiry ${getFranchiseDisplayId(lead)}?`)) {
                      setFranchiseList(deleteFranchiseLead(lead.refId));
                      showToast(`Enquiry ${getFranchiseDisplayId(lead)} removed.`);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                  title="Delete Enquiry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Data Details Modal */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-[200] overscroll-contain bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none"
          onClick={() => setSelectedLead(null)}
          onWheel={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-4 sm:p-5 shrink-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-mono font-bold bg-white/15 text-white px-2 py-0.5 rounded border border-white/20">
                    {getFranchiseDisplayId(selectedLead)}
                  </span>
                  <span className="text-blue-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-300" />
                    Submitted: {selectedLead.date}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 rounded-xl transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {selectedLead.name}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-blue-200 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span>{selectedLead.city}, {selectedLead.district}, {selectedLead.state || 'Tamil Nadu'}</span>
                  </div>
                </div>

                <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border shadow-2xs ${
                  selectedLead.status === 'Approved Franchise Branch'
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                    : selectedLead.status === 'Site Inspection Scheduled'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                    : selectedLead.status === 'In Discussion'
                    ? 'bg-blue-500/20 text-blue-200 border-blue-400/40'
                    : 'bg-white/15 text-white border-white/30'
                }`}>
                  {selectedLead.status}
                </span>
              </div>
            </div>

            {/* Modal Body: 2-Column Clean Layout */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto max-h-[calc(85vh-130px)] text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Column 1: Contact & Location */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-200/70 pb-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Contact Details</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Number</span>
                      <a href={`tel:${selectedLead.phone}`} className="font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{selectedLead.phone}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                      <a href={`mailto:${selectedLead.email}`} className="font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1 mt-0.5 truncate" title={selectedLead.email}>
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedLead.email}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                      <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{selectedLead.city}, {selectedLead.district} ({selectedLead.state || 'Tamil Nadu'})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Partnership Preferences */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-200/70 pb-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Partnership Preferences</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Partnership Type</span>
                      <span className="font-bold text-slate-900 inline-block bg-white px-2 py-0.5 rounded border border-slate-200 mt-0.5">
                        {selectedLead.partnershipType || 'Authorized Learning Center Franchise'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Interested Program</span>
                      <span className="font-bold text-indigo-700 inline-block bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150 mt-0.5">
                        {selectedLead.interestedProgram || 'All Programs (Multi-Skill Centre)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Operates Learning Centre?</span>
                      <span className={`inline-block font-black text-[10px] uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                        selectedLead.operatesCenter === 'Yes'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {selectedLead.operatesCenter === 'Yes' ? 'Yes, currently operates' : 'No centre currently'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Background */}
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-200/70 pb-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Professional Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Profession</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {selectedLead.profession || 'Not specified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                    <span className="font-medium text-slate-700 block mt-0.5">
                      {selectedLead.experience || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicant Message */}
              {(selectedLead.message || selectedLead.notes) && (
                <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-amber-700" />
                    Applicant Message / Remarks
                  </span>
                  <p className="text-slate-800 italic leading-relaxed text-xs pl-3 border-l-2 border-amber-400">
                    "{selectedLead.message || selectedLead.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    handleUpdateFranchiseStatus(selectedLead.refId, e.target.value, selectedLead.message);
                    setSelectedLead({ ...selectedLead, status: e.target.value });
                  }}
                  className={`text-xs font-black uppercase rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer ${
                    selectedLead.status === 'Approved Franchise Branch' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : selectedLead.status === 'Site Inspection Scheduled'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : selectedLead.status === 'In Discussion'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-sky-100 text-sky-800 border-sky-300'
                  }`}
                >
                  <option value="New Franchise Lead">New Franchise Lead</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Site Inspection Scheduled">Site Inspection Scheduled</option>
                  <option value="Approved Franchise Branch">Approved Franchise Branch</option>
                  <option value="Archived">Archived / Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>

                {selectedLead.status !== 'Approved Franchise Branch' ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleApproveFranchiseToBranch(selectedLead);
                      setSelectedLead({ ...selectedLead, status: 'Approved Franchise Branch' });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve as Official Branch</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="w-4 h-4" />
                    <span>Official Authorized Branch</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
