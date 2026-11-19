import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Building,
  Image as ImageIcon,
  PenTool,
  CheckCircle2,
  Save,
  Award,
  Sparkles,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import Certificate from '../../components/Certificate';
import {
  readBranchCustomHeader,
  saveBranchCustomHeader,
  readBranchCustomSignature,
  saveBranchCustomSignature,
  saveStudentCustomHeader,
  saveStudentCustomSignature
} from '../../utils/studentDataHelpers';
import {
  saveFranchiseBranding,
  getFranchiseBranding
} from '../../utils/franchiseStorage';

export default function AdminBranchFranchiseProfilePage({
  activeBranch = 'Tenkasi Branch',
  showToast = () => {},
  handleTabSelect
}) {
  const logoInputRef = useRef(null);
  const signInputRef = useRef(null);

  // Initialize from persisted branch custom branding or sensible defaults
  const savedHeader = readBranchCustomHeader(activeBranch);
  const savedSignature = readBranchCustomSignature(activeBranch);
  const franchiseBranding = getFranchiseBranding(activeBranch);

  const initialName = franchiseBranding?.schoolName || savedHeader?.name || (activeBranch ? activeBranch.replace(/Regional Branch|Branch/i, '').trim().toUpperCase() + ' BRANCH' : 'TENKASI BRANCH');
  const initialSubtitle = franchiseBranding?.subtitle || savedHeader?.subtitle || 'VISION FOUNDATION';
  const initialMotto = franchiseBranding?.motto || savedHeader?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE';
  const initialLogo = franchiseBranding?.logo || savedHeader?.logo || null;
  const initialSign = franchiseBranding?.signature || savedSignature || null;

  const [headerName, setHeaderName] = useState(initialName.slice(0, 16));
  const [headerSubtitle, setHeaderSubtitle] = useState(initialSubtitle.slice(0, 22));
  const [headerMotto, setHeaderMotto] = useState(initialMotto.slice(0, 30));
  const [headerLogo, setHeaderLogo] = useState(initialLogo);
  const [directorSign, setDirectorSign] = useState(initialSign);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if activeBranch changes
  useEffect(() => {
    const h = readBranchCustomHeader(activeBranch);
    const s = readBranchCustomSignature(activeBranch);
    const fb = getFranchiseBranding(activeBranch);
    const branchUpper = (activeBranch ? activeBranch.replace(/Regional Branch|Branch/i, '').trim().toUpperCase() + ' BRANCH' : 'TENKASI BRANCH');
    setHeaderName((fb?.schoolName || h?.name || branchUpper).slice(0, 16));
    setHeaderSubtitle((fb?.subtitle || h?.subtitle || 'VISION FOUNDATION').slice(0, 22));
    setHeaderMotto((fb?.motto || h?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30));
    setHeaderLogo(fb?.logo !== undefined ? fb.logo : (h?.logo || null));
    setDirectorSign(fb?.signature !== undefined ? fb.signature : (s || null));
    setIsSaved(false);
  }, [activeBranch]);

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
    const dataUrl = await compressImage(file, 350, 350);
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
    const dataUrl = await compressSignature(file, 350, 160);
    if (dataUrl) {
      setDirectorSign(dataUrl);
      setIsSaved(false);
    }
    e.target.value = '';
  };

  // Save changes to branch-scoped and global storage
  const handleSaveAndDone = () => {
    const headerData = {
      name: headerName.trim().toUpperCase(),
      subtitle: headerSubtitle.trim().toUpperCase(),
      motto: headerMotto.trim().toUpperCase(),
      logo: headerLogo
    };

    saveBranchCustomHeader(activeBranch, headerData);
    saveBranchCustomSignature(activeBranch, directorSign);

    // Save specifically to franchise if activeBranch matches a franchise
    try {
      saveFranchiseBranding(activeBranch, {
        schoolName: headerName.trim().toUpperCase(),
        subtitle: headerSubtitle.trim().toUpperCase(),
        motto: headerMotto.trim().toUpperCase(),
        logo: headerLogo,
        signature: directorSign
      });
    } catch (_) {}

    setIsSaved(true);
    showToast('Franchise certificate branding saved successfully!');
  };

  // Reset to default
  const handleResetDefaults = () => {
    const defaultBranchName = (activeBranch ? activeBranch.replace(/Regional Branch|Branch/i, '').trim().toUpperCase() + ' BRANCH' : 'TENKASI BRANCH').slice(0, 16);
    setHeaderName(defaultBranchName);
    setHeaderSubtitle('VISION FOUNDATION');
    setHeaderMotto('EDUCATION • EMPOWERMENT • EXCELLENCE');
    setHeaderLogo(null);
    setDirectorSign(null);
    setIsSaved(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Branch Franchise Customization
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                Active Branch: {activeBranch}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
              Franchise Profile & Certificate Branding
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {handleTabSelect && (
            <button
              type="button"
              onClick={() => {
                const isFranchise = activeBranch?.toLowerCase().includes('franchise') || 
                                    activeBranch?.toLowerCase().includes('academy') || 
                                    activeBranch?.toLowerCase().includes('centre');
                handleTabSelect(isFranchise ? 'franchise_certificates' : 'branch_certificates');
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Go to Certificate Desk</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left is Form matching exact screenshot, Right is Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FORM CONTAINER - Matching the screenshot style */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#0b172d] text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 sm:p-6">
            
            {/* Form Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Certificate Customization Form
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Edit school details, logo, and principal signature
                  </p>
                </div>
              </div>

              {isSaved && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-4 text-xs">
              
              {/* Line 1: School / Branch Name (Max 16) */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-300">
                  Line 1: School / Branch Name <span className="text-amber-400 font-bold">(Max 16)</span>
                </span>
                <input
                  type="text"
                  value={headerName}
                  maxLength={16}
                  onChange={(e) => {
                    setHeaderName(e.target.value.toUpperCase());
                    setIsSaved(false);
                  }}
                  placeholder="e.g. TENKASI BRANCH"
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white uppercase font-bold tracking-wide focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-0.5">
                  <span>Shown as primary title in certificate header</span>
                  <span className={headerName.length >= 16 ? 'text-amber-400 font-bold' : ''}>
                    {headerName.length}/16
                  </span>
                </div>
              </label>

              {/* Line 2: Subtitle / Division (Max 22) */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-300">
                  Line 2: Subtitle / Division <span className="text-amber-400 font-bold">(Max 22)</span>
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
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white uppercase font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-0.5">
                  <span>Shown as branch trust / organization line</span>
                  <span className={headerSubtitle.length >= 22 ? 'text-amber-400 font-bold' : ''}>
                    {headerSubtitle.length}/22
                  </span>
                </div>
              </label>

              {/* Line 3: Motto / Tagline (Max 30) */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-300">
                  Line 3: Motto / Tagline <span className="text-amber-400 font-bold">(Max 30)</span>
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
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white uppercase font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-0.5">
                  <span>Motto printed under franchise header</span>
                  <span className={headerMotto.length >= 30 ? 'text-amber-400 font-bold' : ''}>
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

              {/* Upload Grid: School Logo (Left) and Principal Signature (Right) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                
                {/* School Logo */}
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    School Logo (top right)
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg p-1 border border-slate-700 shrink-0 flex items-center justify-center overflow-hidden">
                      {headerLogo ? (
                        <img
                          src={headerLogo}
                          alt="School Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-500" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer text-center"
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
                          className="text-[10px] text-red-400 hover:underline text-left cursor-pointer"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Principal Signature */}
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-sky-400" />
                    Principal Signature
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg p-1 border border-slate-700 shrink-0 flex items-center justify-center overflow-hidden">
                      {directorSign ? (
                        <img
                          src={directorSign}
                          alt="Principal Signature"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <PenTool className="w-5 h-5 text-slate-500" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => signInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition cursor-pointer text-center"
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
                          className="text-[10px] text-red-400 hover:underline text-left cursor-pointer"
                        >
                          Remove Signature
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions: Save & Done Button */}
            <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
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
        </div>

        {/* RIGHT SIDE: Live Certificate Preview */}
        <div className="lg:col-span-7 w-full flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-950">
                  Live Certificate Preview
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Real-time Preview
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              As you adjust the franchise details, logo, and signature above, this certificate canvas updates immediately. All student certificates and marksheets issued under <strong>{activeBranch}</strong> will incorporate this branding.
            </p>

            {/* Embedded Live Certificate Preview */}
            <div className="overflow-x-auto flex justify-center py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Certificate
                studentName="Sample Student Name"
                courseName="ABACUS SPEED ARITHMETIC"
                programPrefix="MINDSPARC"
                level="Level 1"
                grade="A+"
                duration="6 Months"
                registrationNo="REG-2026-01"
                certificateNo="BSEL/AB/L1/0001"
                centreName={activeBranch}
                centreCode="101"
                centreAddress="Branch Examination Centre"
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
