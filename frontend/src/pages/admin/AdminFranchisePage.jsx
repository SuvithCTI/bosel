import { deleteFranchiseLead, getFranchiseDisplayId } from '../../data/franchiseData';
import React from 'react';
import {
  Building,
  Check,
  Trash2
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
  return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <span>Franchise Partner Enquiries & Applications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage incoming franchise leads submitted from the Franchise page, schedule center inspections, and approve new authorized branches.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                <select
                  value={franchiseStatusFilter}
                  onChange={(e) => setFranchiseStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Leads ({franchiseList.length})</option>
                  <option value="New Franchise Lead">New Franchise Lead</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Site Inspection Scheduled">Site Inspection Scheduled</option>
                  <option value="Approved Franchise Branch">Approved Franchise Branch</option>
                </select>
              </div>
            </div>

            {/* Franchise Leads Cards / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFranchiseLeads.map((lead) => (
                <div key={lead.refId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {getFranchiseDisplayId(lead)}
                          </span>
                          <span className="text-[10px] text-slate-400">{lead.date}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-950 mt-1">{lead.name}</h3>
                      </div>

                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateFranchiseStatus(lead.refId, e.target.value, lead.notes)}
                        className={`text-[10px] font-black uppercase rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                          lead.status === 'Approved Franchise Branch' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : lead.status === 'Site Inspection Scheduled'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
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

                    {/* Contact & Location */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                        <div className="font-bold text-slate-800">{lead.phone}</div>
                        <div className="text-slate-500 truncate">{lead.email}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposed Center</span>
                        <div className="font-bold text-slate-800">{lead.city}, {lead.district}</div>
                        <div className="text-slate-500">{lead.state || 'Tamil Nadu'}</div>
                      </div>
                    </div>

                    {/* Background & Space */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <div>
                        <strong className="text-slate-700">Profession:</strong> {lead.profession || 'Educator / Entrepreneur'}
                      </div>
                      <div>
                        <strong className="text-slate-700">Space:</strong> {lead.spaceAvailable || '1,200 sq ft'} &nbsp;|&nbsp; 
                        <strong className="text-slate-700">Budget:</strong> {lead.investmentBudget || '₹3 - ₹5 Lakhs'}
                      </div>
                      {lead.notes && (
                        <div className="text-indigo-900 bg-indigo-50/70 p-1.5 rounded text-[10px] italic border border-indigo-100">
                          Note: {lead.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">
                      Timeline: <strong className="text-slate-700">{lead.launchTimeline || 'Immediate'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {lead.status !== 'Approved Franchise Branch' && (
                        <button
                          type="button"
                          onClick={() => handleApproveFranchiseToBranch(lead)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Branch</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete enquiry ${getFranchiseDisplayId(lead)}?`)) {
                            setFranchiseList(deleteFranchiseLead(lead.refId));
                            showToast(`Enquiry ${getFranchiseDisplayId(lead)} removed.`);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  );
}
