// Central Payment Sectors & Financial Management for B★SEL
export const DEFAULT_PAYMENTS = [
  {
    id: 'TXN-2026-9045',
    receiptNo: 'RCPT-EVT-84914',
    payerName: 'Deepak Rajan',
    studentId: 'BSEL-9840192834',
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
    studentId: 'BSEL-9442918273',
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
    const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PAYMENTS;
    const oldIdsToRemove = new Set([
      'bsel-9865219131',
      'bsel-9442188771',
      'bsel-9840123456',
      'bsel-9443322110',
      'sch-coord-101'
    ]);
    const oldNamesToRemove = new Set([
      'sivaji',
      'kavya maran',
      'arjun subramanian',
      'dharun kumar'
    ]);
    const cleaned = list.filter(p => {
      if (!p) return false;
      const lowerId = (p.studentId || '').toLowerCase();
      const lowerName = (p.payerName || '').trim().toLowerCase();
      if (oldIdsToRemove.has(lowerId)) return false;
      if (oldNamesToRemove.has(lowerName)) return false;
      return true;
    });
    if (cleaned.length !== list.length) {
      try {
        localStorage.setItem('bsel_payment_records', JSON.stringify(cleaned));
      } catch {}
    }
    return cleaned;
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
