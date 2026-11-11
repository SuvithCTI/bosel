import React, { useMemo, useState, useEffect, useRef } from 'react';
import { deletePayment } from '../../data/paymentsData';
import { getAllDistrictBranches } from '../../data/districtsData';
import { printReceiptSheets } from '../../components/BselReceipt'; // adjust path if BselReceipt.jsx lives elsewhere
import {
  CreditCard,
  Plus,
  Printer,
  Trash2,
  X
} from 'lucide-react';

const RECEIPTS_PER_SHEET = 3;

export default function AdminPaymentsPage({
  filteredPayments,
  paymentSectorFilter,
  setPaymentSectorFilter,
  paymentBranchFilter,
  setPaymentBranchFilter,
  setShowAddPaymentModal,
  setSelectedReceiptForPrint,
  handleVerifyPayment,
  setPaymentsList,
  showToast
}) {
  const allBranches = useMemo(() => getAllDistrictBranches(), []);

  // ---- bulk selection ----
  const [selectedIds, setSelectedIds] = useState([]);
  const selectAllRef = useRef(null);

  // only payments that are currently visible can be printed (keeps table order)
  const selectedPayments = useMemo(
    () => filteredPayments.filter((p) => selectedIds.includes(p.id)),
    [filteredPayments, selectedIds]
  );

  const allSelected =
    filteredPayments.length > 0 &&
    selectedPayments.length === filteredPayments.length;
  const someSelected = selectedPayments.length > 0 && !allSelected;

  // "-" state on the header checkbox when only some rows are ticked
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : filteredPayments.map((p) => p.id));

  const sheetCount = Math.ceil(selectedPayments.length / RECEIPTS_PER_SHEET);

  const handlePrintSelected = () => {
    if (!selectedPayments.length) {
      showToast && showToast('Select at least one payment to print.');
      return;
    }
    // 1-3 -> sheet 1, 4-6 -> sheet 2, ...
    printReceiptSheets(selectedPayments);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Central Payment Sectors & Financial Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete ledger tracking Course Tuition, Event Competitions, Kit Dispatches, and Franchise Affiliation payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddPaymentModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment / Receipt</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Sector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 1</div>
          <div className="text-xs font-black text-sky-900 mt-0.5">Course Tuition & Admissions</div>
          <div className="text-xl font-black text-slate-950 mt-1">₹48,500</div>
          <span className="text-[10px] text-slate-500">Student level admissions</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 2</div>
          <div className="text-xs font-black text-amber-900 mt-0.5">Competition & Events</div>
          <div className="text-xl font-black text-slate-950 mt-1">₹38,000</div>
          <span className="text-[10px] text-slate-500">State Championship tickets</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 3</div>
          <div className="text-xs font-black text-purple-900 mt-0.5">Toolkits & Courseware</div>
          <div className="text-xl font-black text-slate-950 mt-1">₹23,000</div>
          <span className="text-[10px] text-slate-500">Workbooks & Abacus frames</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 4</div>
          <div className="text-xs font-black text-emerald-900 mt-0.5">Franchise Affiliation</div>
          <div className="text-xl font-black text-slate-950 mt-1">₹75,000</div>
          <span className="text-[10px] text-slate-500">3 Branch Licenses</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">Filter Sector:</span>
          <select
            value={paymentSectorFilter}
            onChange={(e) => setPaymentSectorFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-none font-bold bg-white"
          >
            <option value="All">All Sectors</option>
            <option value="Course Tuition">Course Tuition</option>
            <option value="Competition & Events">Competition & Events</option>
            <option value="Toolkits & Courseware">Toolkits & Courseware</option>
            <option value="Franchise Affiliation">Franchise Affiliation</option>
          </select>

          <select
            value={paymentBranchFilter}
            onChange={(e) => setPaymentBranchFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-none font-bold bg-white"
          >
            <option value="All">All Branches</option>
            {allBranches.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs font-black text-emerald-800">
            Filtered Total: ₹{filteredPayments.reduce((acc, p) => acc + (p.amountNum || 0), 0).toLocaleString('en-IN')}
          </div>

          {/* Bulk print controls */}
          <div className="flex items-center gap-2">
            {selectedPayments.length > 0 && (
              <>
                <span className="text-[11px] font-bold text-slate-600">
                  {selectedPayments.length} selected &middot; {sheetCount} A4 sheet{sheetCount > 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handlePrintSelected}
              disabled={selectedPayments.length === 0}
              className="px-3.5 py-1.5 bg-[#081d3d] hover:bg-[#172b4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
              title="Prints 3 receipts per A4 sheet"
            >
              <Printer className="w-4 h-4" />
              <span>Print Selected (3 per A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
              <tr>
                <th className="py-3 pl-4 pr-1 w-8">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    disabled={filteredPayments.length === 0}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    title="Select all"
                    aria-label="Select all payments"
                  />
                </th>
                <th className="py-3 px-3">Txn / Receipt No</th>
                <th className="py-3 px-3">Payer Name</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3">Payment Sector</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Mode & UTR</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPayments.map((payment) => {
                const isSelected = selectedIds.includes(payment.id);

                return (
                  <tr
                    key={payment.id}
                    className={`transition ${isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-3 pl-4 pr-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(payment.id)}
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        aria-label={`Select ${payment.payerName}`}
                      />
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      <div>{payment.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {payment.receiptNo}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">
                        {payment.payerName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {payment.date}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      {payment.branch}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {payment.sector}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-black text-emerald-800 text-sm">
                      {payment.amount}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">
                        {payment.paymentMode}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {payment.refNo}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptForPrint(payment)}
                          className="p-1 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded transition"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete payment record ${payment.id}?`)) {
                              setPaymentsList(deletePayment(payment.id));
                              setSelectedIds((prev) => prev.filter((x) => x !== payment.id));
                              showToast('Payment record removed.');
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                    No payments match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}