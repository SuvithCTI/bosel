import React, { useState } from 'react';
import { CalendarDays, Check, CreditCard, Receipt, UserRound, X } from 'lucide-react';
import api from '../../services/api';

const FEE_TYPES = [
  {
    name: 'Monthly Fee',
    cardClass: 'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-100 hover:border-sky-400',
    iconClass: 'bg-sky-100 text-sky-800 group-hover:bg-sky-700 group-hover:text-white',
    titleClass: 'text-sky-950',
  },
  {
    name: 'Exam Fee',
    cardClass: 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-100 hover:border-amber-400',
    iconClass: 'bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white',
    titleClass: 'text-amber-950',
  },
  {
    name: 'Event Fee',
    cardClass: 'border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-100 hover:border-violet-400',
    iconClass: 'bg-violet-100 text-violet-800 group-hover:bg-violet-700 group-hover:text-white',
    titleClass: 'text-violet-950',
  },
  {
    name: 'Book Fee',
    cardClass: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-100 hover:border-emerald-400',
    iconClass: 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white',
    titleClass: 'text-emerald-950',
  },
  {
    name: 'Others',
    cardClass: 'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-100 hover:border-rose-400',
    iconClass: 'bg-rose-100 text-rose-800 group-hover:bg-rose-700 group-hover:text-white',
    titleClass: 'text-rose-950',
  },
];

