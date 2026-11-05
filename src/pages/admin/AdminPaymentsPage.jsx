import { deletePayment } from '../../data/paymentsData';

import React, { useMemo } from 'react';

import { getAllDistrictBranches } from '../../data/districtsData';

import {

  CreditCard,

  Plus,

  Printer,

  Trash2

} from 'lucide-react';



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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

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



              <div className="text-xs font-black text-emerald-800">

                Filtered Total: ₹{filteredPayments.reduce((acc, p) => acc + (p.amountNum || 0), 0).toLocaleString('en-IN')}

              </div>

            </div>



            {/* Payment Transactions Table */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="w-full overflow-hidden">

                <table className="w-full text-left text-xs">

                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">

                    <tr>

                      <th className="py-3 px-4">Txn / Receipt No</th>

                      <th className="py-3 px-3">Payer Name</th>

                      <th className="py-3 px-3">Branch</th>

                      <th className="py-3 px-3">Payment Sector</th>

                      <th className="py-3 px-3">Amount</th>

                      <th className="py-3 px-3">Mode & UTR</th>

                      <th className="py-3 px-3">Status</th>

                      <th className="py-3 px-3 text-right">Actions</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100 font-medium">

                    {filteredPayments.map((payment) => (

                      <tr key={payment.id} className="hover:bg-slate-50 transition">

                        <td className="py-3 px-4 font-mono font-bold text-slate-800">

                          <div>{payment.id}</div>

                          <div className="text-[10px] text-slate-400">{payment.receiptNo}</div>

                        </td>



                        <td className="py-3 px-3">

                          <div className="font-extrabold text-slate-900">{payment.payerName}</div>

                          <div className="text-[10px] text-slate-500">{payment.date}</div>

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

                          <div className="font-bold text-slate-800">{payment.paymentMode}</div>

                          <div className="font-mono text-[10px] text-slate-500">{payment.refNo}</div>

                        </td>



                        <td className="py-3 px-3">

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${

                            payment.status === 'Verified'

                              ? 'bg-emerald-100 text-emerald-800'

                              : 'bg-amber-100 text-amber-800'

                          }`}>

                            {payment.status}

                          </span>

                        </td>



                        <td className="py-3 px-3 text-right">

                          <div className="flex items-center justify-end gap-1.5">

                            {payment.status !== 'Verified' && (

                              <button

                                type="button"

                                onClick={() => handleVerifyPayment(payment.id)}

                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition"

                              >

                                Verify

                              </button>

                            )}



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

                                  showToast('Payment record removed.');

                                }

                              }}

                              className="p-1 text-slate-400 hover:text-rose-600 transition"

                            >

                              <Trash2 className="w-4 h-4" />

                            </button>

                          </div>

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

