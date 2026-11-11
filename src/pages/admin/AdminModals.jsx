import React, { useState, useRef } from 'react';
import {
  Clock,
  Edit3,
  Check,
  ShieldCheck,
  Printer,
  X,
  Plus,
  ImageIcon,
  Upload,
  Trash2,
  Layers,
  BookOpen,
  Sparkles,
  ListPlus,
  Eye,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import OfficialMarksheetView from '../../components/OfficialMarksheetView';
import CertificateModal from '../../components/CertificateModal';
import StudentAdmissionFormView from '../../components/StudentAdmissionFormView';
import StudentReceiptView from '../../components/StudentReceiptView';
import EventRegisterModal from '../../components/EventRegisterModal';
import StudentQuestionPaperView from '../../components/StudentQuestionPaperView';
import AdmissionModal from '../../components/AdmissionModal';
import MergedStudentPdfModal from '../../components/MergedStudentPdfModal';
import Logo from '../../components/Logo';
import { addStoredPayment } from '../../data/paymentsData';
import { saveStoredSchools } from '../../data/schoolsData';

import BselReceipt from "../../components/admin/BselReceipt";

export default function AdminModals({
  currentAdminRole,
  activeBranch,
  setUsersList,
  coursesList,
  setPaymentsList,
  schoolsList,
  setSchoolsList,
  showAddBatchModal,
  setShowAddBatchModal,
  editingBatch,
  setEditingBatch,
  batchForm,
  setBatchForm,
  showToast,
  showAddStudentModal,
  setShowAddStudentModal,
  editingStudent,
  setEditingStudent,
  showMarksheetModal,
  setShowMarksheetModal,
  selectedMarksheetStudent,
  setSelectedMarksheetStudent,
  viewingMergedPdfStudent,
  setViewingMergedPdfStudent,
  viewingAdmissionStudent,
  setViewingAdmissionStudent,
  viewingReceiptStudent,
  setViewingReceiptStudent,
  viewingEventRegStudent,
  setViewingEventRegStudent,
  viewingQuestionPaperStudent,
  setViewingQuestionPaperStudent,
  previewCertModalData,
  setPreviewCertModalData,
  showAddCourseModal,
  setShowAddCourseModal,
  editingCourse,
  setEditingCourse,
  showAddEventModal,
  setShowAddEventModal,
  editingEvent,
  setEditingEvent,
  showAddPaymentModal,
  setShowAddPaymentModal,
  selectedReceiptForPrint,
  setSelectedReceiptForPrint,
  showAddSchoolModal,
  setShowAddSchoolModal,
  newCourse,
  setNewCourse,
  newEvent,
  setNewEvent,
  newPayment,
  setNewPayment,
  newSchool,
  setNewSchool,
  handleUpdateStudent,
  handleCreateCourse,
  handleUpdateCourse,
  handleCreateEvent,
  handleUpdateEvent,
  handleCreateOfflinePayment,
  handleSaveBatch,
  setActivePage,
  getRegisteredUsers,
  getStoredPayments,
  saveStoredSchools
}) {
  const [courseModalTab, setCourseModalTab] = useState('identity');
  const courseImageInputRef = useRef(null);
  const newCourseImageInputRef = useRef(null);

  const handleCourseImageUpload = (e, isNew = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Course image must be under 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (isNew) {
        setNewCourse(prev => ({ ...prev, image: dataUrl }));
      } else {
        setEditingCourse(prev => ({ ...prev, image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCurriculumLevel = () => {
    if (!editingCourse) return;
    const currentLevels = Array.isArray(editingCourse.curriculumLevels) ? editingCourse.curriculumLevels : [];
    const nextNum = currentLevels.length + 1;
    const newLvl = {
      id: `lvl-${nextNum}-${Date.now()}`,
      title: `Level ${nextNum}: New Level Title`,
      topicsText: ''
    };
    const updatedLevels = [...currentLevels, newLvl];
    setEditingCourse(prev => ({
      ...prev,
      curriculumLevels: updatedLevels,
      levels: `${updatedLevels.length} Structured Levels`
    }));
  };

  const handleUpdateCurriculumLevel = (index, field, value) => {
    if (!editingCourse) return;
    const currentLevels = [...(editingCourse.curriculumLevels || [])];
    if (!currentLevels[index]) return;
    currentLevels[index] = {
      ...currentLevels[index],
      [field]: value
    };
    setEditingCourse(prev => ({
      ...prev,
      curriculumLevels: currentLevels
    }));
  };

  const handleDeleteCurriculumLevel = (index) => {
    if (!editingCourse) return;
    const currentLevels = (editingCourse.curriculumLevels || []).filter((_, idx) => idx !== index);
    setEditingCourse(prev => ({
      ...prev,
      curriculumLevels: currentLevels,
      levels: `${currentLevels.length} Structured Levels`
    }));
  };

  return (
    <>
      {/* Merged Certificate & Marksheet PDF Modal */}
      {viewingMergedPdfStudent && (
        <MergedStudentPdfModal
          data={viewingMergedPdfStudent}
          onClose={() => setViewingMergedPdfStudent(null)}
          showToast={showToast}
        />
      )}

      {/* =========================================================================
          MODAL: OFFICIAL EXAMINATION MARKSHEET (SUPER ADMIN & ALL DESKS)
          ========================================================================= */}
      {(showMarksheetModal || selectedMarksheetStudent) && selectedMarksheetStudent && (
        <OfficialMarksheetView
          student={selectedMarksheetStudent}
          onClose={() => {
            setShowMarksheetModal(false);
            setSelectedMarksheetStudent(null);
          }}
        />
      )}

      {/* =========================================================================
          MODAL: OFFICIAL CERTIFICATE PREVIEW (SUPER ADMIN & ALL DESKS)
          ========================================================================= */}
      {previewCertModalData && (
        <CertificateModal
          isOpen={Boolean(previewCertModalData)}
          initialData={previewCertModalData}
          onClose={() => setPreviewCertModalData(null)}
        />
      )}

      {/* =========================================================================
          MODAL: OFFICIAL STUDENT ADMISSION FORM (SUPER ADMIN & BRANCH HEAD)
          ========================================================================= */}
      {viewingAdmissionStudent && (
        <StudentAdmissionFormView
          student={viewingAdmissionStudent}
          onClose={() => setViewingAdmissionStudent(null)}
        />
      )}

      {/* =========================================================================
          MODAL: OFFICIAL STUDENT FEE PAYMENT RECEIPT
          ========================================================================= */}
      {viewingReceiptStudent && (
        <StudentReceiptView
          student={viewingReceiptStudent}
          onClose={() => setViewingReceiptStudent(null)}
        />
      )}

      {/* =========================================================================
          MODAL: OFFICIAL EVENT REGISTRATION (SAME AS WEBSITE EVENT REGISTRATION)
          ========================================================================= */}
      {viewingEventRegStudent && (
        <EventRegisterModal
          student={viewingEventRegStudent}
          onClose={() => setViewingEventRegStudent(null)}
        />
      )}

      {/* =========================================================================
          MODAL: OFFICIAL EXAMINATION QUESTION PAPER
          ========================================================================= */}
      {viewingQuestionPaperStudent && (
        <StudentQuestionPaperView
          student={viewingQuestionPaperStudent}
          onClose={() => setViewingQuestionPaperStudent(null)}
        />
      )}

      {/* =========================================================================
          MODAL 1: OFFICIAL STUDENT ADMISSION FORM (SAME AS WEBSITE ADMISSION FORM)
          ========================================================================= */}
      <AdmissionModal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          setUsersList(getRegisteredUsers());
          setPaymentsList(getStoredPayments());
        }}
        setActivePage={setActivePage}
        initialBranch={currentAdminRole === 'Branch Head' ? activeBranch : null}
        lockBranch={currentAdminRole === 'Branch Head'}
        onSuccess={(account) => {
          setUsersList(getRegisteredUsers());
          if (account) {
            addStoredPayment({
              payerName: account.studentName || account.name,
              studentId: account.userId,
              branch: account.branch || activeBranch,
              sector: 'Course Tuition',
              program: account.program || account.courseName,
              amount: account.feeAmount || '₹450',
              paymentMode: account.paymentMode || 'UPI / QR Code',
              refNo: account.receiptRefNo || `REC-${Date.now().toString().slice(-5)}`,
              status: 'Verified',
              verifiedBy: currentAdminRole === 'Branch Head' ? `${activeBranch} Head` : 'Super Admin',
              notes: `Admission enrollment fee for ${account.program || account.courseName}`
            });
            setPaymentsList(getStoredPayments());
          }
        }}
      />

      {/* =========================================================================
          MODAL: CREATE / EDIT BRANCH BATCH & CLASS TIMING
          ========================================================================= */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">
                    {editingBatch ? 'Edit Batch Timing & Schedule' : `Create New Batch for ${activeBranch}`}
                  </h3>
                  <p className="text-[11px] text-slate-300">Set classroom schedule, days, and intake capacity</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddBatchModal(false);
                  setEditingBatch(null);
                }} 
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBatch} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch Title / Name *</label>
                <input
                  type="text"
                  required
                  value={batchForm.name}
                  onChange={(e) => setBatchForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Abacus Foundation & Speed (Batch A)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Program *</label>
                  <select
                    value={batchForm.program}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, program: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    {coursesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Schedule Days *</label>
                  <select
                    value={batchForm.days}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, days: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Saturday & Sunday">Saturday & Sunday (Weekend)</option>
                    <option value="Tuesday & Thursday">Tuesday & Thursday (Weekday Evening)</option>
                    <option value="Monday, Wednesday & Friday">Monday, Wednesday & Friday</option>
                    <option value="Daily (Monday to Friday)">Daily (Monday to Friday)</option>
                    <option value="Sundays Only">Sundays Only (Special Batch)</option>
                    <option value="Flexible / Online">Flexible / Hybrid Schedule</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class Start Time *</label>
                  <input
                    type="text"
                    required
                    value={batchForm.startTime}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, startTime: e.target.value }))}
                    placeholder="e.g. 09:30 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class End Time *</label>
                  <input
                    type="text"
                    required
                    value={batchForm.endTime}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, endTime: e.target.value }))}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Classroom / Room / Lab</label>
                  <input
                    type="text"
                    value={batchForm.room}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g. Lab 1 / Room 2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Faculty / Trainer</label>
                  <input
                    type="text"
                    value={batchForm.instructor}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="e.g. Mrs. Thangam Sivaji"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Intake Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={batchForm.maxCapacity}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batch Status</label>
                  <select
                    value={batchForm.status}
                    onChange={(e) => setBatchForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Active">Active (Ongoing)</option>
                    <option value="Enrolling Soon">Enrolling Soon</option>
                    <option value="Full">Full (Closed)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={batchForm.notes}
                  onChange={(e) => setBatchForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional student instructions, prerequisites, or session notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBatchModal(false);
                    setEditingBatch(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition cursor-pointer"
                >
                  {editingBatch ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingCourse && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-2xl lg:max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4.5 shrink-0 border-b border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Edit3 className="w-4.5 h-4.5 text-amber-400" />
                      <span>Edit Course Master — {editingCourse.name}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono text-[10.5px] font-black border border-amber-400/30 uppercase">
                      {editingCourse.code || 'BSEL'}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-300 mt-1">
                    Manage course cover image, levels & syllabus structure, fee, age group, and outcomes
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditingCourse(null)} 
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-1.5 transition cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/10 overflow-x-auto text-xs font-bold scrollbar-none">
                {[
                  { id: 'identity', label: 'Cover & Identity', icon: ImageIcon },
                  { id: 'pricing', label: 'Fee & Age Group', icon: Clock },
                  { id: 'levels', label: `Levels & Syllabus (${editingCourse.curriculumLevels?.length || 0})`, icon: Layers },
                  { id: 'outcomes', label: 'Outcomes & Desc', icon: Sparkles },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = courseModalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCourseModalTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleUpdateCourse} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* TAB 1: COVER IMAGE & IDENTITY */}
              {courseModalTab === 'identity' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Image Uploader & Preview */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        <span>Course Cover Image</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Recommended: 16:9 ratio, max 5 MB</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Image Preview Box */}
                      <div className="relative w-full sm:w-56 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-2xs group">
                        {editingCourse.image ? (
                          <>
                            <img
                              src={editingCourse.image}
                              alt="Course preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => courseImageInputRef.current?.click()}
                                className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-[11px] font-bold shadow-xs cursor-pointer"
                              >
                                Replace
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-3">
                            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                            <span className="text-[11px] text-slate-400 font-medium block">No image set</span>
                          </div>
                        )}
                      </div>

                      {/* Image Actions */}
                      <div className="space-y-2.5 flex-1 min-w-0 w-full">
                        <input
                          ref={courseImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCourseImageUpload(e, false)}
                          className="hidden"
                        />

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => courseImageInputRef.current?.click()}
                            className="px-3.5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition text-xs"
                          >
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Upload Cover Image</span>
                          </button>

                          {editingCourse.image && (
                            <button
                              type="button"
                              onClick={() => setEditingCourse(prev => ({ ...prev, image: '' }))}
                              className="px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="text-[10.5px] font-bold text-slate-500 block mb-1">
                            Or paste external image URL (HTTPS):
                          </label>
                          <input
                            type="url"
                            value={editingCourse.image?.startsWith('data:') ? '' : (editingCourse.image || '')}
                            onChange={(e) => setEditingCourse(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="https://example.com/course-banner.jpg"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-xl outline-none bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Identity Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Course Display Name *</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.name || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Abacus"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-600 font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Official Program Name</label>
                      <input
                        type="text"
                        value={editingCourse.fullName || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. ABACUS SPEED ARITHMETIC"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold uppercase bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Course Code (Registration Prefix)</label>
                      <input
                        type="text"
                        value={editingCourse.code || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="e.g. AB"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Curriculum Category</label>
                      <select
                        value={editingCourse.category || 'Skill Development'}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                      >
                        <option value="Skill Development">Skill Development</option>
                        <option value="Digital & Technology">Digital & Technology</option>
                        <option value="Creative Arts">Creative Arts</option>
                        <option value="Languages">Languages</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Enrollment & Master Status</label>
                      <select
                        value={editingCourse.status || 'Active'}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                      >
                        <option value="Active">Active (Accepting Student Enrollments & Visible)</option>
                        <option value="Upcoming">Upcoming / In Review</option>
                        <option value="Inactive">Inactive / Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & AGE */}
              {courseModalTab === 'pricing' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Course Tuition Fee *</label>
                      <input
                        type="text"
                        value={editingCourse.fee || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, fee: e.target.value }))}
                        placeholder="e.g. ₹450"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold text-emerald-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Eligible Age Group</label>
                      <input
                        type="text"
                        value={editingCourse.ageGroup || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, ageGroup: e.target.value }))}
                        placeholder="e.g. 5 - 14 Years"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Duration per Level</label>
                      <input
                        type="text"
                        value={editingCourse.duration || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g. 3 - 4 Months per Level"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Levels & Term Summary String</label>
                      <input
                        type="text"
                        value={editingCourse.levels || ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, levels: e.target.value }))}
                        placeholder="e.g. Level 1 to 9 (3 - 4 Months per Level)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Short Tagline / Summary (Cards & Banner)</label>
                    <textarea
                      rows="2"
                      value={editingCourse.shortDesc || editingCourse.tagline || ''}
                      onChange={(e) => setEditingCourse(prev => ({ ...prev, shortDesc: e.target.value, tagline: e.target.value }))}
                      placeholder="e.g. Think Fast, Calculate Smart. Comprehensive cognitive training..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Detailed Course Background & Scope</label>
                    <textarea
                      rows="3"
                      value={editingCourse.description || ''}
                      onChange={(e) => setEditingCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Comprehensive course background, methodologies, whole-brain development and scope..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: LEVELS & SYLLABUS */}
              {courseModalTab === 'levels' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-900" />
                      <span className="font-extrabold text-slate-800">
                        {editingCourse.curriculumMode === 'text' ? 'Quick Multi-line Mode' : `Structured Levels (${editingCourse.curriculumLevels?.length || 0})`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingCourse(prev => ({
                          ...prev,
                          curriculumMode: prev.curriculumMode === 'text' ? 'structured' : 'text'
                        }))}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                      >
                        {editingCourse.curriculumMode === 'text' ? 'Switch to Card Editor' : 'Switch to Quick Text'}
                      </button>

                      {editingCourse.curriculumMode !== 'text' && (
                        <button
                          type="button"
                          onClick={handleAddCurriculumLevel}
                          className="px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Level</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {editingCourse.curriculumMode === 'text' ? (
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Syllabus Levels <span className="font-normal text-slate-400">(one level per line)</span>
                      </label>
                      <textarea
                        rows="8"
                        value={editingCourse.curriculumText ?? ''}
                        onChange={(e) => setEditingCourse(prev => ({ ...prev, curriculumText: e.target.value }))}
                        placeholder="Level 1: Bead Fundamentals & Direct Operations&#10;Level 2: Small Friend Concept (+5 and -5 Formulas)&#10;Level 3: Big Friend Concept"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-sans text-xs bg-white"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(editingCourse.curriculumLevels || []).length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl p-4">
                          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-600 font-bold">No levels configured yet.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Click below to start adding curriculum levels for this course.</p>
                          <button
                            type="button"
                            onClick={handleAddCurriculumLevel}
                            className="mt-3 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer text-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Level 1</span>
                          </button>
                        </div>
                      ) : (
                        (editingCourse.curriculumLevels || []).map((lvl, idx) => (
                          <div
                            key={lvl.id || idx}
                            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5 transition hover:border-slate-300"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="px-2 py-0.5 rounded-md bg-blue-900 text-white font-black text-[10px] uppercase shrink-0">
                                  Level {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={lvl.title || ''}
                                  onChange={(e) => handleUpdateCurriculumLevel(idx, 'title', e.target.value)}
                                  placeholder={`e.g. Level ${idx + 1}: Foundational Concepts`}
                                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-bold text-slate-900 bg-white text-xs"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteCurriculumLevel(idx)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                                title="Delete this level"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                Topics & Lessons (one per line)
                              </label>
                              <textarea
                                rows="2"
                                value={lvl.topicsText || ''}
                                onChange={(e) => handleUpdateCurriculumLevel(idx, 'topicsText', e.target.value)}
                                placeholder="Core concepts, practical drills, formulas, exam targets..."
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none text-slate-700 bg-white text-xs font-sans"
                              />
                            </div>
                          </div>
                        ))
                      )}

                      {(editingCourse.curriculumLevels || []).length > 0 && (
                        <button
                          type="button"
                          onClick={handleAddCurriculumLevel}
                          className="w-full py-2.5 border-2 border-dashed border-emerald-300 hover:border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Another Level (Level {(editingCourse.curriculumLevels?.length || 0) + 1})</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: KEY OUTCOMES */}
              {courseModalTab === 'outcomes' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Key Learning Outcomes & Benefits</span>
                      </label>
                      <span className="text-[10.5px] text-slate-400">One bullet point per line</span>
                    </div>

                    <textarea
                      rows="6"
                      value={editingCourse.outcomesText ?? (Array.isArray(editingCourse.outcomes) ? editingCourse.outcomes.join('\n') : '')}
                      onChange={(e) => setEditingCourse(prev => ({ ...prev, outcomesText: e.target.value }))}
                      placeholder="Increases calculation speed by 5x to 10x through mental math&#10;Enhances concentration and photographic recall&#10;Earn official B★SEL course certification"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none font-sans text-xs bg-white"
                    />

                    <p className="mt-2 text-[11px] text-slate-500 bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl">
                      💡 These bullet points appear directly on the course catalog cards, brochures, and course detail view to show prospective students and parents the key takeaways of enrolling.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 shrink-0">
                <div className="text-[11px] text-slate-400">
                  Editing: <span className="font-bold text-slate-700">{editingCourse.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm text-xs"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Save Course Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD NEW COURSE TO MASTER CURRICULUM
          ========================================================================= */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col">
            <div className="bg-[#081d3d] text-white p-4.5 flex items-center justify-between shrink-0 border-b border-white/10">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Add New Course to Master Curriculum</span>
                </h3>
                <p className="text-[11.5px] text-slate-300 mt-0.5">Creates new syllabus with cover image, sets duration, outcomes, and tuition fee</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddCourseModal(false)} 
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-1.5 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Cover Image Upload */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Course Cover Image (Optional)</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative w-full sm:w-40 h-24 rounded-lg border border-slate-300 bg-white overflow-hidden flex items-center justify-center shrink-0">
                    {newCourse.image ? (
                      <img src={newCourse.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      ref={newCourseImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCourseImageUpload(e, true)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => newCourseImageInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#081d3d] text-white rounded-lg font-bold flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload File</span>
                      </button>
                      {newCourse.image && (
                        <button
                          type="button"
                          onClick={() => setNewCourse(prev => ({ ...prev, image: '' }))}
                          className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-bold text-xs cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={newCourse.image?.startsWith('data:') ? '' : (newCourse.image || '')}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-2.5 py-1 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Course Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Vedic Mathematics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Code (2-3 chars)</label>
                  <input
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. VM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Skill Development">Skill Development</option>
                    <option value="Digital & Technology">Digital & Technology</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Tuition Fee</label>
                  <input
                    type="text"
                    value={newCourse.fee}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="e.g. ₹500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold text-emerald-800 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={newCourse.ageGroup}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, ageGroup: e.target.value }))}
                    placeholder="e.g. 6 - 15 Years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Levels & Term</label>
                  <input
                    type="text"
                    value={newCourse.levels}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, levels: e.target.value }))}
                    placeholder="e.g. 4 Progressive Levels"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Tagline & Description</label>
                <textarea
                  rows="2"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value, shortDesc: e.target.value, tagline: e.target.value }))}
                  placeholder="Overview of the course and why students should join..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Syllabus Levels <span className="font-normal text-slate-400">(one level per line)</span>
                </label>
                <textarea
                  rows="3"
                  value={typeof newCourse.curriculum === 'string' ? newCourse.curriculum : (Array.isArray(newCourse.curriculum) ? newCourse.curriculum.join('\n') : '')}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, curriculum: e.target.value }))}
                  placeholder="Level 1: Fundamentals & Introduction&#10;Level 2: Intermediate Techniques&#10;Level 3: Advanced Applications"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-sans text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD NEW EVENT (SUPER ADMIN)
          ========================================================================= */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Publish New Event / Championship</h3>
                <p className="text-[11px] text-slate-300">Syncs immediately to the public Events page and student registration desk</p>
              </div>
              <button onClick={() => setShowAddEventModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Event / Competition Name *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.eventName}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="e.g. 15th National Mental Arithmetic Olympiad"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing & Art">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language Speaking">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour Management">Colour Management</option>
                    <option value="Coding">Python / Coding</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Fee</label>
                  <input
                    type="text"
                    value={newEvent.fee}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. 25 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Date to Register</label>
                  <input
                    type="text"
                    value={newEvent.lastDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, lastDate: e.target.value }))}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={newEvent.place}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, place: e.target.value }))}
                    placeholder="e.g. CHENNAI (TAMIL NADU)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Auditorium / Stadium name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newEvent.eligibility}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, eligibility: e.target.value }))}
                  placeholder="e.g. Age 5 to 14 Years (Level 1 to 8)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black transition"
                >
                  Publish to Events Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3B: EDIT EXISTING EVENT / CHAMPIONSHIP (SUPER ADMIN)
          ========================================================================= */}
      {editingEvent && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Event — #{editingEvent.sNo} {editingEvent.eventName}</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Update competition dates, venue, eligibility, fee, and registration status
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingEvent(null)} 
                className="text-white/80 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateEvent} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Event / Competition Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.eventName || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, eventName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingEvent.category || 'Abacus'}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing & Art">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language Speaking">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour Management">Colour Management</option>
                    <option value="Coding">Python / Coding</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Fee</label>
                  <input
                    type="text"
                    value={editingEvent.fee || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                  <input
                    type="text"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Date to Register</label>
                  <input
                    type="text"
                    value={editingEvent.lastDate || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, lastDate: e.target.value }))}
                    placeholder="e.g. 05 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={editingEvent.place || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, place: e.target.value }))}
                    placeholder="e.g. CHENNAI (TAMIL NADU)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Status</label>
                  <select
                    value={editingEvent.status || 'Registration Open'}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Registration Open">Registration Open</option>
                    <option value="Limited Seats">Limited Seats</option>
                    <option value="Registration Closed">Registration Closed</option>
                    <option value="Hall Tickets Issued">Hall Tickets Issued</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Auditorium / Stadium name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={editingEvent.eligibility || ''}
                  onChange={(e) => setEditingEvent(prev => ({ ...prev, eligibility: e.target.value }))}
                  placeholder="e.g. Age 5 to 14 Years (Level 1 to 8)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Description & Rules</label>
                <textarea
                  rows="3"
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details about rounds, materials, and guidelines..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: RECORD PAYMENT / ISSUE RECEIPT (SUPER ADMIN & BRANCH HEAD)
          ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Record Payment & Generate Official Receipt</h3>
                <p className="text-[11px] text-slate-300">Creates an authenticated transaction in the Payment Sector ledger</p>
              </div>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfflinePayment} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payer / Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={newPayment.payerName}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, payerName: e.target.value }))}
                    placeholder="e.g. Sivaji Pandian"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Sector</label>
                  <select
                    value={newPayment.sector}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Course Tuition">Course Tuition</option>
                    <option value="Competition & Events">Competition & Events</option>
                    <option value="Toolkits & Courseware">Toolkits & Courseware</option>
                    <option value="Franchise Affiliation">Franchise Affiliation</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="text"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Mode</label>
                  <select
                    value={newPayment.paymentMode}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, paymentMode: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  >
                    <option value="Cash at Centre">Cash at Centre</option>
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="Cheque / DD">Cheque / DD</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reference / UTR No</label>
                  <input
                    type="text"
                    value={newPayment.refNo}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, refNo: e.target.value }))}
                    placeholder="Transaction reference"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch</label>
                  <input
                    type="text"
                    readOnly={currentAdminRole === 'Branch Head'}
                    value={currentAdminRole === 'Branch Head' ? activeBranch : newPayment.branch}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course / Purpose Details</label>
                <input
                  type="text"
                  value={newPayment.program}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, program: e.target.value }))}
                  placeholder="e.g. Abacus Level 1 Admission Fee"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition"
                >
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: PRINTABLE OFFICIAL FEE RECEIPT
          ========================================================================= */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-4 sm:p-6 my-auto">
            <BselReceipt
              receipt={selectedReceiptForPrint}
              onClose={() => setSelectedReceiptForPrint(null)}
            />
          </div>
        </div>
      )}
      {/* =========================================================================
          MODAL 6: EDIT STUDENT
          ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Edit Student Profile: {editingStudent.studentName}</h3>
                <p className="text-[11px] text-slate-300">ID: {editingStudent.userId} • Reg: {editingStudent.registerNumber || editingStudent.registrationNo}</p>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentName}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Father or Mother Name</label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Program</label>
                  <input
                    type="text"
                    value={editingStudent.program || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, program: e.target.value, courseName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level / Grade</label>
                  <input
                    type="text"
                    value={editingStudent.grade || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch</label>
                  <input
                    type="text"
                    value={editingStudent.branch || editingStudent.institution || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, branch: e.target.value, institution: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Class / Stage</label>
                  <input
                    type="text"
                    value={editingStudent.studentClass || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, studentClass: e.target.value }))}
                    placeholder="e.g. Class 1 / Sub-Junior"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    value={editingStudent.alternatePhone || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, alternatePhone: e.target.value }))}
                    placeholder="e.g. 98400 12345"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={editingStudent.aadharNumber || editingStudent.aadhaarNumber || editingStudent.aadhaar || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, aadharNumber: e.target.value, aadhaarNumber: e.target.value, aadhaar: e.target.value }))}
                    placeholder="12 digit Aadhaar"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fee Amount & Status</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingStudent.feeAmount || '₹450'}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, feeAmount: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                    />
                    <select
                      value={editingStudent.feePaymentType || 'Paid'}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, feePaymentType: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pay Now">Pay Now</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Permanent Address (Village, City, District, PIN)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Village"
                      value={editingStudent.village || ''}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, village: e.target.value }))}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none text-xs"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={editingStudent.city || ''}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, city: e.target.value }))}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none text-xs"
                    />
                    <input
                      type="text"
                      placeholder="District"
                      value={editingStudent.district || ''}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, district: e.target.value }))}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={editingStudent.pincode || ''}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, pincode: e.target.value }))}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: AFFILIATE NEW CENTRE / SCHOOL (SUPER ADMIN)
          ========================================================================= */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Affiliate New Branch / Exam Centre</h3>
                <p className="text-[11px] text-slate-300">Assigns unique B★SEL Centre Code and sets Centre Director credentials</p>
              </div>
              <button onClick={() => setShowAddSchoolModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newSchool.name.trim()) return;
              const nextCode = `BSEL-CTR-${100 + schoolsList.length + 1}`;
              const created = {
                ...newSchool,
                code: nextCode,
                branchName: newSchool.branchName || newSchool.name,
                status: 'Active Partner'
              };
              const updated = [...schoolsList, created];
              setSchoolsList(updated);
              saveStoredSchools(updated);
              setShowAddSchoolModal(false);
              showToast(`Affiliated "${created.name}" with Centre Code ${nextCode}!`);
            }} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Institution / Branch Name *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.name}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value, branchName: e.target.value }))}
                    placeholder="e.g. B★SEL Madurai Regional Academy"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City & District *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.city}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Madurai, Tamil Nadu"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Helpline</label>
                  <input
                    type="tel"
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 98401 23456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Centre Director / Principal</label>
                  <input
                    type="text"
                    value={newSchool.principal}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, principal: e.target.value }))}
                    placeholder="e.g. Dr. S. Ranganathan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch Coordinator</label>
                  <input
                    type="text"
                    value={newSchool.coordinator}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, coordinator: e.target.value }))}
                    placeholder="e.g. Mrs. K. Malathi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSchoolModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition"
                >
                  Affiliate Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