export default function StudentFeePayment({ student }) {
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [feePaymentError, setFeePaymentError] = useState('');
  const [feePaymentNotice, setFeePaymentNotice] = useState('');
  const [submittedPayment, setSubmittedPayment] = useState(null);
  const [submittingFeePayment, setSubmittingFeePayment] = useState(false);
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState('idle');
  const [gatewayTransactionId, setGatewayTransactionId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [feePayment, setFeePayment] = useState({
    amount: '',
    paymentMode: 'UPI / QR Code',
    refNo: '',
    program: '',
  });

  const studentId =
    student?.userId ||
    student?.id ||
    student?.studentId ||
    student?.phone ||
    '';
  const studentName =
    student?.name ||
    student?.studentName ||
    student?.fullName ||
    'Student';
  const studentRegisterNumber =
    student?.registerNumber ||
    student?.registrationNo ||
    student?.registerNumbers?.[0] ||
    studentId;
  const studentPhoto =
    student?.profileImage ||
    student?.profilePicture ||
    student?.photoURL ||
    student?.studentPhoto ||
    student?.photo;
  const studentCourse =
    student?.courseName ||
    student?.program ||
    student?.course ||
    'Registered course';
  const studentBranch =
    student?.branch ||
    student?.institution ||
    student?.studyCenter ||
    'Tenkasi';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeePayment((previous) => ({ ...previous, [name]: value }));
    if (name === 'paymentMode') {
      setPaymentGatewayStatus('idle');
      setGatewayTransactionId('');
    }
    setFeePaymentError('');
    setFeePaymentNotice('');
    setSubmittedPayment(null);
  };

  const selectPaymentMode = (paymentMode) => {
    setFeePayment((previous) => ({ ...previous, paymentMode, refNo: '' }));
    setPaymentGatewayStatus('idle');
    setGatewayTransactionId('');
    setFeePaymentError('');
    setFeePaymentNotice('');
  };

  const openPaymentPopup = (feeType) => {
    setSelectedFeeType(feeType);
    setFeePayment({
      amount: '',
      paymentMode: 'UPI / QR Code',
      refNo: '',
      program: '',
    });
    setPaymentGatewayStatus('idle');
    setGatewayTransactionId('');
    setSelectedBank('HDFC Bank');
    setFeePaymentError('');
    setFeePaymentNotice('');
    setSubmittedPayment(null);
  };

  const closePaymentPopup = () => {
    if (submittingFeePayment || paymentGatewayStatus === 'processing') return;
    setSelectedFeeType('');
    setFeePaymentError('');
    setFeePaymentNotice('');
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText('bsel@okaxis');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      setFeePaymentError('Unable to copy the UPI ID. Please copy it manually: bsel@okaxis');
    }
  };

  const handleSimulateGatewayPayment = () => {
    const amount = Number(feePayment.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeePaymentError('Enter a valid fee amount before continuing.');
      return;
    }

    setFeePaymentError('');
    setPaymentGatewayStatus('processing');
    const prefix = feePayment.paymentMode.includes('Card') ? 'CARD' : 'NET';
    const transactionId = `SIM-${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setTimeout(() => {
      setPaymentGatewayStatus('success');
      setGatewayTransactionId(transactionId);
    }, 1200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeePaymentError('');
    setFeePaymentNotice('');

    if (!studentId) {
      setFeePaymentError('Your student ID is missing. Please contact your branch.');
      return;
    }

    const amount = Number(feePayment.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeePaymentError('Enter a valid fee amount greater than zero.');
      return;
    }
    if (feePayment.paymentMode === 'UPI / QR Code' && !feePayment.refNo.trim()) {
      setFeePaymentError('Enter the UPI transaction reference after completing the payment.');
      return;
    }
    if (feePayment.paymentMode !== 'UPI / QR Code') {
      setFeePaymentError('Card and net-banking are simulated here. Use UPI to submit a real payment for verification.');
      return;
    }

    setSubmittingFeePayment(true);

    try {
      const paymentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const paymentRecord = {
        payerName: studentName,
        studentId: String(studentId),
        branch: studentBranch,
        sector: selectedFeeType,
        program: feePayment.program.trim() || selectedFeeType,
        amount: `₹${amount}`,
        paymentMode: feePayment.paymentMode,
        refNo: feePayment.refNo.trim(),
        date: paymentDate,
        status: 'Pending Verification',
        verifiedBy: 'Pending',
        notes: feePayment.program.trim(),
      };
      const createdPayment = await api.payments.create(paymentRecord);
      const receiptNo =
        createdPayment?.receiptNo ||
        createdPayment?.receipt_no ||
        createdPayment?.id ||
        '';
      setSubmittedPayment({
        ...paymentRecord,
        receiptNo,
      });

      setFeePayment({
        amount: '',
        paymentMode: 'UPI / QR Code',
        refNo: '',
        program: '',
      });
      setPaymentGatewayStatus('idle');
      setGatewayTransactionId('');
      setFeePaymentNotice(
        `Payment submitted successfully${receiptNo ? ` (Receipt No: ${receiptNo})` : ''}. An acknowledgement has been added to Receipts / Bills.`
      );
    } catch (paymentError) {
      setFeePaymentError(
        paymentError?.message || 'Unable to submit payment details. Please try again.'
      );
    } finally {
      setSubmittingFeePayment(false);
    }
  };

  const upiAmount = Number(feePayment.amount);
  const upiPayload = `upi://pay?pa=bsel@okaxis&pn=BSEL%20Educational%20Board&am=${upiAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`${selectedFeeType} Fee`)}`;
  const paymentModes = ['UPI / QR Code', 'Debit / Credit Card', 'Net Banking (IMPS/NEFT)'];

  return (
    <>
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-5 sm:rounded-3xl sm:p-4">
        <div className="mb-3">
          <h2 className="text-base font-extrabold text-blue-950 sm:text-lg">Fee Payment</h2>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {FEE_TYPES.map(({ name, cardClass, iconClass, titleClass }) => (
            <button
              key={name}
              type="button"
              onClick={() => openPaymentPopup(name)}
              className={`group flex min-h-24 flex-col items-start rounded-2xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 ${cardClass}`}
              aria-label={`Pay ${name}`}
            >
              <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg transition ${iconClass}`}>
                <CreditCard className="h-5 w-5" />
              </span>
              <span className={`text-sm font-extrabold ${titleClass}`}>{name}</span>
            </button>
          ))}
        </div>
      </section>

      {selectedFeeType && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={closePaymentPopup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-fee-payment-title"
            className={`my-auto flex max-h-[94vh] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ${
              feePaymentNotice ? 'max-w-3xl' : 'max-w-xl'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-blue-950 px-4 py-4 text-white sm:px-5">
              <div>
                <h2 id="student-fee-payment-title" className="text-base font-black text-white sm:text-lg">
                  {feePaymentNotice ? 'Payment Submission' : `${selectedFeeType} Payment`}
                </h2>
                <p className="mt-1 text-xs text-blue-100">
                  {feePaymentNotice
                    ? 'Your payment details have been recorded.'
                    : `Enter payment information for ${selectedFeeType.toLowerCase()}.`}
                </p>
              </div>
              <button
                type="button"
                onClick={closePaymentPopup}
                disabled={submittingFeePayment}
                aria-label="Close payment popup"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              {feePaymentNotice ? (
                <div role="status" className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 p-3 sm:p-5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg ring-8 ring-emerald-50 sm:h-16 sm:w-16">
                      <Check className="h-7 w-7 stroke-[3] sm:h-8 sm:w-8" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-[10px] font-bold tracking-wide text-emerald-800 sm:text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      PAYMENT SUBMITTED SUCCESSFULLY
                    </span>
                    <h3 className="mt-2.5 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      Thank you, {studentName}!
                    </h3>
                    <p className="mt-1 max-w-lg text-xs font-medium text-slate-600 sm:text-[13px]">
                      Your <strong className="font-bold text-slate-900">{submittedPayment?.sector}</strong> payment details have been submitted.
                    </p>
                  </div>

                  <div className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xs sm:p-5">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {studentPhoto ? (
                          <img
                            src={studentPhoto}
                            alt={studentName}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-sky-500/30 sm:h-14 sm:w-14"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400 sm:h-14 sm:w-14">
                            <UserRound className="h-6 w-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900 sm:text-base">
                            {studentName}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {studentCourse}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="block rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-black text-slate-900 sm:text-[11px]">
                          Reg: {studentRegisterNumber}
                        </span>
                        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                          <CalendarDays className="h-3 w-3" />
                          {submittedPayment?.date}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 sm:text-[11px]">
                          <Receipt className="h-4 w-4 text-sky-700" />
                          Payment details
                        </span>
                        <span className="font-mono text-xs font-black text-emerald-700">
                          Fee: {submittedPayment?.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-slate-900">
                            {submittedPayment?.sector}
                          </p>
                          {submittedPayment?.program &&
                            submittedPayment.program !== submittedPayment.sector && (
                              <p className="mt-1 truncate text-[10px] text-slate-500">
                                {submittedPayment.program}
                              </p>
                            )}
                        </div>
                        <span className="shrink-0 font-mono text-xs font-bold text-slate-700">
                          {submittedPayment?.amount}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Branch / Centre</span>
                        <strong className="mt-0.5 block truncate text-xs font-extrabold text-slate-900">{studentBranch}</strong>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Payment Method</span>
                        <strong className="mt-0.5 block truncate text-xs font-extrabold text-slate-900">{submittedPayment?.paymentMode}</strong>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Payment Status</span>
                        <strong className="mt-0.5 block text-xs font-extrabold text-emerald-700">Submitted</strong>
                      </div>
                      {submittedPayment?.receiptNo && (
                        <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 sm:col-span-3">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Acknowledgement No.</span>
                          <strong className="mt-0.5 block truncate font-mono text-xs font-extrabold text-slate-900">{submittedPayment.receiptNo}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={closePaymentPopup}
                      className="rounded-xl bg-[#0F2B5C] px-6 py-2.5 text-sm font-black text-white transition hover:bg-[#18458F]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {feePaymentError && (
                    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                      {feePaymentError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Fee type</label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-800">
                    {selectedFeeType}
                  </div>
                </div>

                <div>
                  <label htmlFor="fee-amount" className="mb-1.5 block text-xs font-bold text-slate-700">Amount (₹)</label>
                  <input
                    id="fee-amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={feePayment.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Payment method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentModes.map((paymentMode) => (
                      <button
                        key={paymentMode}
                        type="button"
                        onClick={() => selectPaymentMode(paymentMode)}
                        aria-pressed={feePayment.paymentMode === paymentMode}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                          feePayment.paymentMode === paymentMode
                            ? 'border-blue-700 bg-blue-50 text-blue-950 ring-1 ring-blue-600'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {paymentMode === 'Debit / Credit Card'
                          ? 'Cards'
                          : paymentMode === 'Net Banking (IMPS/NEFT)'
                            ? 'Net Banking'
                            : 'UPI / QR'}
                      </button>
                    ))}
                  </div>
                </div>

                {feePayment.paymentMode === 'UPI / QR Code' && (
                  <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      {upiAmount > 0 ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(upiPayload)}`}
                          alt={`UPI payment QR for ${selectedFeeType}`}
                          className="h-36 w-36 rounded-lg border border-slate-200 p-1"
                        />
                      ) : (
                        <div className="flex h-36 w-36 items-center justify-center rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                          Enter an amount to create the UPI QR
                        </div>
                      )}
                      <div className="w-full min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900">Pay with UPI</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          Scan the QR or use the UPI ID below, then enter the transaction reference.
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-500">B★SEL UPI ID</span>
                            <span className="font-mono text-sm font-black text-slate-900">bsel@okaxis</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            {copiedUpi ? 'Copied' : 'Copy UPI ID'}
                          </button>
                        </div>
                        {upiAmount > 0 && (
                          <a
                            href={upiPayload}
                            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-black text-white hover:bg-emerald-700 sm:hidden"
                          >
                            Open in UPI app
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {feePayment.paymentMode === 'Debit / Credit Card' && (
                  <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="rounded-xl bg-gradient-to-r from-[#0F2B5C] to-[#1E4D99] p-4 text-white">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span>B★SEL Student Pay</span>
                        <span>RuPay · VISA</span>
                      </div>
                      <p className="mt-5 font-mono text-sm tracking-widest">•••• •••• •••• ••••</p>
                      <p className="mt-3 text-[10px] text-blue-100">Simulated card checkout — card details are not requested.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateGatewayPayment}
                      disabled={paymentGatewayStatus === 'processing'}
                      className="mt-3 w-full rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
                    >
                      {paymentGatewayStatus === 'processing' ? 'Processing simulation…' : `Simulate Card Payment · ₹${upiAmount || 0}`}
                    </button>
                  </div>
                )}

                {feePayment.paymentMode === 'Net Banking (IMPS/NEFT)' && (
                  <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3">
                    <label className="mb-2 block text-xs font-bold text-slate-700">Select bank</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          aria-pressed={selectedBank === bank}
                          className={`rounded-lg border p-2 text-xs font-bold ${
                            selectedBank === bank
                              ? 'border-blue-700 bg-blue-50 text-blue-950'
                              : 'border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateGatewayPayment}
                      disabled={paymentGatewayStatus === 'processing'}
                      className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {paymentGatewayStatus === 'processing' ? `Connecting to ${selectedBank}…` : `Simulate ${selectedBank} Payment · ₹${upiAmount || 0}`}
                    </button>
                  </div>
                )}

                {paymentGatewayStatus === 'success' && (
                  <div role="status" className="sm:col-span-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-900">
                    <p className="text-sm font-black">Payment simulation approved — no money was charged.</p>
                    <p className="mt-1 text-xs">Simulation transaction ID: <span className="font-mono font-bold">{gatewayTransactionId}</span></p>
                  </div>
                )}

                <div>
                  <label htmlFor="fee-reference" className="mb-1.5 block text-xs font-bold text-slate-700">UPI transaction reference *</label>
                  <input
                    id="fee-reference"
                    name="refNo"
                    type="text"
                    value={feePayment.refNo}
                    onChange={handleChange}
                    required={feePayment.paymentMode === 'UPI / QR Code'}
                    disabled={feePayment.paymentMode !== 'UPI / QR Code'}
                    placeholder="Enter UPI reference after paying"
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="fee-purpose" className="mb-1.5 block text-xs font-bold text-slate-700">Details (optional)</label>
                  <input
                    id="fee-purpose"
                    name="program"
                    type="text"
                    value={feePayment.program}
                    onChange={handleChange}
                    placeholder="Month, exam, event, or other details"
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingFeePayment || feePayment.paymentMode !== 'UPI / QR Code'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CreditCard className="h-4 w-4" />
                    {submittingFeePayment ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
