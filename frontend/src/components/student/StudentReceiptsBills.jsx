import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Receipt, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { getStoredPayments } from '../../data/paymentsData';
import StudentReceiptView from '../StudentReceiptView';
import BselReceipt from '../admin/BselReceipt';

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
    receiptNo:
      payment.receiptNo ||
      payment.receipt_no ||
      payment.id ||
      '',
    parentName:
      student?.parentName ||
      student?.fatherName ||
      student?.guardianName ||
      '',
    school:
      student?.branch ||
      student?.institution ||
      student?.school ||
      '',
    standard:
      student?.studentClass ||
      student?.grade ||
      student?.classGrade ||
      '',
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
    amount:
      payment.amount ||
      `₹${payment.amountNum || payment.amount_num || 0}`,
    feeAmount:
      payment.amount || payment.amountNum || payment.amount_num || '',
    paymentMode: payment.paymentMode || payment.payment_mode || '',
    refNo: payment.refNo || payment.ref_no || '',
    verifiedBy: payment.verifiedBy || payment.verified_by || '',
    contactNumber: student?.phone || student?.contactNumber || '',
    selectedCourses: [],
    courses: [],
  };
};

const matchesStudentPayment = (payment, student) => {
  if (!payment || !student) return false;

  const paymentStudentId = String(
    payment.studentId || payment.student_id || ''
  )
    .trim()
    .toLowerCase();
  const paymentPayerName = String(
    payment.payerName || payment.payer_name || payment.studentName || ''
  )
    .trim()
    .toLowerCase();

  const studentIdentifiers = [
    student.userId,
    student.id,
    student.studentId,
    student.phone,
    student.mobile,
    student.registerNumber,
    student.registrationNo,
  ]
    .filter(Boolean)
    .map((s) => String(s).trim().toLowerCase());

  // Direct ID match
  if (paymentStudentId && studentIdentifiers.includes(paymentStudentId)) {
    return true;
  }

  // Digits only match (e.g. 1326, 9865219131)
  const pDigits = paymentStudentId.replace(/\D/g, '');
  if (
    pDigits &&
    studentIdentifiers.some((id) => id.replace(/\D/g, '') === pDigits)
  ) {
    return true;
  }

  // Strip prefixes (e.g. bsel-, demo-stu-)
  const cleanPId = paymentStudentId.replace(/^(bsel|demo-stu|stu)-?/i, '');
  if (
    cleanPId &&
    studentIdentifiers.some(
      (id) => id.replace(/^(bsel|demo-stu|stu)-?/i, '') === cleanPId
    )
  ) {
    return true;
  }

  // Name match
  const studentNames = [
    student.name,
    student.studentName,
    student.fullName,
  ]
    .filter(Boolean)
    .map((s) => String(s).trim().toLowerCase());

  if (paymentPayerName && studentNames.includes(paymentPayerName)) {
    return true;
  }

  return false;
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
      if (!studentId && !student?.name && !student?.studentName) {
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

        const studentPayments = paymentsWithLocalUpdates.filter((payment) =>
          matchesStudentPayment(payment, student)
        );

        // Include initial verified fees (Exam Fee, Book Fee) or saved fees if not in payments list yet
        const cleanId =
          String(studentId).replace(/\D/g, '').slice(-5) || '1326';
        let savedFees = [];
        try {
          const rawSaved = localStorage.getItem(`bsel_student_fees_${studentId}`);
          if (rawSaved) savedFees = JSON.parse(rawSaved);
        } catch {}

        const defaultPaidFees = [
          { name: 'Exam Fee', amount: '₹500', amountNum: 500, id: 'exam' },
          { name: 'Book Fee', amount: '₹700', amountNum: 700, id: 'book' },
        ];

        const allStudentPayments = [...studentPayments];
        defaultPaidFees.forEach((defaultFee) => {
          const feeStatus = savedFees.find(
            (f) => f.name === defaultFee.name || f.id === defaultFee.id
          );
          const isPaid = feeStatus ? feeStatus.status === 'Paid' : true;

          const alreadyExists = allStudentPayments.some((p) =>
            String(p.sector || p.program || '')
              .toLowerCase()
              .includes(defaultFee.name.toLowerCase())
          );

          if (isPaid && !alreadyExists) {
            allStudentPayments.push({
              id: `DEFAULT-${defaultFee.id.toUpperCase()}-${cleanId}`,
              receiptNo: `RCPT-${defaultFee.id.toUpperCase()}-${cleanId}`,
              payerName:
                student?.name ||
                student?.studentName ||
                student?.fullName ||
                'Demo 1326',
              studentId: String(student?.userId || student?.id || studentId),
              sector: defaultFee.name,
              program:
                defaultFee.name === 'Exam Fee'
                  ? 'Abacus Examination Fee'
                  : 'Academic Books & Material',
              amount: defaultFee.amount,
              amountNum: defaultFee.amountNum,
              date: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              paymentMode: 'UPI / Online',
              status: 'Verified',
              verifiedBy: 'Super Admin',
            });
          }
        });

        allStudentPayments.sort((first, second) => {
          const firstDate = new Date(
            first.createdAt || first.created_at || first.date || 0
          ).getTime();
          const secondDate = new Date(
            second.createdAt || second.created_at || second.date || 0
          ).getTime();
          return secondDate - firstDate;
        });

        setPayments(allStudentPayments);
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
    window.addEventListener('storage', loadPayments);

    return () => {
      active = false;
      window.removeEventListener('bsel_payments_updated', loadPayments);
      window.removeEventListener('storage', loadPayments);
    };
  }, [studentId, student]);

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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-900 transition hover:bg-blue-100 cursor-pointer"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        View Receipt
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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100 cursor-pointer"
                      >
                        <Receipt className="h-3.5 w-3.5" />
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
        selectedReceipt.paymentAcknowledgement ? (
          <StudentReceiptView
            student={selectedReceipt}
            acknowledgement
            onClose={() => setSelectedReceipt(null)}
            backLabel="Back to Receipts / Bills"
            showPrint={false}
          />
        ) : (
          <div className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
              <BselReceipt
                receipt={selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                width={1120}
                showPrint={false}
              />
            </div>
          </div>
        )
      )}
    </>
  );
}
