import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Logo from './Logo';

export default function FranchiseModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    partnershipType: 'Authorized Learning Center Franchise',
    spaceAvailable: 'Commercial Space (500 - 1000 sq.ft)',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRefId = `BSEL-FRN-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(newRefId);

    // Save lead to local storage so admin can view
    try {
      const raw = localStorage.getItem('bsel_franchise_leads') || '[]';
      const existing = JSON.parse(raw);
      const lead = {
        refId: newRefId,
        ...formData,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'New Franchise Lead'
      };
      localStorage.setItem('bsel_franchise_leads', JSON.stringify([lead, ...existing]));
    } catch {
      // ignore
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      partnershipType: 'Authorized Learning Center Franchise',
      spaceAvailable: 'Commercial Space (500 - 1000 sq.ft)',
      notes: ''
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
              Franchise & Institutional Partnership
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading text-white leading-tight">
            Start a B★SEL Learning Center
          </h3>
          <p className="text-xs text-sky-200 mt-1 leading-relaxed">
            Partner with the Board of Skills and Educational Learning to offer Abacus, Fine Arts, Handwriting, and Olympiad programs in your town or school.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  Enquiry Submitted Successfully
                </span>
                <h4 className="text-xl font-black text-slate-950 mt-1">
                  Thank You, {formData.name || 'Partner'}!
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-sm mx-auto font-medium">
                  Your franchise application has been assigned Reference ID: <strong className="font-mono text-emerald-800">{refId}</strong>. Our Regional Expansion Officer will contact you within 24 working hours.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5 text-left text-slate-800 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-500">Proposed City:</span>
                  <strong className="text-black">{formData.city || 'Tamil Nadu'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Partnership Model:</span>
                  <strong className="text-black">{formData.partnershipType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <strong className="text-black">{formData.phone}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-[#0F2B5C] hover:bg-[#18458F] text-white py-3 rounded-xl text-xs font-black transition cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98400 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Proposed City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coimbatore / Tenkasi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Partnership Model */}
              <div>
                <label className="block text-slate-700 mb-1">Type of Partnership *</label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Authorized Learning Center Franchise">Authorized Learning Center Franchise</option>
                  <option value="School Campus In-House Skill Tie-Up">School Campus In-House Skill Tie-Up</option>
                  <option value="Teacher Training Certification (TTC)">Teacher Training & Certified Instructor Center</option>
                  <option value="Regional Examination / Competition Centre">Regional Examination & Competition Centre</option>
                </select>
              </div>

              {/* Space / Infrastructure */}
              <div>
                <label className="block text-slate-700 mb-1">Available Space / Infrastructure</label>
                <select
                  value={formData.spaceAvailable}
                  onChange={(e) => setFormData({ ...formData, spaceAvailable: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Commercial Space (500 - 1000 sq.ft)">Commercial Space (500 - 1000 sq.ft)</option>
                  <option value="School Campus Facilities Available">School Campus Facilities Available</option>
                  <option value="Home-Based Academy (200 - 500 sq.ft)">Home-Based Academy (200 - 500 sq.ft)</option>
                  <option value="Planning to Lease / Rent New Premises">Planning to Lease / Rent New Premises</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 mb-1">Additional Message or Background</label>
                <textarea
                  rows="2"
                  placeholder="Tell us about your educational background, current academy, or query..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0F2B5C] hover:bg-[#18458F] text-white py-3 rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Submit Franchise Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1 text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ISO 9001:2015 Certified Board
          </span>
          <span>Chennai Central Secretariat</span>
        </div>
      </div>
    </div>
  );
}
