// Central Payment Sectors & Financial Management for B★SEL
export const DEFAULT_PAYMENTS = [
  {
    id: 'TXN-2026-9041',
    receiptNo: 'RCPT-TN-84910',
    payerName: 'Arjun Subramanian',
    studentId: 'BSEL-STU-784201',
    branch: 'Chennai Central Branch',
    sector: 'Course Tuition',
    program: 'Abacus Speed Arithmetic',
    amount: '₹450',
    amountNum: 450,
    paymentMode: 'UPI / GPay',
    refNo: 'UPI-940128472910',
    date: '15 Jan 2026',
    status: 'Verified',
    verifiedBy: 'Finance Desk',
    notes: 'Level 4 regular batch tuition fee'
  },
  {
    id: 'TXN-2026-9042',
    receiptNo: 'RCPT-TSI-84911',
    payerName: 'sivaji',
    studentId: 'BSEL-TSI-9865219131',
    branch: 'Tenkasi Regional Branch',
    sector: 'Course Tuition',
    program: 'Abacus (Level 1)',
    amount: '₹450',
    amountNum: 450,
    paymentMode: 'UPI / QR Code',
    refNo: 'UPI-849201934812',
    date: '05 Oct 2026',
    status: 'Verified',
    verifiedBy: 'Tenkasi Branch Head',
    notes: 'Level 1 admission and exam fee'
  },
  {
    id: 'TXN-2026-9043',
    receiptNo: 'RCPT-TSI-84912',
    payerName: 'Kavya Maran',
    studentId: 'BSEL-TSI-9442188771',
    branch: 'Tenkasi Regional Branch',
    sector: 'Course Tuition',
    program: 'Drawing & Fine Arts',
    amount: '₹400',
    amountNum: 400,
    paymentMode: 'Cash at Centre',
    refNo: 'CASH-REC-TSI-044',
    date: '20 Jan 2026',
    status: 'Verified',
    verifiedBy: 'Tenkasi Branch Head',
    notes: 'Term 1 arts fee with colors kit'
  },
  {
    id: 'TXN-2026-9044',
    receiptNo: 'RCPT-CBE-84913',
    payerName: 'Dharun Kumar',
    studentId: 'BSEL-CBE-9443322110',
    branch: 'Coimbatore Branch',
    sector: 'Course Tuition',
    program: 'Python for Young Coders',
    amount: '₹650',
    amountNum: 650,
    paymentMode: 'UPI / PhonePe',
    refNo: 'UPI-392019482019',
    date: '18 Jan 2026',
    status: 'Verified',
    verifiedBy: 'Finance Desk',
    notes: 'Python foundation term enrollment'
  },
  {
    id: 'TXN-2026-9045',
    receiptNo: 'RCPT-EVT-84914',
    payerName: 'Deepak Rajan',
    studentId: 'BSEL-CHN-9840192834',
    branch: 'Chennai Central Branch',
    sector: 'Competition & Events',
    program: 'Number Ninjas State Championship',
    amount: '₹450',
    amountNum: 450,
    paymentMode: 'UPI / GPay',
    refNo: 'UPI-119284719203',
    date: '28 Jan 2026',
    status: 'Pending Verification',
    verifiedBy: 'Pending',
    notes: 'Event registration hall ticket pending'
  },
  {
    id: 'TXN-2026-9046',
    receiptNo: 'RCPT-FRN-84915',
    payerName: 'Mrs. Thangam Sivaji',
    studentId: 'BSEL-FRN-620185',
    branch: 'Tenkasi Regional Branch',
    sector: 'Franchise Affiliation',
    program: 'Regional Academy License & Branding',
    amount: '₹25,000',
    amountNum: 25000,
    paymentMode: 'NEFT / Bank Transfer',
    refNo: 'NEFT-SBI-49201948',
    date: '01 Jan 2026',
    status: 'Verified',
    verifiedBy: 'Super Admin',
    notes: 'Annual franchise affiliation fee & master teacher kit'
  },
  {
    id: 'TXN-2026-9047',
    receiptNo: 'RCPT-KIT-84916',
    payerName: 'Vidya Mandir School Co-op',
    studentId: 'BSEL-CTR-101',
    branch: 'Chennai Central Branch',
    sector: 'Toolkits & Courseware',
    program: 'Bulk 17-Rod Abacus Kits & Workbooks (50 units)',
    amount: '₹12,500',
    amountNum: 12500,
    paymentMode: 'Cheque / DD',
    refNo: 'CHQ-HDFC-991823',
    date: '12 Jan 2026',
    status: 'Verified',
    verifiedBy: 'Logistics Desk',
    notes: 'Courseware kit dispatch completed'
  },
  {
    id: 'TXN-2026-9048',
    receiptNo: 'RCPT-EVT-84917',
    payerName: 'Ananya Ramesh',
    studentId: 'BSEL-TNV-9442918273',
    branch: 'Tenkasi Regional Branch',
    sector: 'Competition & Events',
    program: 'Little Picassos Art Olympiad',
    amount: '₹400',
    amountNum: 400,
    paymentMode: 'UPI / Paytm',
    refNo: 'UPI-556102938475',
    date: '29 Jan 2026',
    status: 'Verified',
    verifiedBy: 'Tenkasi Branch Head',
    notes: 'Hall B drawing seat confirmed'
  }
];

export const getStoredPayments = () => {
  if (typeof window === 'undefined') return DEFAULT_PAYMENTS;
  try {
    const raw = localStorage.getItem('bsel_payment_records');
    if (!raw) {
      localStorage.setItem('bsel_payment_records', JSON.stringify(DEFAULT_PAYMENTS));
      return DEFAULT_PAYMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PAYMENTS;
  } catch {
    return DEFAULT_PAYMENTS;
  }
};

export const saveStoredPayments = (payments) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bsel_payment_records', JSON.stringify(payments));
      window.dispatchEvent(new Event('bsel_payments_updated'));
    } catch (err) {
      console.error('Error saving payments:', err);
    }
  }
  return payments;
};

export const addStoredPayment = (newPayment) => {
  const payments = getStoredPayments();
  const id = newPayment.id || `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const receiptNo = newPayment.receiptNo || `RCPT-${Date.now().toString().slice(-5)}`;
  const amountStr = String(newPayment.amount || '450');
  const amountNum = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0;

  const paymentRecord = {
    ...newPayment,
    id,
    receiptNo,
    amount: amountStr.startsWith('₹') ? amountStr : `₹${amountStr}`,
    amountNum,
    date: newPayment.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: newPayment.status || 'Verified',
    verifiedBy: newPayment.verifiedBy || 'Admin Desk'
  };

  const updated = [paymentRecord, ...payments];
  saveStoredPayments(updated);
  return updated;
};

export const updatePaymentStatus = (id, newStatus, verifiedBy = 'Super Admin') => {
  const payments = getStoredPayments();
  const index = payments.findIndex(p => p.id === id);
  if (index === -1) return payments;

  payments[index] = {
    ...payments[index],
    status: newStatus,
    verifiedBy: verifiedBy
  };

  saveStoredPayments(payments);
  return payments;
};

export const deletePayment = (id) => {
  const payments = getStoredPayments();
  const updated = payments.filter(p => p.id !== id);
  saveStoredPayments(updated);
  return updated;
};
