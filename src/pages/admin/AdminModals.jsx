import React from 'react';
import {
  Clock,
  Edit3,
  Check,
  ShieldCheck,
  Printer,
  X,
  Plus
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Course Details — {editingCourse.name}</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Update syllabus, fee structure, age group, levels, and outcomes
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingCourse(null)} 
                className="text-white/80 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateCourse} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={editingCourse.code || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Fee</label>
                  <input
                    type="text"
                    value={editingCourse.fee || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="e.g. ₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={editingCourse.ageGroup || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, ageGroup: e.target.value }))}
                    placeholder="e.g. 5 - 14 Years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Levels & Term</label>
                  <input
                    type="text"
                    value={editingCourse.levels || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, levels: e.target.value }))}
                    placeholder="e.g. 8 Structured Levels"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration per Level</label>
                  <input
                    type="text"
                    value={editingCourse.duration || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 3 Months per Level"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enrollment Status</label>
                  <select
                    value={editingCourse.status || 'Active'}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Active">Active (Accepting Enrollments)</option>
                    <option value="Upcoming">Upcoming / In Review</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description / Tagline</label>
                <textarea
                  rows="2"
                  value={editingCourse.shortDesc || editingCourse.tagline || ''}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, shortDesc: e.target.value, tagline: e.target.value }))}
                  placeholder="Concise summary shown on cards..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Course Description</label>
                <textarea
                  rows="3"
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Comprehensive course background, methodologies and scope..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Key Outcomes <span className="font-normal text-slate-400">(one per line)</span>
                </label>
                <textarea
                  rows="3"
                  value={editingCourse.outcomesText ?? (Array.isArray(editingCourse.outcomes) ? editingCourse.outcomes.join('\n') : '')}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, outcomesText: e.target.value }))}
                  placeholder="Master core principles&#10;Boost calculation speed by 10x&#10;Gain certificate"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Curriculum Syllabus Structure <span className="font-normal text-slate-400">(one level per line)</span>
                </label>
                <textarea
                  rows="3"
                  value={editingCourse.curriculumText ?? (Array.isArray(editingCourse.curriculum) ? editingCourse.curriculum.join('\n') : '')}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, curriculumText: e.target.value }))}
                  placeholder="Level 1: Fundamentals & Basics&#10;Level 2: Formulas & Drills&#10;Level 3: Advanced Applications"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Add New Course to Master Curriculum</h3>
                <p className="text-[11px] text-slate-300">Creates new syllabus, sets duration, outcomes, and tuition fee</p>
              </div>
              <button onClick={() => setShowAddCourseModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Vedic Mathematics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Code (2-3 chars)</label>
                  <input
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. VM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase"
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
                  <label className="font-bold text-slate-700 block mb-1">Course Fee</label>
                  <input
                    type="text"
                    value={newCourse.fee}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="e.g. ₹500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={newCourse.ageGroup}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, ageGroup: e.target.value }))}
                    placeholder="e.g. 6 - 15 Years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Levels & Term</label>
                  <input
                    type="text"
                    value={newCourse.levels}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, levels: e.target.value }))}
                    placeholder="e.g. 4 Progressive Levels"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Tagline & Description</label>
                <textarea
                  rows="2"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value, shortDesc: e.target.value }))}
                  placeholder="Overview of the course and why students should join..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition"
                >
                  Publish Course
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4.5 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2">
                <Logo lightText={true} />
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">Official Fee Receipt</span>
              </div>
              <button onClick={() => setSelectedReceiptForPrint(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Receipt Number</span>
                  <div className="text-sm font-black font-mono text-slate-900">{selectedReceiptForPrint.receiptNo || selectedReceiptForPrint.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date of Payment</span>
                  <div className="font-bold text-slate-800">{selectedReceiptForPrint.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate / Payer</span>
                  <strong className="text-slate-900 text-sm capitalize">{selectedReceiptForPrint.payerName}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issuing Branch</span>
                  <strong className="text-slate-900">{selectedReceiptForPrint.branch}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Sector</span>
                  <span className="text-slate-800 font-bold">{selectedReceiptForPrint.sector}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Course / Purpose</span>
                  <span className="text-slate-800 font-bold">{selectedReceiptForPrint.program}</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Total Fee Paid</span>
                  <div className="text-2xl font-black text-emerald-900">{selectedReceiptForPrint.amount}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Mode: {selectedReceiptForPrint.paymentMode}</span>
                  <span className="font-mono text-[10px] text-emerald-800">Ref: {selectedReceiptForPrint.refNo}</span>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated by {selectedReceiptForPrint.verifiedBy || 'B★SEL Desk'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#081d3d] hover:bg-[#123068] text-white rounded-lg font-black text-xs transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: EDIT STUDENT
          ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
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
                  <label className="font-bold text-slate-700 block mb-1">Parent Name</label>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
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
