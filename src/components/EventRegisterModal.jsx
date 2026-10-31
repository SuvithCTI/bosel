import React, { useState, useEffect } from 'react';
import {
  X,
  Ticket,
  Calendar,
  MapPin,
  Award,
  ArrowLeft,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';

import Certificate from './Certificate';

export default function EventRegisterModal({ event, onClose }) {
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    parentName: '',
    phone: '',
    email: '',
    schoolName: '',
    city: '',
    levelCategory: 'Level 1 (Sub-Junior / Age 5-7)',
    acceptTerms: true,
  });

  const [currentStep, setCurrentStep] = useState('form');
  const [ticketId, setTicketId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [studentPhoto, setStudentPhoto] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [simulateFailure, setSimulateFailure] = useState(false);

  const formattedLevel = formData.levelCategory.startsWith('Level')
    ? formData.levelCategory.split(' ').slice(0, 2).join(' ')
    : 'Level 1';

  const [todayFormatted] = useState(() =>
    new Date()
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-')
  );

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [event]);

  if (!event) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const generatedId = `BSEL-${event.category
      .substring(0, 3)
      .toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    setTicketId(generatedId);
    setCurrentStep('payment');
  };

  const handleProcessPayment = () => {
    setCurrentStep('processing');

    const generatedTxn = `TXN-UPI-${Math.floor(
      10000000 + Math.random() * 90000000
    )}`;

    setTxnId(generatedTxn);

    setTimeout(() => {
      if (simulateFailure) {
        setCurrentStep('payment_failed');
      } else {
        const registeredStudent = {
          studentName: formData.studentName,
          courseName: event.category || 'Abacus',
          programPrefix: 'MINDSPARC',
          level: formattedLevel,
          grade: 'A',
          duration: '6 Months',
          registrationNo: ticketId,
          certificateNo: `BSEL/${(
            event.category || 'ABACUS'
          ).toUpperCase()}/L1/${
            ticketId.replace(/\D/g, '').slice(-4) || '1024'
          }`,
          centreName: formData.schoolName || 'test branch',
          centreCode: '546454',
          centreAddress: `${formData.city || 'Tenkasi'}, Tamil Nadu`,
          issueDate: todayFormatted,
          certificateType: 'COMPETITION',
          studentPhoto,
          transactionId: generatedTxn,
          feePaid: event.fee,
        };

        try {
          localStorage.setItem(
            'bsel_registered_student',
            JSON.stringify(registeredStudent)
          );
        } catch {
          // Ignore localStorage errors
        }

        setCurrentStep('payment_success');
      }
    }, 1600);
  };

  const updateForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputClass =
    'w-full h-10 sm:h-10 px-3 text-sm text-slate-950 font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition';

  const labelClass =
    'block text-[11px] sm:text-xs font-bold text-slate-800 mb-1';

  const isPaymentStep = [
    'payment',
    'processing',
    'payment_failed',
    'payment_success',
  ].includes(currentStep);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col w-full h-[100dvh] sm:h-auto sm:max-h-[94dvh] bg-white rounded-none sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 ${
          currentStep === 'certificate'
            ? 'max-w-5xl'
            : currentStep === 'payment'
            ? 'max-w-2xl'
            : 'max-w-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="bg-[#0F2B5C] text-white px-3.5 py-3 sm:px-5 sm:py-4 shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              <Ticket className="w-3.5 h-3.5 text-amber-400 shrink-0" />

              <span>
                {isPaymentStep
                  ? 'Secure Payment'
                  : currentStep === 'certificate'
                  ? 'Official Certificate Issued'
                  : 'Event Registration Desk'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <h3 className="text-base sm:text-2xl font-black font-heading text-white leading-snug mt-2">
            {event.eventName}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-200 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 font-semibold">
                <MapPin className="w-3 h-3 text-sky-300 shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-none">
                  {event.place}
                </span>
              </span>

              <span>•</span>

              <span className="inline-flex items-center gap-1 font-semibold">
                <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
                <span>{event.date}</span>
              </span>
            </div>

            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-black text-[11px]">
              Fee: {event.fee}
            </span>
          </div>

          {/* Progress Bar */}

          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] font-bold">
            <div
              className={`flex items-center gap-1.5 ${
                currentStep === 'form'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                  currentStep === 'form'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {currentStep === 'form' ? '1' : '✓'}
              </span>
              <span>1. Details</span>
            </div>

            <div className="h-0.5 flex-1 mx-2 bg-white/20" />

            <div
              className={`flex items-center gap-1.5 ${
                isPaymentStep
                  ? 'text-amber-400'
                  : currentStep === 'certificate'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                  currentStep === 'certificate'
                    ? 'bg-emerald-500 text-white'
                    : isPaymentStep
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/20 text-white'
                }`}
              >
                {currentStep === 'certificate' ? '✓' : '2'}
              </span>
              <span>2. Payment</span>
            </div>

            <div className="h-0.5 flex-1 mx-2 bg-white/20" />

            <div
              className={`flex items-center gap-1.5 ${
                currentStep === 'certificate'
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                  currentStep === 'certificate'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/20 text-white'
                }`}
              >
                3
              </span>
              <span>3. Pass</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            BODY
            Registration: button stays pinned at bottom.
            Other steps: body scrolls normally.
        ====================================================== */}

        <div
          className={`flex-1 min-h-0 p-3 sm:p-5 ${
            currentStep === 'form'
              ? 'flex flex-col overflow-hidden'
              : 'overflow-y-auto overscroll-contain'
          }`}
        >
          {/* =====================================================
              STEP 1: REGISTRATION FORM
          ====================================================== */}

          {currentStep === 'form' && (
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col flex-1 min-h-0 gap-2"
            >
              {/* Scrollable form fields */}

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 space-y-2.5">
                <div className="bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-[11px] sm:text-xs text-sky-950 font-semibold leading-relaxed">
                  <span className="font-black text-sky-900">
                    Eligibility:
                  </span>{' '}
                  {event.eligibility}. Please ensure participant details match
                  school ID records.
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-700">
                    Student & Contact Details
                  </h4>

                  {/* Student Name + DOB */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={(e) =>
                          updateForm('studentName', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) =>
                          updateForm('dob', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Parent + Phone */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) =>
                          updateForm('parentName', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          updateForm('phone', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* School */}

                  <div>
                    <label className={labelClass}>
                      School / Academy Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={(e) =>
                        updateForm('schoolName', e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Level + City */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>
                        Competition Level
                      </label>
                      <select
                        value={formData.levelCategory}
                        onChange={(e) =>
                          updateForm('levelCategory', e.target.value)
                        }
                        className={inputClass}
                      >
                        <option>Level 1 (Sub-Junior / Age 5-7)</option>
                        <option>Level 2 (Junior / Age 8-10)</option>
                        <option>Level 3 (Senior / Age 11-13)</option>
                        <option>Level 4 (Super-Senior / Age 14+)</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Participant City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          updateForm('city', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Email field */}

                  <div>
                    <label className={labelClass}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        updateForm('email', e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Terms */}

                  <label className="flex items-start gap-2 pt-1 text-[10px] sm:text-[11px] text-slate-700 font-semibold cursor-pointer leading-relaxed">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) =>
                        updateForm('acceptTerms', e.target.checked)
                      }
                      className="rounded text-sky-600 focus:ring-sky-500 mt-0.5 shrink-0"
                      required
                    />

                    <span>
                      I confirm that the details provided are accurate and
                      agree to follow the official B★SEL competition code of
                      conduct and rules.
                    </span>
                  </label>
                </div>
              </div>

              {/* PINNED PROCEED BUTTON */}

              <div className="shrink-0 pt-2 border-t border-slate-200 bg-white">
                <button
                  type="submit"
                  className="w-full bg-[#0F2B5C] hover:bg-[#163875] active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-400" />

                  <span>Proceed to Payment ({event.fee})</span>

                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[9px] sm:text-[10px] text-slate-400 mt-1.5">
                  Your information is used only for event registration.
                </p>
              </div>
            </form>
          )}

          {/* =====================================================
              STEP 2: PAYMENT GATEWAY
          ====================================================== */}

          {currentStep === 'payment' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Order Summary */}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                      Registration Order
                    </span>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {event.eventName}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 block">
                      Total Payable
                    </span>

                    <span className="text-xl sm:text-2xl font-black text-emerald-700 font-heading">
                      {event.fee}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">
                      Candidate:
                    </span>
                    <strong className="text-slate-900 font-bold truncate block">
                      {formData.studentName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">
                      Category:
                    </span>
                    <strong className="text-slate-900 font-bold">
                      {formattedLevel}
                    </strong>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[10px]">
                      School:
                    </span>
                    <strong className="text-slate-900 font-bold truncate block">
                      {formData.schoolName}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {[
                    {
                      id: 'upi',
                      icon: QrCode,
                      title: 'UPI / QR',
                      subtitle: 'Instant',
                    },
                    {
                      id: 'card',
                      icon: CreditCard,
                      title: 'Card',
                      subtitle: 'RuPay/Visa',
                    },
                    {
                      id: 'netbanking',
                      icon: Building2,
                      title: 'Net Bank',
                      subtitle: 'All Banks',
                    },
                  ].map((method) => {
                    const Icon = method.icon;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 ${
                          paymentMethod === method.id
                            ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />

                        <span className="text-xs font-bold">
                          {method.title}
                        </span>

                        <span className="text-[9px] text-slate-500">
                          {method.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details */}

              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 sm:p-4">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3.5 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="bg-white p-2.5 rounded-xl border-2 border-slate-300 shadow-sm inline-block">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-between text-white relative">
                          <div className="w-full h-full border-2 border-dashed border-white/60 flex flex-col items-center justify-center">
                            <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            <span className="text-[8px] font-black uppercase text-amber-300 tracking-wider mt-0.5">
                              Scan to Pay
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center sm:text-left space-y-1.5">
                        <div className="text-xs font-black text-slate-900">
                          Scan QR using any UPI Application
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(
                            (app) => (
                              <span
                                key={app}
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-800"
                              >
                                {app}
                              </span>
                            )
                          )}
                        </div>

                        <div className="text-xs text-slate-600 pt-1">
                          Official VPA:{' '}
                          <strong className="text-slate-950 font-mono select-all">
                            besel.board@icici
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center pt-1">
                      <div className="border-t border-slate-200 w-full" />
                      <span className="bg-slate-50 px-2.5 text-[10px] font-bold uppercase text-slate-500 absolute">
                        OR ENTER UPI ID
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter your UPI ID"
                        className="flex-1 min-w-0 px-3 py-2 text-sm sm:text-base bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            `UPI ID ${upiId || 'besel.board@icici'} verified successfully!`
                          )
                        }
                        className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Card Number
                      </label>

                      <input
                        type="text"
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-3 py-2 text-sm sm:text-base bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Expiry (MM/YY)
                        </label>

                        <input
                          type="text"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          CVV
                        </label>

                        <input
                          type="password"
                          maxLength="4"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="***"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Cardholder Name
                      </label>

                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Select Bank
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                          className={`p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer active:scale-95 ${
                            selectedBank === bank
                              ? 'border-sky-600 bg-sky-100/70 text-sky-950 font-black'
                              : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Security Banner */}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-Bit SSL • NPCI & RBI Compliant</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <input
                    type="checkbox"
                    id="failSim"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />

                  <label htmlFor="failSim" className="cursor-pointer">
                    Simulate Failure
                  </label>
                </div>
              </div>

              {/* Payment Actions */}

              <div className="flex items-center justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep('form')}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay {event.fee} Securely</span>
                </button>
              </div>
            </div>
          )}

          {/* =====================================================
              PROCESSING
          ====================================================== */}

          {currentStep === 'processing' && (
            <div className="py-10 px-4 text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <Loader2 className="w-14 h-14 sm:w-16 sm:h-16 text-sky-600 animate-spin" />
                <Lock className="w-5 h-5 text-slate-700 absolute" />
              </div>

              <h4 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                Processing Payment of {event.fee}...
              </h4>

              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Connecting to payment gateway bank network. Please do not
                refresh the page.
              </p>

              <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Verifying UPI / Bank Authorization...</span>
              </div>
            </div>
          )}

          {/* =====================================================
              PAYMENT FAILED
          ====================================================== */}

          {currentStep === 'payment_failed' && (
            <div className="py-6 sm:py-8 px-3 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h4 className="text-xl sm:text-2xl font-black font-heading text-rose-700">
                Payment Not Completed
              </h4>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                The transaction could not be completed by your bank. Your
                account was not debited.
              </p>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 font-semibold max-w-md mx-auto text-left space-y-1">
                <div>
                  Error Code:{' '}
                  <span className="font-mono">ERR_BANK_DECLINED_04</span>
                </div>
                <div>Candidate: {formData.studentName}</div>
                <div>Amount: {event.fee}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimulateFailure(false);
                    setCurrentStep('payment');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0F2B5C] hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
                  Retry Payment ({event.fee})
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep('form')}
                  className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Edit Details
                </button>
              </div>
            </div>
          )}

          {/* =====================================================
              PAYMENT SUCCESS
          ====================================================== */}

          {currentStep === 'payment_success' && (
            <div className="py-5 sm:py-6 px-3 text-center space-y-4 sm:space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                  Payment Confirmed
                </span>

                <h4 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-2">
                  Registration Successful!
                </h4>

                <p className="text-xs text-slate-600 mt-1">
                  Confirmed for{' '}
                  <strong className="text-slate-900">
                    {formData.studentName}
                  </strong>
                  . Official certificate is generated below.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-700">
                    Amount Paid:
                  </span>

                  <span className="text-base font-black text-emerald-700 font-mono">
                    {event.fee}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">Txn ID:</span>
                  <span className="font-mono font-bold text-slate-900 break-all text-right">
                    {txnId}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">Roll / Reg ID:</span>
                  <span className="font-mono font-bold text-slate-900 text-right">
                    {ticketId}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">Event:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[190px]">
                    {event.eventName}
                  </span>
                </div>
              </div>

             
            </div>
          )}

          {/* =====================================================
              CERTIFICATE
          ====================================================== */}

        </div>
      </div>
    </div>
  );
}