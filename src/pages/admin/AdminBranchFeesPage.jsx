import React from 'react';
import {
  CreditCard,
  Plus,
  Printer
} from 'lucide-react';

export default function AdminBranchFeesPage({
  branchPayments,
  setSelectedReceiptForPrint
}) {
  return (
          <div className="space-y-4 animate-in fade-in duration-200">

            {/* Branch Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      <th className="py-3 px-4">Receipt / Date</th>
                      <th className="py-3 px-3">Student Name</th>
                      <th className="py-3 px-3">Course / Purpose</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Mode</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {branchPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-800">{p.receiptNo || p.id}</div>
                          <div className="text-[10px] text-slate-400">{p.date}</div>
                        </td>

                        <td className="py-3 px-3 font-extrabold text-slate-900 capitalize">
                          {p.payerName}
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {p.program}
                        </td>

                        <td className="py-3 px-3 font-black text-slate-900">
                          {p.amount}
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {p.paymentMode}
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-900">
                            {p.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForPrint(p)}
                            className="px-2.5 py-1 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded text-xs font-bold transition flex items-center gap-1 ml-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  );
}
