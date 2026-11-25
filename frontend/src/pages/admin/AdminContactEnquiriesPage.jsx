import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  X,
  Filter,
  Eye,
  Send,
  Sparkles,
  User,
  Tag,
  Share2,
  ChevronDown
} from 'lucide-react';
import {
  updateContactEnquiryStatus,
  deleteContactEnquiry
} from '../../data/contactEnquiriesData';

export default function AdminContactEnquiriesPage({
  contactEnquiries = [],
  setContactEnquiries,
  showToast,
  currentAdminRole
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyNotesInput, setReplyNotesInput] = useState('');

  // Lock background scroll when modal is open
  useEffect(() => {
    if (selectedEnquiry) {
      setReplyNotesInput(selectedEnquiry.replyNotes || '');
      const originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedEnquiry(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedEnquiry]);

  // Unique subjects for filter
  const availableSubjects = useMemo(() => {
    const set = new Set();
    contactEnquiries.forEach((item) => {
      if (item.subject) set.add(item.subject);
    });
    return Array.from(set);
  }, [contactEnquiries]);

  // Filtered inquiries
  const filteredEnquiries = useMemo(() => {
    return contactEnquiries.filter((item) => {
      // Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }
      // Subject filter
      if (subjectFilter !== 'All' && item.subject !== subjectFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name?.toLowerCase().includes(q);
        const matchEmail = item.email?.toLowerCase().includes(q);
        const matchPhone = item.phone?.includes(q);
        const matchRefId = item.refId?.toLowerCase().includes(q);
        const matchSubject = item.subject?.toLowerCase().includes(q);
        const matchMsg = item.message?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchRefId && !matchSubject && !matchMsg) {
          return false;
        }
      }
      return true;
    });
  }, [contactEnquiries, statusFilter, subjectFilter, searchQuery]);

  // Summary counts
  const stats = useMemo(() => {
    const total = contactEnquiries.length;
    const newCount = contactEnquiries.filter((e) => e.status === 'New').length;
    const inReviewCount = contactEnquiries.filter((e) => e.status === 'In Review').length;
    const repliedCount = contactEnquiries.filter((e) => e.status === 'Replied').length;
    const resolvedCount = contactEnquiries.filter((e) => e.status === 'Resolved').length;
    return { total, newCount, inReviewCount, repliedCount, resolvedCount };
  }, [contactEnquiries]);

  // Status update handler
  const handleStatusChange = (refId, newStatus) => {
    const updated = updateContactEnquiryStatus(refId, newStatus);
    if (setContactEnquiries) setContactEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.refId === refId) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
    if (showToast) showToast(`Enquiry ${refId} status marked as: ${newStatus}`);
  };

  // Reply notes save handler
  const handleSaveNotes = (refId) => {
    const updated = updateContactEnquiryStatus(refId, selectedEnquiry?.status || 'In Review', replyNotesInput);
    if (setContactEnquiries) setContactEnquiries(updated);
    if (selectedEnquiry) {
      setSelectedEnquiry((prev) => ({ ...prev, replyNotes: replyNotesInput }));
    }
    if (showToast) showToast('Reply notes saved successfully!');
  };

  // Delete handler
  const handleDelete = (refId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete inquiry ${refId}?`)) {
      const updated = deleteContactEnquiry(refId);
      if (setContactEnquiries) setContactEnquiries(updated);
      if (selectedEnquiry && selectedEnquiry.refId === refId) {
        setSelectedEnquiry(null);
      }
      if (showToast) showToast(`Enquiry ${refId} deleted.`);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              Live Contact Form Feed
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-slate-950 font-heading flex items-center gap-2 mt-1">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Public Contact Us Enquiries</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time messages submitted by visitors, parents, and school administrators from the Contact page.
          </p>
        </div>

        {/* Quick KPI badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total</span>
            <span className="text-sm font-black text-slate-900">{stats.total}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">New</span>
            <span className="text-sm font-black text-amber-800">{stats.newCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-center">
            <span className="text-[10px] font-bold text-sky-700 uppercase block">In Review</span>
            <span className="text-sm font-black text-sky-800">{stats.inReviewCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Resolved</span>
            <span className="text-sm font-black text-emerald-800">{stats.resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, subject, or message keyword..."
            className="w-full text-xs font-semibold pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:items-center sm:gap-2 sm:w-auto">
          <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 min-w-0 ${availableSubjects.length === 0 ? 'col-span-2' : 'col-span-1'}`}>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-600 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-2 sm:px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold outline-none cursor-pointer truncate"
            >
              <option value="All">All Statuses ({contactEnquiries.length})</option>
              <option value="New">New ({stats.newCount})</option>
              <option value="In Review">In Review ({stats.inReviewCount})</option>
              <option value="Replied">Replied ({stats.repliedCount})</option>
              <option value="Resolved">Resolved ({stats.resolvedCount})</option>
            </select>
          </div>

          {availableSubjects.length > 0 && (
            <div className="col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 min-w-0">
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-600 shrink-0">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Subject:</span>
              </div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full sm:w-auto px-2 sm:px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold outline-none cursor-pointer max-w-full sm:max-w-[180px] truncate"
              >
                <option value="All">All Subjects</option>
                {availableSubjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Enquiries Grid */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-slate-800">No contact enquiries found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'All' || subjectFilter !== 'All'
              ? 'Try adjusting your search query or filters above.'
              : 'Submissions from the public Contact Us page will automatically appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
          {filteredEnquiries.map((item) => {
            const cleanPhone = String(item.phone || '').replace(/\D/g, '');
            const whatsappLink = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${item.name}, regarding your B★SEL enquiry (${item.refId}): `)}` : null;

            return (
              <div
                key={item.refId}
                onClick={() => setSelectedEnquiry(item)}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer group select-none relative"
              >
                <div className="space-y-1.5 sm:space-y-2.5">
                  {/* Top Bar: Ref ID & Status Dropdown */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-0">
                    <span className="font-mono text-[8px] sm:text-[9.5px] font-black text-slate-700 bg-slate-100 border border-slate-200 px-1 sm:px-1.5 py-0.5 rounded truncate max-w-[105px] sm:max-w-none">
                      {item.refId}
                    </span>

                    <div className="relative inline-flex items-center shrink-0">
                      <div
                        className={`flex items-center gap-1 font-black uppercase rounded sm:rounded-md px-1.5 py-0.5 border leading-tight shadow-2xs pointer-events-none text-[8px] sm:text-[9.5px] ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'Replied'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : item.status === 'In Review'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <span>
                          {item.status === 'In Review' ? 'Review' : item.status}
                        </span>
                        <ChevronDown className="w-2.5 h-2.5 opacity-70 shrink-0" />
                      </div>

                      <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.refId, e.target.value);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Change status"
                      >
                        <option value="New">New</option>
                        <option value="In Review">Review</option>
                        <option value="Replied">Replied</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Sender Name & Subject */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug line-clamp-2" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="inline-block mt-0.5 text-[8.5px] sm:text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 sm:px-2 py-0.5 rounded leading-tight line-clamp-2 max-w-full">
                      {item.subject}
                    </div>
                  </div>

                  {/* Message Snippet */}
                  <p className="text-[10.5px] sm:text-xs text-slate-600 line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-relaxed bg-slate-50/70 p-1.5 sm:p-2 rounded-lg border border-slate-100">
                    "{item.message}"
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-0.5 sm:space-y-1 text-[9.5px] sm:text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                    {item.email && (
                      <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </div>
                    )}
                    {item.phone && (
                      <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{item.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Bar: Timestamp & Action Buttons */}
                <div className="mt-2 pt-1.5 sm:mt-3 sm:pt-2.5 border-t border-slate-100 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1 text-[8.5px] sm:text-[10px] text-slate-500 font-medium truncate">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.date} {item.time ? `• ${item.time}` : ''}</span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 sm:p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="Chat on WhatsApp"
                      >
                        <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </a>
                    )}
                    {item.email && (
                      <a
                        href={`mailto:${item.email}?subject=${encodeURIComponent(`Regarding your B★SEL Enquiry (${item.refId})`)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 sm:p-1.5 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition"
                        title="Send Email"
                      >
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.refId, e)}
                      className="p-1 sm:p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View & Inspect Detail Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-[200] overscroll-contain bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto select-none"
          onClick={() => setSelectedEnquiry(null)}
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
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed Top) */}
            <div className="bg-gradient-to-r from-[#0c234b] to-[#163e7c] text-white p-3.5 sm:p-5 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-amber-300">
                    {selectedEnquiry.refId}
                  </span>
                  <span className="text-[10px] font-bold text-blue-200">
                    {selectedEnquiry.date} {selectedEnquiry.time ? `• ${selectedEnquiry.time}` : ''}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-snug truncate">
                  {selectedEnquiry.name}
                </h3>
                <p className="text-xs text-sky-200 truncate mt-0.5">
                  Subject: <span className="text-white font-bold">{selectedEnquiry.subject}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable Middle) */}
            <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 text-xs overflow-y-auto flex-1 min-h-0">
              {/* Status Selector */}
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700 text-xs">Enquiry Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.refId, e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold outline-none cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Replied">Replied</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 bg-slate-50 p-2.5 sm:p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone / Mobile</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-black text-slate-900">{selectedEnquiry.phone || 'Not provided'}</span>
                    {selectedEnquiry.phone && (
                      <a
                        href={`tel:${selectedEnquiry.phone.replace(/\D/g, '')}`}
                        className="text-indigo-600 hover:underline font-bold text-[11px]"
                      >
                        (Call)
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <div className="flex items-center gap-1.5 mt-0.5 truncate">
                    <span className="font-semibold text-slate-900 truncate">{selectedEnquiry.email || 'Not provided'}</span>
                    {selectedEnquiry.email && (
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="text-indigo-600 hover:underline font-bold text-[11px] shrink-0"
                      >
                        (Email)
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Message */}
              <div>
                <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block mb-1">
                  Message Content:
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-wrap max-h-44 overflow-y-auto">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Administrative Reply Notes */}
              <div>
                <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block mb-1">
                  Internal Administrative Notes / Resolution History:
                </label>
                <textarea
                  value={replyNotesInput}
                  onChange={(e) => setReplyNotesInput(e.target.value)}
                  placeholder="Record action taken, staff assigned, or resolution notes here..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => handleSaveNotes(selectedEnquiry.refId)}
                    className="px-3 py-1 bg-[#0c234b] hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer (Fixed Bottom) */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(selectedEnquiry.refId)}
                className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Enquiry</span>
                <span className="sm:hidden">Delete</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, thank you for contacting the Board of Skills & Educational Learning (B★SEL) regarding "${selectedEnquiry.subject}". `)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 text-xs shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg sm:rounded-xl font-bold transition cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
