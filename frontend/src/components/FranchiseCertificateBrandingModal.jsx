import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
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
import { saveFranchiseBranding, getFranchiseBranding } from '../utils/franchiseStorage';

export default function FranchiseCertificateBrandingModal({
  franchise,
  isOpen,
  onClose,
  onSave = () => {},
  showToast = () => {}
}) {
  const logoInputRef = useRef(null);
  const signInputRef = useRef(null);

  const resolveCurrentBranding = (fc) => {
    if (!fc) return null;
    const b = getFranchiseBranding(fc.id) || 
              getFranchiseBranding(fc.name) || 
              getFranchiseBranding(fc.userId) || 
              getFranchiseBranding(fc.code);
    return {
      schoolName: (b?.schoolName || fc.schoolName || fc.name || 'TENKASI BRANCH').slice(0, 16).toUpperCase(),
      subtitle: (b?.subtitle || fc.subtitle || 'VISION FOUNDATION').slice(0, 22).toUpperCase(),
      motto: (b?.motto || fc.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30).toUpperCase(),
      logo: (b?.logo !== undefined && b?.logo !== null && b?.logo !== '') ? b.logo : (fc.logo || null),
      signature: (b?.signature !== undefined && b?.signature !== null && b?.signature !== '') 
        ? b.signature 
        : (b?.directorSignature || fc.signature || null)
    };
  };

  const initial = resolveCurrentBranding(franchise);

  const [headerName, setHeaderName] = useState(initial?.schoolName || 'TENKASI BRANCH');
  const [headerSubtitle, setHeaderSubtitle] = useState(initial?.subtitle || 'VISION FOUNDATION');
  const [headerMotto, setHeaderMotto] = useState(initial?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE');
  const [headerLogo, setHeaderLogo] = useState(initial?.logo || null);
  const [directorSign, setDirectorSign] = useState(initial?.signature || null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever modal opens or franchise changes
  useEffect(() => {
    if (isOpen && franchise) {
      const b = resolveCurrentBranding(franchise);
      if (b) {
        setHeaderName(b.schoolName);
        setHeaderSubtitle(b.subtitle);
        setHeaderMotto(b.motto);
        setHeaderLogo(b.logo);
        setDirectorSign(b.signature);
      }
      setIsSaved(false);
    }
  }, [isOpen, franchise]);

  if (!isOpen || !franchise) return null;

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

  // Save changes exclusively to this franchise
  const handleSaveAndDone = () => {
    const payload = {
      schoolName: headerName.trim().toUpperCase(),
      subtitle: headerSubtitle.trim().toUpperCase(),
      motto: headerMotto.trim().toUpperCase(),
      logo: headerLogo,
      signature: directorSign
    };

    const targetId = franchise.id || franchise.name || franchise.userId;
    const updated = saveFranchiseBranding(targetId, payload);
    setIsSaved(true);
    showToast(`Saved certificate branding specifically for ${franchise.name}!`);
    onSave(updated || { ...franchise, ...payload });
    setTimeout(() => {
      onClose();
    }, 250);
  };

  // Reset to default
  const handleResetDefaults = () => {
    const resetName = (franchise?.name || 'TENKASI BRANCH').slice(0, 16).toUpperCase();
    setHeaderName(resetName);
    setHeaderSubtitle('VISION FOUNDATION');
    setHeaderMotto('EDUCATION • EMPOWERMENT • EXCELLENCE');
    setHeaderLogo(null);
    setDirectorSign(null);
    setIsSaved(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-5xl w-full p-3.5 sm:p-6 shadow-2xl relative my-auto max-h-[95vh] overflow-y-auto text-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200 mb-3.5 sm:mb-5">
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <h3 className="text-sm sm:text-lg font-black text-slate-950 leading-tight sm:leading-snug">
                  Certificate Customization Form
                </h3>
                <span className="inline-block w-fit px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9.5px] sm:text-[10px] font-bold border border-amber-300 truncate max-w-full">
                  {franchise.name}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                Customized branding, school details, logo, and principal signature stored uniquely for <strong className="text-slate-700">{franchise.name}</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0 mt-0.5 sm:mt-0"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body: Left is Form, Right is Real-time Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: FORM CONTROLS */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-xs">
            
            {/* Line 1: School / Branch Name (Max 12) */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-700">
                Line 1: School / Branch Name <span className="text-amber-700 font-bold">(Max 12)</span>
              </span>
              <input
                type="text"
                value={headerName}
                maxLength={12}
                onChange={(e) => {
                  setHeaderName(e.target.value.slice(0, 12).toUpperCase());
                  setIsSaved(false);
                }}
                placeholder="e.g. TENKASI BRANCH"
                className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition shadow-xs"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Primary title on certificate</span>
                <span className={headerName.length >= 12 ? 'text-amber-700 font-bold' : ''}>
                  {headerName.length}/12
                </span>
              </div>
            </label>

            {/* Line 2: Subtitle / Division (Max 22) */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-700">
                Line 2: Subtitle / Division <span className="text-amber-700 font-bold">(Max 22)</span>
              </span>
              <input
                type="text"
                value={headerSubtitle}
                maxLength={22}
                onChange={(e) => {
                  setHeaderSubtitle(e.target.value.toUpperCase());
                  setIsSaved(false);
                }}
                placeholder="e.g. VISION FOUNDATION"
                className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition shadow-xs"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Trust / Division line</span>
                <span className={headerSubtitle.length >= 22 ? 'text-amber-700 font-bold' : ''}>
                  {headerSubtitle.length}/22
                </span>
              </div>
            </label>

            {/* Line 3: Motto / Tagline (Max 30) */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-700">
                Line 3: Motto / Tagline <span className="text-amber-700 font-bold">(Max 30)</span>
              </span>
              <input
                type="text"
                value={headerMotto}
                maxLength={30}
                onChange={(e) => {
                  setHeaderMotto(e.target.value.toUpperCase());
                  setIsSaved(false);
                }}
                placeholder="e.g. EDUCATION • EMPOWERMENT • EXCELLENCE"
                className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition shadow-xs"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Motto line</span>
                <span className={headerMotto.length >= 30 ? 'text-amber-700 font-bold' : ''}>
                  {headerMotto.length}/30
                </span>
              </div>
            </label>

            {/* Hidden File Inputs */}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <input
              ref={signInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSignatureUpload}
            />

            {/* Upload Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
              
              {/* School Logo */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col gap-2 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  School Logo (top right)
                </span>

                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    {headerLogo ? (
                      <img
                        src={headerLogo}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition cursor-pointer"
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
                        className="text-[10px] text-rose-600 hover:underline text-left cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Principal Signature */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col gap-2 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-sky-600" />
                  Principal Signature
                </span>

                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    {directorSign ? (
                      <img
                        src={directorSign}
                        alt="Signature"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <PenTool className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => signInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px] transition cursor-pointer"
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
                        className="text-[10px] text-rose-600 hover:underline text-left cursor-pointer"
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

          {/* RIGHT: REAL-TIME LIVE PREVIEW FOR THIS FRANCHISE */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase text-slate-800">
                  Live Certificate Preview ({franchise.name})
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Real-time Preview
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              All certificates and marksheets issued under <strong>{franchise.name}</strong> will render with this header, logo, and signature.
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
                centreName={franchise.name}
                centreCode="101"
                centreAddress={franchise.address || `${franchise.city || 'Tenkasi'}, Tamil Nadu`}
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
