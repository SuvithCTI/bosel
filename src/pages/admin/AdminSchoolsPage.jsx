import React from 'react';
import {
  School,
  Plus,
  MapPin
} from 'lucide-react';

export default function AdminSchoolsPage({
  schoolsList,
  setShowAddSchoolModal,
  setActiveBranch,
  handleRoleSwitch
}) {
  return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <School className="w-5 h-5 text-orange-500" />
                  <span>Authorized Branches & Partner Schools Network</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official B★SEL exam centres, accredited franchise academies, and regional institutions across Tamil Nadu and South India.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddSchoolModal(true)}
                className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Affiliate New Centre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schoolsList.map((school) => (
                <div key={school.code} className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {school.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {school.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-950">{school.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{school.city}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-0.5 mt-2">
                      <div>Principal/Head: <strong className="text-slate-800">{school.principal}</strong></div>
                      <div>Coordinator: <strong className="text-slate-800">{school.coordinator}</strong></div>
                      <div>Contact: <strong className="text-slate-800">{school.phone}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-sky-800">
                      {school.studentsCount} Active Students
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveBranch(school.name);
                        handleRoleSwitch('Branch Head');
                      }}
                      className="px-2.5 py-1 text-xs font-black bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition"
                    >
                      Open Branch Desk →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  );
}
