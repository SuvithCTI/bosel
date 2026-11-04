import React from 'react';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  GraduationCap,
  FileText,
  Award,
  Edit3,
  Trash2
} from 'lucide-react';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber
} from '../../utils/studentDataHelpers';

export default function AdminBranchStudentsPage({
  activeBranch,
  branchStudents,
  branchStudentSearch,
  setBranchStudentSearch,
  setShowAddStudentModal,
  setViewingAdmissionStudent,
  handleOpenMarksheet,
  handleOpenCertForStudent,
  setEditingStudent,
  handleDeleteStudent
}) {
  return (
          <div className="space-y-4 animate-in fade-in duration-200">

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={branchStudentSearch}
                onChange={(e) => setBranchStudentSearch(e.target.value)}
                placeholder="Search branch students by name, reg no..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
              />
            </div>

            {/* Branch Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      <th className="py-3 px-4">Student & Reg No</th>
                      <th className="py-3 px-3">Parent & Phone</th>
                      <th className="py-3 px-3">Enrolled Course</th>
                      <th className="py-3 px-3">Current Level</th>
                      <th className="py-3 px-3">Fee Status</th>
                      <th className="py-3 px-3 text-right">Branch Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {branchStudents.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500">
                          No students currently enrolled under {activeBranch}. Click "+ Enroll Student in This Branch" above.
                        </td>
                      </tr>
                    ) : (
                      branchStudents.map((st) => (
                        <tr key={st.userId} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-slate-900 capitalize">{st.studentName}</div>
                            <div className="text-[10px] text-sky-900 font-mono font-bold mt-0.5">
                              {st.registerNumber || st.userId}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-slate-800">{st.parentName || 'Guardian'}</div>
                            <div className="text-[10px] text-slate-500">{st.phone}</div>
                          </td>

                          <td className="py-3 px-3 font-bold text-slate-900">
                            {st.program}
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-black rounded text-[10px]">
                              {st.grade || 'Level 1'}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-sky-100 text-sky-900 font-black rounded-full text-[10px] uppercase">
                              {st.feeAmount || '₹450'} • {st.feePaymentType || 'Paid'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                              <button
                                type="button"
                                onClick={() => setViewingAdmissionStudent(st)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title="View & Print Official Admission Form"
                              >
                                <GraduationCap className="w-3 h-3 text-emerald-200" />
                                <span>Admission Form</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenCertForStudent(st)}
                                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded text-[10px] flex items-center gap-1"
                              >
                                <Award className="w-3 h-3" />
                                <span>Certificate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingStudent(st)}
                                className="p-1 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded"
                                title="Update Student Record"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(st.userId, st.studentName)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  );
}
