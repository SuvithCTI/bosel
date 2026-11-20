import React, { useState, useEffect, useRef } from 'react';
import {
  School,
  Image as ImageIcon,
  PenTool,
  CheckCircle2,
  Save,
  X,
  FileCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import Certificate from './Certificate';
import { saveSchoolBranding, getSchoolBranding } from '../utils/schoolStorage';

export default function SchoolCertificateBrandingModal({
  school,
  isOpen,
  onClose,
  onSave = () => {},
  showToast = () => {}
}) {
  const logoInputRef = useRef(null);
  const signInputRef = useRef(null);

  const resolveCurrentBranding = (sch) => {
    if (!sch) return null;
    const b = getSchoolBranding(sch.id) || 
              getSchoolBranding(sch.name) || 
              getSchoolBranding(sch.userId) || 
              getSchoolBranding(sch.code);
    return {
      schoolName: (b?.schoolName || sch.schoolName || sch.name || 'TENKASI SCHOOL').slice(0, 16).toUpperCase(),
      subtitle: (b?.subtitle || sch.subtitle || 'VISION FOUNDATION').slice(0, 22).toUpperCase(),
      motto: (b?.motto || sch.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30).toUpperCase(),
      logo: (b?.logo !== undefined && b?.logo !== null && b?.logo !== '') ? b.logo : (sch.logo || null),
      signature: (b?.signature !== undefined && b?.signature !== null && b?.signature !== '') 
        ? b.signature 
        : (b?.directorSignature || sch.signature || null)
    };
  };

  const initial = resolveCurrentBranding(school);

  const [headerName, setHeaderName] = useState(initial?.schoolName || 'TENKASI SCHOOL');
  const [headerSubtitle, setHeaderSubtitle] = useState(initial?.subtitle || 'VISION FOUNDATION');
  const [headerMotto, setHeaderMotto] = useState(initial?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE');
  const [headerLogo, setHeaderLogo] = useState(initial?.logo || null);
  const [directorSign, setDirectorSign] = useState(initial?.signature || null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever modal opens or school changes
  useEffect(() => {
    if (isOpen && school) {
      const b = resolveCurrentBranding(school);
      if (b) {
        setHeaderName(b.schoolName);
        setHeaderSubtitle(b.subtitle);
        setHeaderMotto(b.motto);
        setHeaderLogo(b.logo);
        setDirectorSign(b.signature);
      }
      setIsSaved(false);
    }
  }, [isOpen, school]);

  if (!isOpen || !school) return null;

  // Compress image to ensure reliable localStorage storage (< 15KB)
  const compressImage = (file, maxWidth = 160, maxHeight = 160) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const compressSignature = (file, maxWidth = 180, maxHeight = 80) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Handle Logo Upload (Base64 compressed)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressImage(file, 160, 160);
    if (dataUrl) {
      setHeaderLogo(dataUrl);
      setIsSaved(false);
    }
    e.target.value = '';
  };

  // Handle Signature Upload (Base64 compressed)
  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressSignature(file, 180, 80);
    if (dataUrl) {
      setDirectorSign(dataUrl);
      setIsSaved(false);
    }
    e.target.value = '';
  };

  // Save changes exclusively to this school
  const handleSaveAndDone = () => {
    const payload = {
      schoolName: headerName.trim().toUpperCase(),
      subtitle: headerSubtitle.trim().toUpperCase(),
      motto: headerMotto.trim().toUpperCase(),
      logo: headerLogo,
      signature: directorSign
    };

    const targetId = school.id || school.name || school.userId;
    const updated = saveSchoolBranding(targetId, payload);
    setIsSaved(true);
    showToast(`Saved certificate branding specifically for ${school.name}!`);
    const savedRecord = updated || { ...school, ...payload };
    onSave(savedRecord);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  // Reset to default
  const handleResetDefaults = () => {
    const resetName = (school?.name || 'TENKASI SCHOOL').slice(0, 16).toUpperCase();
    setHeaderName(resetName);
    setHeaderSubtitle('VISION FOUNDATION');
    setHeaderMotto('EDUCATION • EMPOWERMENT • EXCELLENCE');
    setHeaderLogo(null);
    setDirectorSign(null);
    setIsSaved(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl relative my-auto max-h-[95vh] overflow-y-auto text-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  Certificate Customization Form
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                  {school.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Customized branding, school details, logo, and principal signature stored uniquely for <strong>{school.name}</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Form + Right Real-time Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: SCHOOL CUSTOMIZATION FORM */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-xs">
            
            {/* Field 1: School Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Line 1: School / Branch Name <span className="text-amber-700 font-bold">(Max 12)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {headerName.length}/12
                </span>
              </div>
              <input
                type="text"
                maxLength={12}
                value={headerName}
                onChange={(e) => {
                  setHeaderName(e.target.value.slice(0, 12).toUpperCase());
                  setIsSaved(false);
                }}
                placeholder="e.g. ST. JOSEPH'S"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition shadow-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Shows as primary title on certificate header.
              </p>
            </div>

            {/* Field 2: Subtitle / Trust / Division */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Line 2: Subtitle / Division <span className="text-amber-700 font-bold">(Max 22)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {headerSubtitle.length}/22
                </span>
              </div>
              <input
                type="text"
                maxLength={22}
                value={headerSubtitle}
                onChange={(e) => {
                  setHeaderSubtitle(e.target.value.slice(0, 22).toUpperCase());
                  setIsSaved(false);
                }}
                placeholder="e.g. TENKASI DISTRICT"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition shadow-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Shows as trust / organization line.
              </p>
            </div>

            {/* Field 3: Motto / Tagline */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Line 3: Motto / Tagline <span className="text-amber-700 font-bold">(Max 30)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {headerMotto.length}/30
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={headerMotto}
                onChange={(e) => {
                  setHeaderMotto(e.target.value.slice(0, 30).toUpperCase());
                  setIsSaved(false);
                }}
                placeholder="e.g. KNOWLEDGE • CHARACTER • SERVICE"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition shadow-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Motto printed under school header.
              </p>
            </div>

            {/* Logo & Signature Upload Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              
              {/* School Logo */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  School Logo (top right)
                </span>

                <div className="flex items-center gap-2">
                  {headerLogo ? (
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={headerLogo}
                        alt="School Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 w-full">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition cursor-pointer text-center"
                    >
                      {headerLogo ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    {headerLogo && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderLogo(null);
                          setIsSaved(false);
                        }}
                        className="text-[10px] text-rose-600 hover:underline transition text-left cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Principal Signature */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-sky-600" />
                  Principal Signature
                </span>

                <div className="flex items-center gap-2">
                  {directorSign ? (
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                      <img
                        src={directorSign}
                        alt="Signature"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                      <PenTool className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 w-full">
                    <input
                      ref={signInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => signInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px] transition cursor-pointer text-center"
                    >
                      {directorSign ? 'Change Signature' : 'Upload Signature'}
                    </button>
                    {directorSign && (
                      <button
                        type="button"
                        onClick={() => {
                          setDirectorSign(null);
                          setIsSaved(false);
                        }}
                        className="text-[10px] text-rose-600 hover:underline transition text-left cursor-pointer"
                      >
                        Remove Signature
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleSaveAndDone}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save & Done
              </button>
            </div>

          </div>

          {/* RIGHT: REAL-TIME LIVE PREVIEW FOR THIS SCHOOL */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase text-slate-800">
                  Live Certificate Preview ({school.name})
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Real-time Preview
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              All certificates and marksheets issued under <strong>{school.name}</strong> will render with this header, logo, and signature.
            </p>

            <div className="overflow-x-auto flex justify-center py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Certificate
                studentName="Sample Candidate"
                courseName="ABACUS SPEED ARITHMETIC"
                programPrefix="MINDSPARC"
                level="Level 1"
                grade="A+"
                duration="6 Months"
                registrationNo="REG-2026-01"
                certificateNo="BSEL/AB/L1/0001"
                centreName={school.name}
                centreCode="101"
                centreAddress={school.address || `${school.city || 'Tenkasi'}, Tamil Nadu`}
                issueDate={new Date().toLocaleDateString('en-GB')}
                certificateType="COMPLETION"
                showControls={false}
                schoolName={headerName}
                schoolSubtitle={headerSubtitle}
                schoolMotto={headerMotto}
                schoolLogo={headerLogo}
                directorSignature={directorSign}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
