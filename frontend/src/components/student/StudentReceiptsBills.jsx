import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Printer, Receipt, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { getStoredPayments } from '../../data/paymentsData';
import StudentReceiptView from '../StudentReceiptView';

const getStudentId = (student) =>
  String(
    student?.userId ||
      student?.id ||
      student?.studentId ||
      student?.phone ||
      ''
  )
    .trim()
    .toLowerCase();

const getPaymentStudentId = (payment) =>
  String(payment?.studentId || payment?.student_id || '')
    .trim()
    .toLowerCase();

const getPaymentStatus = (payment) =>
  String(payment?.status || 'Pending Verification');

const getDisplayPaymentStatus = (payment) =>
  /pending/i.test(getPaymentStatus(payment))
    ? 'Submitted'
    : getPaymentStatus(payment);

const getPaymentKey = (payment) =>
  String(
    payment?.id ||
      payment?.receiptNo ||
      payment?.receipt_no ||
      ''
  );

const isVerifiedPayment = (payment) =>
  /verified|paid|complete|success/i.test(getPaymentStatus(payment));

const mergePaymentSources = (serverPayments, storedPayments) => {
  const storedByKey = new Map(
    storedPayments
      .map((payment) => [getPaymentKey(payment), payment])
      .filter(([key]) => key)
  );
  const serverKeys = new Set(serverPayments.map(getPaymentKey).filter(Boolean));

  const mergedServerPayments = serverPayments.map((payment) => {
    const storedPayment = storedByKey.get(getPaymentKey(payment));
    if (!storedPayment) return payment;

    const storedStatus = getPaymentStatus(storedPayment).toLowerCase();
    const hasLocalStatusUpdate = ![
      'pending',
      'pending verification',
    ].includes(storedStatus);

    return hasLocalStatusUpdate
      ? {
          ...payment,
          status: storedPayment.status,
          verifiedBy:
            storedPayment.verifiedBy ||
            storedPayment.verified_by ||
            payment.verifiedBy ||
            payment.verified_by,
        }
      : payment;
  });

  const localOnlyPayments = storedPayments.filter(
    (payment) => !serverKeys.has(getPaymentKey(payment))
  );

  return [...mergedServerPayments, ...localOnlyPayments];
};

const getReceiptData = (payment, student) => {
  const selectedCourses =
    Array.isArray(student?.selectedCourses) && student.selectedCourses.length
      ? student.selectedCourses
      : Array.isArray(student?.courses)
        ? student.courses
        : [];
  const courseName =
    selectedCourses.map((course) => course.courseName || course.name).filter(Boolean).join(' & ') ||
    student?.courseName ||
    student?.program ||
    student?.course ||
    payment.program ||
    payment.sector ||
    'Course Fee';
  const batchLevel =
    selectedCourses.map((course) => course.level).filter(Boolean).join(' | ') ||
    student?.courseLevel ||
    student?.level ||
    student?.grade ||
    'Level unavailable';
  const registerNumber =
    student?.registerNumber ||
    student?.registrationNo ||
    student?.registerNumbers?.[0] ||
    student?.userId ||
    student?.id ||
    '';

  return {
    ...student,
    feeType:
      payment.sector ||
      payment.feeType ||
      payment.fee_type ||
      'Course Fee',
    studentName:
      payment.payerName ||
      payment.payer_name ||
      student?.name ||
      student?.studentName ||
      student?.fullName ||
      'Student',
    program: courseName,
    courseName,
    grade: batchLevel,
    courseLevel: batchLevel,
    registerNumber,
    registrationNo: registerNumber,
    receiptRefNo:
      payment.receiptNo || payment.receipt_no || payment.id || '',
    date: payment.date || payment.createdAt || payment.created_at || '',
    enrolmentDate: payment.date || payment.createdAt || payment.created_at || '',
    feeAmount:
      payment.amount || payment.amountNum || payment.amount_num || '',
    selectedCourses: [],
    courses: [],
  };
};

export default function StudentReceiptsBills({ student }) {
  const studentId = getStudentId(student);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    let active = true;

    const loadPayments = async () => {
      if (!studentId) {
        setPayments([]);
        setLoading(false);
        setLoadError('Your student ID is unavailable. Please contact your branch.');
        return;
      }

      setLoading(true);
      setLoadError('');

      try {
        const allPayments = await api.payments.getAll();
        const paymentsWithLocalUpdates = mergePaymentSources(
          allPayments,
          getStoredPayments()
        );
        if (!active) return;

        const studentPayments = paymentsWithLocalUpdates
          .filter((payment) => getPaymentStudentId(payment) === studentId)
          .sort((first, second) => {
            const firstDate = new Date(
              first.createdAt || first.created_at || first.date || 0
            ).getTime();
            const secondDate = new Date(
              second.createdAt || second.created_at || second.date || 0
            ).getTime();
            return secondDate - firstDate;
          });

        setPayments(studentPayments);
      } catch (error) {
        if (active) {
          setLoadError(
            error?.message || 'Unable to load your receipts. Please try again.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPayments();
    window.addEventListener('bsel_payments_updated', loadPayments);

    return () => {
      active = false;
      window.removeEventListener('bsel_payments_updated', loadPayments);
    };
  }, [studentId]);

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-blue-950 sm:text-lg">
              Receipts / Bills
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Your submitted fee payments and receipts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('bsel_payments_updated'))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-900"
            aria-label="Refresh receipts"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {loadError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
          >
            {loadError}
          </div>
        )}

        {loading ? (
          <p role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Loading receipts...
          </p>
        ) : !loadError && payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <Receipt className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-bold text-slate-700">
              No fee payments yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Submitted payment receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment, index) => {
              const verified = isVerifiedPayment(payment);
              const receiptData = getReceiptData(payment, student);
              const paymentKey =
                payment.id ||
                payment.receiptNo ||
                payment.receipt_no ||
                `${payment.sector || 'fee'}-${index}`;

              return (
                <article
                  key={paymentKey}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-extrabold text-slate-900">
                        {payment.sector || payment.program || 'Fee Payment'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {payment.date || payment.createdAt || payment.created_at || 'Date unavailable'}
                        {payment.receiptNo || payment.receipt_no
                          ? ` · Receipt ${payment.receiptNo || payment.receipt_no}`
                          : ''}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <p className="text-sm font-black text-emerald-800">
                        {payment.amount ||
                          `₹${payment.amountNum || payment.amount_num || 0}`}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          verified
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {verified ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock3 className="h-3 w-3" />
                        )}
                        {getDisplayPaymentStatus(payment)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-600">
                      {payment.paymentMode || payment.payment_mode || 'Payment method unavailable'}
                      {(payment.refNo || payment.ref_no) &&
                        ` · Ref: ${payment.refNo || payment.ref_no}`}
                    </p>
                    {verified ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(receiptData)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-900 transition hover:bg-blue-100"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        View / Print Receipt
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReceipt({
                            ...receiptData,
                            paymentAcknowledgement: true,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        View Acknowledgement
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedReceipt && (
        <StudentReceiptView
          student={selectedReceipt}
          acknowledgement={Boolean(selectedReceipt.paymentAcknowledgement)}
          onClose={() => setSelectedReceipt(null)}
          backLabel="Back to Receipts / Bills"
        />
      )}
    </>
  );
}
