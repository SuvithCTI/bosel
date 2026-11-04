import React from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export default function AdminBranchBatchesPage({
  activeBranch,
  branchBatches,
  coursesList,
  setShowAddBatchModal,
  setEditingBatch,
  setBatchForm,
  handleDeleteBatch
}) {
  return (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <span>Available Batches & Class Timings</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900">
                      {branchBatches.length} Configured
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage branch batch schedules, timings, days, and intake capacity for {activeBranch}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingBatch(null);
                  setBatchForm({
                    name: '',
                    program: coursesList[0]?.name || 'Abacus',
                    days: 'Saturday & Sunday',
                    startTime: '09:30 AM',
                    endTime: '11:30 AM',
                    room: 'Classroom 1',
                    maxCapacity: 15,
                    enrolledCount: 0,
                    instructor: '',
                    status: 'Active',
                    notes: ''
                  });
                  setShowAddBatchModal(true);
                }}
                className="px-4 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Batch</span>
              </button>
            </div>

            {/* Batch Cards Grid */}
            {branchBatches.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-black text-slate-700">No Batches Configured</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click "Create New Batch" above to set up your first classroom timing slot.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {branchBatches.map((batch) => (
                  <div 
                    key={batch.id} 
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-900">
                          {batch.program}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          batch.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : batch.status === 'Full' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {batch.status}
                        </span>
                      </div>

                      {/* Batch Name */}
                      <h3 className="text-sm font-black text-slate-950 mb-1 leading-snug">
                        {batch.name}
                      </h3>
                      {batch.batchCode && (
                        <div className="text-[10px] font-mono text-slate-400 mb-3">
                          Batch Code: {batch.batchCode}
                        </div>
                      )}

                      {/* Timing & Details Box */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>{batch.days}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-900 font-black">
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{batch.startTime} — {batch.endTime}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                          <span>Room: <strong className="text-slate-800">{batch.room || 'General Room'}</strong></span>
                          {batch.instructor && (
                            <span>Faculty: <strong className="text-slate-800">{batch.instructor}</strong></span>
                          )}
                        </div>
                      </div>

                      {batch.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-2.5 line-clamp-2">
                          "{batch.notes}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        Intake: <strong className="text-slate-900">{batch.enrolledCount || 0} / {batch.maxCapacity || 15}</strong>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBatch(batch);
                            setBatchForm({
                              name: batch.name,
                              program: batch.program,
                              days: batch.days,
                              startTime: batch.startTime,
                              endTime: batch.endTime,
                              room: batch.room || '',
                              maxCapacity: batch.maxCapacity || 15,
                              enrolledCount: batch.enrolledCount || 0,
                              instructor: batch.instructor || '',
                              status: batch.status || 'Active',
                              notes: batch.notes || ''
                            });
                            setShowAddBatchModal(true);
                          }}
                          className="px-2.5 py-1 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBatch(batch.id, batch.name)}
                          className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
  );
}
