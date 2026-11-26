import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sun,
  FileText,
  Handshake,
  Check,
  CreditCard,
  Receipt,
  UserRound,
  X,
  CalendarDays,
  Plus,
} from 'lucide-react';
import api from '../../services/api';
import { getStoredPayments, addStoredPayment } from '../../data/paymentsData';
import BselReceipt from '../admin/BselReceipt';

const INITIAL_FEES = [
  {
    id: 'monthly',
    name: 'Monthly Fee',
    amount: 1000,
    defaultStatus: 'Due',
    icon: BookOpen,
  },
  {
    id: 'exam',
    name: 'Exam Fee',
    amount: 500,
    defaultStatus: 'Paid',
    icon: GraduationCap,
  },
  {
    id: 'event',
    name: 'Event Fee',
    amount: 300,
    defaultStatus: 'Due',
    icon: Sun,
  },
  {
    id: 'book',
    name: 'Book Fee',
    amount: 700,
    defaultStatus: 'Paid',
    icon: FileText,
  },
];

const OTHER_FEE_TYPES = [
  'Tuition Fee',
  'Competition Fee',
  'Kit & Material Fee',
  'Workshop Fee',
  'Special Class Fee',
  'Others',
];

export default function StudentFeePayment({ student, onOpenReceipts }) {
  const studentId =
    student?.userId ||
    student?.id ||
    student?.studentId ||
    student?.phone ||
    '1326';

  const displayName = useMemo(() => {
    const raw =
      student?.fullName ||
      student?.name ||
      student?.studentName ||
      student?.userId;
    if (raw && String(raw).trim()) {
      return String(raw).trim();
    }
    return 'Demo 1326';
  }, [student]);

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
    'Abacus Speed Math';

  const studentBranch =
    student?.branch ||
    student?.institution ||
    student?.studyCenter ||
    'Tenkasi';

  // Fee state storage key
  const storageKey = `bsel_student_fees_${String(studentId).toLowerCase()}`;

  // Fees state
  const [fees, setFees] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (f) => f.id !== 'franchise' && f.name !== 'Franchise Fee'
          );
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_FEES.map((f) => ({
      id: f.id,
      name: f.name,
      amount: f.amount,
      status: f.defaultStatus,
    }));
  });

  // Load existing payments from server / storage to sync paid statuses
  useEffect(() => {
    const syncPayments = async () => {
      try {
        const stored = getStoredPayments();
        let remote = [];
        try {
          remote = await api.payments.getAll();
        } catch {
          // ignore remote error, use stored
        }
        const allPayments = Array.isArray(remote) && remote.length ? remote : stored;
        const studentPayments = allPayments.filter((p) => {
          const pId = String(p.studentId || p.student_id || '').toLowerCase();
          const curId = String(studentId).toLowerCase();
          return pId === curId;
        });

        setFees((prevFees) => {
          const updated = prevFees.map((fee) => {
            const matchingPayment = studentPayments.find((p) => {
              const sector = String(p.sector || p.program || '').toLowerCase();
              return sector.includes(fee.name.toLowerCase());
            });

            if (matchingPayment) {
              return {
                ...fee,
                status: 'Paid',
                receiptNo:
                  matchingPayment.receiptNo ||
                  matchingPayment.receipt_no ||
                  matchingPayment.id,
                paidDate: matchingPayment.date,
                paymentMode: matchingPayment.paymentMode,
                paymentRecord: matchingPayment,
              };
            }
            return fee;
          });

          try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          } catch {}

          return updated;
        });
      } catch (err) {
        console.error('Error syncing student payments:', err);
      }
    };

    syncPayments();
    window.addEventListener('bsel_payments_updated', syncPayments);
    return () => window.removeEventListener('bsel_payments_updated', syncPayments);
  }, [studentId, storageKey]);

  // Save fees state when updated
  const updateFeesState = (newFees) => {
    setFees(newFees);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newFees));
    } catch (err) {
      console.error('Error saving fees state:', err);
    }
  };

  // Payment popup state
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [feePaymentError, setFeePaymentError] = useState('');
  const [feePaymentNotice, setFeePaymentNotice] = useState('');
  const [submittedPayment, setSubmittedPayment] = useState(null);
  const [submittingFeePayment, setSubmittingFeePayment] = useState(false);
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState('idle');
  const [gatewayTransactionId, setGatewayTransactionId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [feePayment, setFeePayment] = useState({
    amount: '',
    paymentMode: 'UPI / QR Code',
    refNo: '',
    program: '',
  });

  const handlePayNow = (feeItem) => {
    setSelectedFeeType(feeItem.name);
    setFeePayment({
      amount: String(feeItem.amount || ''),
      paymentMode: 'UPI / QR Code',
      refNo: '',
      program: feeItem.name,
    });
    setPaymentGatewayStatus('idle');
    setGatewayTransactionId('');
    setSelectedBank('HDFC Bank');
    setFeePaymentError('');
    setFeePaymentNotice('');
    setSubmittedPayment(null);
  };

  const handleOpenCustomPay = (feeName = 'Other Fee') => {
    setSelectedFeeType(feeName);
    setFeePayment({
      amount: '',
      paymentMode: 'UPI / QR Code',
      refNo: '',
      program: feeName,
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

  const handleViewReceipt = (feeItem) => {
    const cleanId = String(studentId).replace(/\D/g, '').slice(-5) || '1326';
    const feeNameUpper = feeItem.name.replace(/\s+/g, '-').toUpperCase();
    const receiptNo =
      feeItem.receiptNo ||
      feeItem.paymentRecord?.receiptNo ||
      feeItem.paymentRecord?.receipt_no ||
      `RCPT-${feeNameUpper.slice(0, 4)}-${cleanId}`;

    const receiptDate =
      feeItem.paidDate ||
      feeItem.paymentRecord?.date ||
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

    const receiptObj = {
      ...student,
      receiptNo,
      receiptRefNo: receiptNo,
      studentName: displayName,
      payerName: displayName,
      parentName:
        student?.parentName ||
        student?.fatherName ||
        student?.guardianName ||
        'Guardian',
      school: studentBranch || 'Tenkasi Branch',
      standard:
        student?.studentClass ||
        student?.grade ||
        student?.courseLevel ||
        'Level 1',
      program: studentCourse,
      courseName: studentCourse,
      sector: feeItem.name,
      feeType: feeItem.name,
      amount: `₹${feeItem.amount}`,
      amountNum: feeItem.amount,
      feeAmount: String(feeItem.amount),
      date: receiptDate,
      paymentMode: feeItem.paymentMode || 'UPI / Online',
      refNo:
        feeItem.paymentRecord?.refNo ||
        feeItem.paymentRecord?.ref_no ||
        `UPI-${cleanId}8921`,
      status: 'Verified',
      verifiedBy: 'Super Admin',
      contactNumber: student?.phone || student?.contactNumber || '98652 19131',
    };

    setSelectedReceipt(receiptObj);
  };

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

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText('bsel@okaxis');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      setFeePaymentError(
        'Unable to copy UPI ID. Please copy manually: bsel@okaxis'
      );
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
    const transactionId = `SIM-${prefix}-${Math.floor(
      10000000 + Math.random() * 90000000
    )}`;

    setTimeout(() => {
      setPaymentGatewayStatus('success');
      setGatewayTransactionId(transactionId);
    }, 1200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeePaymentError('');
    setFeePaymentNotice('');

    const amount = Number(feePayment.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeePaymentError('Enter a valid fee amount greater than zero.');
      return;
    }
    if (feePayment.paymentMode !== 'UPI / QR Code') {
      setFeePaymentError(
        'Card and net-banking are simulated here. Use UPI to submit payment.'
      );
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
        payerName: displayName,
        studentId: String(studentId),
        branch: studentBranch,
        sector: selectedFeeType,
        program: feePayment.program.trim() || selectedFeeType,
        amount: `₹${amount}`,
        amountNum: amount,
        paymentMode: feePayment.paymentMode,
        refNo: feePayment.refNo?.trim() || `UPI-SCAN-${Date.now().toString().slice(-6)}`,
        date: paymentDate,
        status: 'Verified',
        verifiedBy: 'Super Admin',
        notes: feePayment.program.trim(),
      };

      let createdPayment = null;
      try {
        createdPayment = await api.payments.create(paymentRecord);
      } catch {
        // local storage fallback
      }

      addStoredPayment(createdPayment || paymentRecord);

      const receiptNo =
        createdPayment?.receiptNo ||
        createdPayment?.receipt_no ||
        createdPayment?.id ||
        `RCPT-${Date.now().toString().slice(-5)}`;

      const finalSubmitted = {
        ...paymentRecord,
        receiptNo,
      };

      setSubmittedPayment(finalSubmitted);

      // Update fee status in overview
      const updatedFees = fees.map((item) => {
        if (
          item.name.toLowerCase() === selectedFeeType.toLowerCase() ||
          item.id === selectedFeeType.toLowerCase()
        ) {
          return {
            ...item,
            amount: amount || item.amount,
            status: 'Paid',
            receiptNo,
            paidDate: paymentDate,
            paymentMode: feePayment.paymentMode,
            paymentRecord: finalSubmitted,
          };
        }
        return item;
      });

      updateFeesState(updatedFees);

      try {
        window.dispatchEvent(new Event('bsel_payments_updated'));
        window.dispatchEvent(new Event('storage'));
      } catch {}

      setFeePayment({
        amount: '',
        paymentMode: 'UPI / QR Code',
        refNo: '',
        program: '',
      });
      setPaymentGatewayStatus('idle');
      setGatewayTransactionId('');
      setFeePaymentNotice(
        `Payment submitted successfully (Receipt No: ${receiptNo}). Your fee status has been updated to Paid.`
      );
    } catch (paymentError) {
      setFeePaymentError(
        paymentError?.message ||
          'Unable to submit payment details. Please try again.'
      );
    } finally {
      setSubmittingFeePayment(false);
    }
  };

  const upiAmount = Number(feePayment.amount) || 0;
  const upiPayload = `upi://pay?pa=bsel@okaxis&pn=BSEL%20Educational%20Board&am=${upiAmount.toFixed(
    2
  )}&cu=INR&tn=${encodeURIComponent(`${selectedFeeType} Fee`)}`;
  const paymentModes = [
    'UPI / QR Code',
    'Debit / Credit Card',
    'Net Banking (IMPS/NEFT)',
  ];

  // Helper map for icons
  const iconMap = {
    monthly: BookOpen,
    exam: GraduationCap,
    event: Sun,
    book: FileText,
    franchise: Handshake,
  };

  return (
    <>
      {/* FEE OVERVIEW CARD - 2 COLUMNS LAYOUT */}
      <section className="mx-auto mb-6 w-full max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-100/90 bg-white p-5 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] sm:p-7">
          {/* Welcome Pill */}
          <div className="mb-5 flex justify-center">
            <div className="w-full max-w-xs rounded-2xl border border-blue-50/80 bg-[#F6F9FD] py-2.5 px-6 text-center shadow-[0_2px_10px_rgba(15,43,92,0.04)]">
              <span className="text-sm font-bold text-[#1E3A8A] sm:text-base">
                Welcome, {displayName}!
              </span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3
                className="text-xl font-bold tracking-tight text-[#14294b] sm:text-2xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Your Fee Overview
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Select any fee to pay online or view official receipt
              </p>
            </div>
            {onOpenReceipts && (
              <button
                type="button"
                onClick={onOpenReceipts}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs"
              >
                <Receipt className="h-4 w-4 text-emerald-600" />
                <span>Receipts / Bills</span>
              </button>
            )}
          </div>

          {/* 2-Columns Grid of 4 Core Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {fees.map((fee) => {
              const IconComp = iconMap[fee.id] || BookOpen;
              const isPaid = fee.status === 'Paid';

              return (
                <div
                  key={fee.id || fee.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#FAFCFF] hover:bg-[#F3F7FD] p-3.5 sm:p-4 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                >
                  {/* Left: Icon + Title & Amount */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF5FF] text-[#2563EB]">
                      <IconComp className="h-5 w-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 tracking-tight truncate">
                        {fee.name}
                      </p>
                      <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-slate-900">
                        ₹{fee.amount}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status + Button */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <span
                      className={`text-xs font-semibold sm:text-sm ${
                        isPaid ? 'text-[#16A34A]' : 'text-[#C87533]'
                      }`}
                    >
                      {fee.status}
                    </span>

                    {isPaid ? (
                      <button
                        type="button"
                        onClick={() => handleViewReceipt(fee)}
                        className="rounded-full bg-[#C87533] hover:bg-[#B5672B] active:scale-95 text-white font-semibold text-xs px-3.5 sm:px-4 py-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        View Receipt
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePayNow(fee)}
                        className="rounded-full bg-[#C87533] hover:bg-[#B5672B] active:scale-95 text-white font-semibold text-xs px-3.5 sm:px-4 py-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* BIG OTHER FEE BUTTON */}
          <div className="mt-4 sm:mt-5">
            <button
              type="button"
              onClick={() => handleOpenCustomPay('Other Fee')}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#C87533] hover:bg-[#B5672B] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
              <span>Other Fee</span>
            </button>
          </div>
        </div>
      </section>

      {/* PAYMENT MODAL */}
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
              feePaymentNotice ? 'max-w-2xl' : 'max-w-xl'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 bg-blue-950 px-4 py-4 text-white sm:px-5">
              <div>
                <h2
                  id="student-fee-payment-title"
                  className="text-base font-black text-white sm:text-lg"
                >
                  {feePaymentNotice
                    ? 'Payment Submission'
                    : `${selectedFeeType} Payment`}
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
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              {feePaymentNotice ? (
                /* Success Acknowledgement View */
                <div
                  role="status"
                  className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 p-3 sm:p-5"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg ring-8 ring-emerald-50 sm:h-16 sm:w-16">
                      <Check className="h-7 w-7 stroke-[3] sm:h-8 sm:w-8" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-[10px] font-bold tracking-wide text-emerald-800 sm:text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      PAYMENT SUBMITTED SUCCESSFULLY
                    </span>
                    <h3 className="mt-2.5 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      Thank you, {displayName}!
                    </h3>
                    <p className="mt-1 max-w-lg text-xs font-medium text-slate-600 sm:text-[13px]">
                      Your{' '}
                      <strong className="font-bold text-slate-900">
                        {submittedPayment?.sector}
                      </strong>{' '}
                      payment has been recorded and updated to Paid.
                    </p>
                  </div>

                  <div className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xs sm:p-5">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {studentPhoto ? (
                          <img
                            src={studentPhoto}
                            alt={displayName}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-sky-500/30 sm:h-14 sm:w-14"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400 sm:h-14 sm:w-14">
                            <UserRound className="h-6 w-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900 sm:text-base">
                            {displayName}
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
                        </div>
                        <span className="shrink-0 font-mono text-xs font-bold text-slate-700">
                          {submittedPayment?.amount}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Branch
                        </span>
                        <strong className="mt-0.5 block truncate text-xs font-extrabold text-slate-900">
                          {studentBranch}
                        </strong>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Payment Method
                        </span>
                        <strong className="mt-0.5 block truncate text-xs font-extrabold text-slate-900">
                          {submittedPayment?.paymentMode}
                        </strong>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </span>
                        <strong className="mt-0.5 block text-xs font-extrabold text-emerald-700">
                          Paid
                        </strong>
                      </div>
                      {submittedPayment?.receiptNo && (
                        <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 sm:col-span-3">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Receipt No.
                          </span>
                          <strong className="mt-0.5 block truncate font-mono text-xs font-extrabold text-slate-900">
                            {submittedPayment.receiptNo}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        closePaymentPopup();
                        handleViewReceipt({
                          name: submittedPayment?.sector,
                          amount: submittedPayment?.amountNum,
                          receiptNo: submittedPayment?.receiptNo,
                          paidDate: submittedPayment?.date,
                          paymentMode: submittedPayment?.paymentMode,
                          paymentRecord: submittedPayment,
                        });
                      }}
                      className="rounded-xl bg-[#C87533] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#B5672B] cursor-pointer"
                    >
                      View Receipt Now
                    </button>
                    {onOpenReceipts && (
                      <button
                        type="button"
                        onClick={() => {
                          closePaymentPopup();
                          onOpenReceipts();
                        }}
                        className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 cursor-pointer"
                      >
                        Open Receipts / Bills
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={closePaymentPopup}
                      className="rounded-xl bg-[#0F2B5C] px-6 py-2.5 text-xs font-black text-white transition hover:bg-[#18458F] cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Form */
                <>
                  {feePaymentError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
                    >
                      {feePaymentError}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Fee Type
                      </label>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-800">
                        {selectedFeeType}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="fee-amount"
                        className="mb-1.5 block text-xs font-bold text-slate-700"
                      >
                        Amount (₹)
                      </label>
                      <input
                        id="fee-amount"
                        name="amount"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={feePayment.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {paymentModes.map((paymentMode) => (
                          <button
                            key={paymentMode}
                            type="button"
                            onClick={() => selectPaymentMode(paymentMode)}
                            aria-pressed={feePayment.paymentMode === paymentMode}
                            className={`rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
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
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
                                upiPayload
                              )}`}
                              alt={`UPI payment QR for ${selectedFeeType}`}
                              className="h-36 w-36 rounded-lg border border-slate-200 p-1"
                            />
                          ) : (
                            <div className="flex h-36 w-36 items-center justify-center rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                              Enter an amount to create the UPI QR
                            </div>
                          )}
                          <div className="w-full min-w-0">
                            <h3 className="text-sm font-extrabold text-slate-900">
                              Pay with UPI
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              Scan the QR code with any UPI app to pay the fee amount directly.
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                              <div>
                                <span className="block text-[10px] font-bold uppercase text-slate-500">
                                  B★SEL UPI ID
                                </span>
                                <span className="font-mono text-sm font-black text-slate-900">
                                  bsel@okaxis
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                              >
                                {copiedUpi ? 'Copied' : 'Copy UPI ID'}
                              </button>
                            </div>
                            {upiAmount > 0 && (
                              <a
                                href={upiPayload}
                                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700 sm:hidden"
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
                          <p className="mt-5 font-mono text-sm tracking-widest">
                            •••• •••• •••• ••••
                          </p>
                          <p className="mt-3 text-[10px] text-blue-100">
                            Simulated card checkout — card details are not requested.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSimulateGatewayPayment}
                          disabled={paymentGatewayStatus === 'processing'}
                          className="mt-3 w-full rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 cursor-pointer"
                        >
                          {paymentGatewayStatus === 'processing'
                            ? 'Processing simulation…'
                            : `Simulate Card Payment · ₹${upiAmount || 0}`}
                        </button>
                      </div>
                    )}

                    {feePayment.paymentMode ===
                      'Net Banking (IMPS/NEFT)' && (
                      <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3">
                        <label className="mb-2 block text-xs font-bold text-slate-700">
                          Select bank
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {[
                            'State Bank of India',
                            'HDFC Bank',
                            'ICICI Bank',
                            'Axis Bank',
                            'Kotak Mahindra',
                            'Canara Bank',
                          ].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              aria-pressed={selectedBank === bank}
                              className={`rounded-lg border p-2 text-xs font-bold cursor-pointer ${
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
                          className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                        >
                          {paymentGatewayStatus === 'processing'
                            ? `Connecting to ${selectedBank}…`
                            : `Simulate ${selectedBank} Payment · ₹${
                                upiAmount || 0
                              }`}
                        </button>
                      </div>
                    )}

                    {paymentGatewayStatus === 'success' && (
                      <div
                        role="status"
                        className="sm:col-span-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-900"
                      >
                        <p className="text-sm font-black">
                          Payment simulation approved — no money was charged.
                        </p>
                        <p className="mt-1 text-xs">
                          Simulation transaction ID:{' '}
                          <span className="font-mono font-bold">
                            {gatewayTransactionId}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="fee-purpose"
                        className="mb-1.5 block text-xs font-bold text-slate-700"
                      >
                        Details / Note (optional)
                      </label>
                      <input
                        id="fee-purpose"
                        name="program"
                        type="text"
                        value={feePayment.program}
                        onChange={handleChange}
                        placeholder="Month, exam, event details"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={closePaymentPopup}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          submittingFeePayment ||
                          feePayment.paymentMode !== 'UPI / QR Code'
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4" />
                        {submittingFeePayment ? 'Submitting...' : 'Submit Payment'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT VIEWER MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6 relative">
            <BselReceipt
              receipt={selectedReceipt}
              onClose={() => setSelectedReceipt(null)}
              width={1120}
              showPrint={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
