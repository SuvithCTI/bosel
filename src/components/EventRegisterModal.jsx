import React, { useState, useEffect } from 'react';
import {
  X,
  Ticket,
  Calendar,
  MapPin,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

import { getStoredEvents } from '../data/eventsData';
import { getStudentPhotoUrl } from '../utils/studentDataHelpers';
import { getRegisteredUsers } from '../utils/authStorage';

export default function EventRegisterModal({
  event: initialEvent,
  onClose,
  student,
}) {
  const availableEvents = getStoredEvents() || [];

  const [selectedEvent, setSelectedEvent] = useState(() => {
    if (initialEvent) return initialEvent;

    if (student) {
      const prog = (
        student.program ||
        student.courseName ||
        ''
      ).toLowerCase();

      const matched = availableEvents.find(
        (e) =>
          (e.category && prog.includes(e.category.toLowerCase())) ||
          (e.eventName && e.eventName.toLowerCase().includes(prog))
      );

      return matched || availableEvents[0];
    }

    return availableEvents[0] || {};
  });

  const event = selectedEvent || initialEvent || availableEvents[0] || {};

  const [formData, setFormData] = useState(() => ({
    studentName: student?.studentName || student?.name || '',
    dob: student?.dob || '2018-05-14',
    parentName: student?.parentName || '',
    phone: student?.phone || '',
    email: student?.email || '',
    schoolName: student?.branch || student?.institution || '',
    city:
      student?.city ||
      (student?.address
        ? student.address.split(',').pop().trim()
        : '') ||
      'Tenkasi',
    levelCategory: student?.grade
      ? `Level ${student.grade.replace(/\D/g, '') || '1'} (${student.grade})`
      : 'Level 1 (Sub-Junior / Age 5-7)',
    acceptTerms: true,
  }));

  const [currentStep, setCurrentStep] = useState('form');
  const [ticketId, setTicketId] = useState('');
  const [txnId, setTxnId] = useState('');

  const [studentPhoto, setStudentPhoto] = useState(() =>
    student ? getStudentPhotoUrl(student) : null
  );

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [simulateFailure, setSimulateFailure] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

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

  const isStudentPreset = Boolean(student);

  const isPaymentStep = [
    'payment',
    'processing',
    'payment_failed',
    'payment_success',
  ].includes(currentStep);

  useEffect(() => {
    if (initialEvent) {
      setSelectedEvent(initialEvent);
    }
  }, [initialEvent]);

  useEffect(() => {
    if (!student) return;

    setFormData((prev) => ({
      ...prev,
      studentName:
        student.studentName || student.name || prev.studentName,
      parentName: student.parentName || prev.parentName,
      phone: student.phone || prev.phone,
      email: student.email || prev.email,
      schoolName:
        student.branch || student.institution || prev.schoolName,
      city:
        student.city ||
        (student.address
          ? student.address.split(',').pop().trim()
          : '') ||
        prev.city,
      levelCategory: student.grade
        ? `Level ${student.grade.replace(/\D/g, '') || '1'} (${student.grade})`
        : prev.levelCategory,
    }));

    const photo = getStudentPhotoUrl(student);

    if (photo) {
      setStudentPhoto(photo);
    }
  }, [student]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Keep the modal body at the top when changing steps.
    const body = document.getElementById('event-modal-body');

    if (body) {
      body.scrollTop = 0;
    }
  }, [currentStep]);

  if (!event || !event.eventName) return null;

  const updateForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const category = String(event.category || 'EVENT');

    const generatedId = `BSEL-${category
      .substring(0, 3)
      .toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    setTicketId(generatedId);
    setCurrentStep('payment');
  };

  const handleProcessPayment = () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setCurrentStep('processing');

    const generatedTxn = `TXN-UPI-${Math.floor(
      10000000 + Math.random() * 90000000
    )}`;

    setTxnId(generatedTxn);

    setTimeout(() => {
      setIsProcessing(false);

      if (simulateFailure) {
        setCurrentStep('payment_failed');
        return;
      }

      const registeredStudent = {
        studentName: formData.studentName,
        courseName: event.category || 'Abacus',
        programPrefix: 'MINDSPARC',
        level: formattedLevel,
        grade: 'A',
        duration: '6 Months',
        registrationNo: ticketId,
        certificateNo: `BSEL/${String(
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
      } catch (err) {
        console.error('Unable to save registration:', err);
      }

      if (student?.userId) {
        try {
          const users = getRegisteredUsers();
          const idx = users.findIndex(
            (u) => u.userId === student.userId
          );

          if (idx !== -1) {
            const currentEvents = users[idx].events || [];

            const newEvent = {
              name: event.eventName,
              date: event.date,
              status: 'Hall Ticket Issued',
              seat: 'Hall A / Bench 14',
              rollNo: ticketId,
              venue: event.venue || event.place,
            };

            users[idx].events = [
              newEvent,
              ...currentEvents.filter(
                (e) => e.name !== event.eventName
              ),
            ];

            localStorage.setItem(
              'bsel_registered_users',
              JSON.stringify(users)
            );

            window.dispatchEvent(
              new Event('bsel_users_updated')
            );
          }
        } catch (err) {
          console.error('Error saving event registration:', err);
        }
      }

      setCurrentStep('payment_success');
    }, 1600);
  };

  const inputClass = isStudentPreset
    ? 'w-full min-w-0 h-9 sm:h-10 px-3 text-xs sm:text-sm text-slate-700 font-semibold border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed select-none focus:outline-none'
    : 'w-full min-w-0 h-9 sm:h-10 px-3 text-xs sm:text-sm text-slate-950 font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition';

  const labelClass =
    'block text-[10px] sm:text-xs font-bold text-slate-800 mb-1';

  const closeModal = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <style>{`
        .event-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .event-modal-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .event-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .event-modal-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        @media (max-width: 420px) {
          .event-modal-header-title {
            font-size: 15px !important;
          }

          .event-modal-progress {
            font-size: 9px !important;
          }

          .event-modal-progress-gap {
            margin-left: 5px !important;
            margin-right: 5px !important;
          }
        }

        @media (max-height: 650px) and (min-width: 640px) {
          .event-modal-header {
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }

          .event-modal-header-title {
            margin-top: 5px !important;
          }

          .event-modal-progress {
            margin-top: 8px !important;
            padding-top: 7px !important;
          }
        }
      `}</style>

      {/* MODAL BACKDROP */}
      <div
        className="
          fixed inset-0 z-[100]
          flex items-center justify-center
          bg-slate-950/80
          backdrop-blur-sm
          p-0
          min-[420px]:p-2
          sm:p-4
        "
        onClick={closeModal}
      >
        {/* MODAL CONTAINER */}
        <div
          className={`
            relative flex flex-col
            w-full
            h-[100dvh]
            min-h-0
            bg-white
            shadow-2xl
            border border-slate-200
            overflow-hidden
            rounded-none
            min-[420px]:rounded-xl
            sm:rounded-2xl
            sm:h-auto
            sm:max-h-[94dvh]
            animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200
            ${
              currentStep === 'certificate'
                ? 'max-w-5xl'
                : currentStep === 'payment'
                ? 'max-w-2xl'
                : 'max-w-[520px]'
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="
            event-modal-header
            bg-[#0F2B5C]
            text-white
            px-4 sm:px-5
            py-3 sm:py-4
            shrink-0
            border-b border-white/10
          ">
            <div className="flex items-center justify-between gap-2">
              <div className="
                inline-flex items-center gap-1.5
                px-2.5 py-1
                rounded-full
                bg-white/15
                text-amber-300
                text-[9px] sm:text-xs
                font-black
                uppercase
                tracking-wider
                min-w-0
              ">
                <Ticket className="w-3.5 h-3.5 text-amber-400 shrink-0" />

                <span className="truncate">
                  {isPaymentStep
                    ? 'Secure Payment'
                    : currentStep === 'certificate'
                    ? 'Official Certificate Issued'
                    : 'Event Registration Desk'}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  p-1.5
                  rounded-full
                  bg-white/15
                  hover:bg-white/25
                  active:scale-95
                  text-white
                  transition
                  cursor-pointer
                  shrink-0
                "
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <h3 className="
              event-modal-header-title
              text-base sm:text-2xl
              font-black
              font-heading
              text-white
              leading-snug
              mt-2
              break-words
            ">
              {event.eventName}
            </h3>

            <div className="
              mt-2
              flex items-center justify-between
              gap-2
              text-[10px] sm:text-xs
              text-slate-200
              flex-wrap
            ">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="inline-flex items-center gap-1 font-semibold min-w-0">
                  <MapPin className="w-3 h-3 text-sky-300 shrink-0" />

                  <span className="truncate max-w-[145px] sm:max-w-none">
                    {event.place}
                  </span>
                </span>

                <span className="text-white/60">•</span>

                <span className="inline-flex items-center gap-1 font-semibold">
                  <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{event.date}</span>
                </span>
              </div>

              <span className="
                bg-amber-400
                text-slate-950
                px-2 py-0.5
                rounded-md
                font-black
                text-[10px] sm:text-[11px]
                shrink-0
              ">
                Fee: {event.fee}
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="
              event-modal-progress
              mt-3 pt-2.5
              border-t border-white/15
              flex items-center justify-between
              text-[10px] sm:text-[11px]
              font-bold
              gap-1
            ">
              {/* DETAILS */}
              <div
                className={`flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  currentStep === 'form'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                <span className={`
                  w-4 h-4 rounded-full
                  flex items-center justify-center
                  text-[9px] font-black shrink-0
                  ${
                    currentStep === 'form'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-500 text-white'
                  }
                `}>
                  {currentStep === 'form' ? '1' : '✓'}
                </span>

                <span>1. Details</span>
              </div>

              <div className="h-0.5 flex-1 mx-1 sm:mx-2 bg-white/20 min-w-[8px]" />

              {/* PAYMENT */}
              <div
                className={`flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  isPaymentStep
                    ? 'text-amber-400'
                    : currentStep === 'certificate'
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                <span className={`
                  w-4 h-4 rounded-full
                  flex items-center justify-center
                  text-[9px] font-black shrink-0
                  ${
                    currentStep === 'certificate'
                      ? 'bg-emerald-500 text-white'
                      : isPaymentStep
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white/20 text-white'
                  }
                `}>
                  {currentStep === 'certificate' ? '✓' : '2'}
                </span>

                <span>2. Payment</span>
              </div>

              <div className="h-0.5 flex-1 mx-1 sm:mx-2 bg-white/20 min-w-[8px]" />

              {/* PASS */}
              <div
                className={`flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  currentStep === 'certificate'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                <span className={`
                  w-4 h-4 rounded-full
                  flex items-center justify-center
                  text-[9px] font-black shrink-0
                  ${
                    currentStep === 'certificate'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white/20 text-white'
                  }
                `}>
                  3
                </span>

                <span>3. Pass</span>
              </div>
            </div>
          </div>

          {/* =====================================================
              BODY
          ====================================================== */}

          <div
            id="event-modal-body"
            className={`
              flex-1 min-h-0
              p-3 sm:p-5
              ${
                currentStep === 'form'
                  ? 'flex flex-col overflow-hidden'
                  : 'overflow-y-auto overscroll-contain event-modal-scroll'
              }
            `}
          >
            {/* =====================================================
                STEP 1: REGISTRATION FORM
            ====================================================== */}

            {currentStep === 'form' && (
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col flex-1 min-h-0 gap-2"
              >
                {/* SCROLLABLE FORM CONTENT */}
                <div className="
                  flex-1 min-h-0
                  overflow-y-auto
                  overscroll-contain
                  event-modal-scroll
                  pr-1
                  space-y-2.5
                ">
                  {/* ELIGIBILITY */}
                  <div className="
                    bg-sky-50
                    border border-sky-200
                    rounded-lg
                    px-3 py-2
                    text-[10px] sm:text-xs
                    text-sky-950
                    font-semibold
                    leading-relaxed
                  ">
                    <span className="font-black text-sky-900">
                      Eligibility:
                    </span>{' '}
                    {event.eligibility}. Please ensure participant details
                    match school ID records.
                  </div>

                  {/* EVENT SELECTION */}
                  {availableEvents.length > 1 && (
                    <div className="
                      bg-slate-50
                      border border-slate-200
                      rounded-xl
                      p-2.5 sm:p-3
                      space-y-1.5
                    ">
                      <label className="
                        block
                        text-[10px] sm:text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-800
                      ">
                        Select Competition / Event *
                      </label>

                      <select
                        value={event.eventName}
                        onChange={(e) => {
                          const found = availableEvents.find(
                            (ev) => ev.eventName === e.target.value
                          );

                          if (found) setSelectedEvent(found);
                        }}
                        className="
                          w-full min-w-0
                          h-9
                          px-2.5 sm:px-3
                          text-[10px] sm:text-xs
                          text-slate-900
                          font-bold
                          border border-slate-300
                          rounded-lg
                          bg-white
                          focus:ring-2 focus:ring-sky-500
                          focus:outline-none
                        "
                      >
                        {availableEvents.map((ev) => (
                          <option
                            key={ev.eventName}
                            value={ev.eventName}
                          >
                            {ev.eventName} ({ev.category}) • Fee: {ev.fee} •{' '}
                            {ev.place}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* STUDENT DETAILS */}
                  <div className="space-y-2.5">
                    <div className="
                      flex items-center justify-between
                      gap-2
                      flex-wrap
                    ">
                      <h4 className="
                        text-[10px] sm:text-xs
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-700
                      ">
                        Student & Contact Details
                      </h4>

                      {isStudentPreset && (
                        <span className="
                          inline-flex items-center gap-1
                          text-[9px] sm:text-[10px]
                          font-bold
                          text-slate-500
                          bg-slate-100
                          border border-slate-200
                          px-2 py-0.5
                          rounded-full
                        ">
                          <Lock className="w-2.5 h-2.5 text-slate-400" />
                          Locked (Student Record)
                        </span>
                      )}
                    </div>

                    {/* NAME + DOB */}
                    <div className="
                      grid
                      grid-cols-1
                      min-[420px]:grid-cols-2
                      gap-2 sm:gap-2.5
                    ">
                      <div className="min-w-0">
                        <label className={labelClass}>
                          Student Full Name *
                        </label>

                        <input
                          type="text"
                          required
                          readOnly={isStudentPreset}
                          value={formData.studentName}
                          onChange={(e) =>
                            !isStudentPreset &&
                            updateForm('studentName', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="min-w-0">
                        <label className={labelClass}>
                          Date of Birth *
                        </label>

                        <input
                          type="date"
                          required
                          readOnly={isStudentPreset}
                          disabled={isStudentPreset}
                          value={formData.dob}
                          onChange={(e) =>
                            !isStudentPreset &&
                            updateForm('dob', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* PARENT + PHONE */}
                    <div className="
                      grid
                      grid-cols-1
                      min-[420px]:grid-cols-2
                      gap-2 sm:gap-2.5
                    ">
                      <div className="min-w-0">
                        <label className={labelClass}>
                          Parent / Guardian Name *
                        </label>

                        <input
                          type="text"
                          required
                          readOnly={isStudentPreset}
                          value={formData.parentName}
                          onChange={(e) =>
                            !isStudentPreset &&
                            updateForm('parentName', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="min-w-0">
                        <label className={labelClass}>
                          WhatsApp / Mobile Number *
                        </label>

                        <input
                          type="tel"
                          required
                          readOnly={isStudentPreset}
                          value={formData.phone}
                          onChange={(e) =>
                            !isStudentPreset &&
                            updateForm('phone', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* SCHOOL */}
                    <div className="min-w-0">
                      <label className={labelClass}>
                        School / Academy Name *
                      </label>

                      <input
                        type="text"
                        required
                        readOnly={isStudentPreset}
                        value={formData.schoolName}
                        onChange={(e) =>
                          !isStudentPreset &&
                          updateForm('schoolName', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* LEVEL + CITY */}
                    <div className="
                      grid
                      grid-cols-1
                      min-[420px]:grid-cols-2
                      gap-2 sm:gap-2.5
                    ">
                      <div className="min-w-0">
                        <label className={labelClass}>
                          Competition Level
                        </label>

                        <select
                          disabled={isStudentPreset}
                          value={formData.levelCategory}
                          onChange={(e) =>
                            !isStudentPreset &&
                            updateForm('levelCategory', e.target.value)
                          }
                          className={inputClass}
                        >
                          <option>
                            Level 1 (Sub-Junior / Age 5-7)
                          </option>
                          <option>
                            Level 2 (Junior / Age 8-10)
                          </option>
                          <option>
                            Level 3 (Senior / Age 11-13)
                          </option>
                          <option>
                            Level 4 (Super-Senior / Age 14+)
                          </option>
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label className={labelClass}>
                          Participant City *
                        </label>

                        <input
                          type="text"
                          required
                          readOnly={isStudentPreset}
                          value={formData.city}
                          onChange={(e) =>
                            !isStudentPreset &&
                            updateForm('city', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="min-w-0">
                      <label className={labelClass}>
                        Email Address
                      </label>

                      <input
                        type="email"
                        readOnly={isStudentPreset}
                        value={formData.email}
                        onChange={(e) =>
                          !isStudentPreset &&
                          updateForm('email', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* TERMS */}
                    <label className="
                      flex items-start gap-2
                      pt-1
                      text-[9px] sm:text-[11px]
                      text-slate-700
                      font-semibold
                      cursor-pointer
                      leading-relaxed
                    ">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) =>
                          updateForm('acceptTerms', e.target.checked)
                        }
                        className="
                          rounded
                          text-sky-600
                          focus:ring-sky-500
                          mt-0.5
                          shrink-0
                        "
                        required
                      />

                      <span>
                        I confirm that the details provided are accurate
                        and agree to follow the official B★SEL competition
                        code of conduct and rules.
                      </span>
                    </label>
                  </div>
                </div>

                {/* FIXED BOTTOM ACTION */}
                <div className="
                  shrink-0
                  pt-2
                  border-t border-slate-200
                  bg-white
                ">
                  <button
                    type="submit"
                    className="
                      w-full
                      bg-[#0F2B5C]
                      hover:bg-[#163875]
                      active:scale-[0.99]
                      text-white
                      py-2.5 sm:py-3
                      rounded-xl
                      font-black
                      text-xs sm:text-sm
                      transition
                      flex items-center justify-center
                      gap-2
                      shadow-md
                      hover:shadow-lg
                      cursor-pointer
                    "
                  >
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />

                    <span>Proceed to Payment ({event.fee})</span>

                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <p className="
                    text-center
                    text-[8px] sm:text-[10px]
                    text-slate-400
                    mt-1.5
                  ">
                    Your information is used only for event registration.
                  </p>
                </div>
              </form>
            )}

            {/* =====================================================
                STEP 2: PAYMENT
            ====================================================== */}

            {currentStep === 'payment' && (
              <div className="space-y-3 sm:space-y-5">
                {/* ORDER SUMMARY */}
                <div className="
                  bg-slate-50
                  border border-slate-200
                  rounded-xl sm:rounded-2xl
                  p-3 sm:p-4
                ">
                  <div className="
                    flex items-center justify-between
                    gap-2
                    pb-2.5
                    border-b border-slate-200
                  ">
                    <div className="min-w-0 pr-2">
                      <span className="
                        text-[9px] sm:text-[10px]
                        font-black
                        uppercase
                        text-slate-500
                        tracking-wider
                        block
                      ">
                        Registration Order
                      </span>

                      <h4 className="
                        text-xs sm:text-base
                        font-black
                        text-slate-900
                        break-words
                      ">
                        {event.eventName}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="
                        text-[9px] sm:text-[10px]
                        font-bold
                        text-slate-500
                        block
                      ">
                        Total Payable
                      </span>

                      <span className="
                        text-lg sm:text-2xl
                        font-black
                        text-emerald-700
                        font-heading
                      ">
                        {event.fee}
                      </span>
                    </div>
                  </div>

                  <div className="
                    grid grid-cols-2 sm:grid-cols-3
                    gap-2
                    pt-2.5
                    text-xs
                  ">
                    <div className="min-w-0">
                      <span className="text-slate-500 block text-[9px] sm:text-[10px]">
                        Candidate:
                      </span>

                      <strong className="text-slate-900 font-bold truncate block text-[10px] sm:text-xs">
                        {formData.studentName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[9px] sm:text-[10px]">
                        Category:
                      </span>

                      <strong className="text-slate-900 font-bold text-[10px] sm:text-xs">
                        {formattedLevel}
                      </strong>
                    </div>

                    <div className="col-span-2 sm:col-span-1 min-w-0">
                      <span className="text-slate-500 block text-[9px] sm:text-[10px]">
                        School:
                      </span>

                      <strong className="text-slate-900 font-bold truncate block text-[10px] sm:text-xs">
                        {formData.schoolName}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div>
                  <label className="
                    block
                    text-[10px] sm:text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-900
                    mb-2
                  ">
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
                          className={`
                            p-2 sm:p-3
                            rounded-xl
                            border
                            text-center
                            transition
                            cursor-pointer
                            flex flex-col
                            items-center justify-center
                            gap-1
                            active:scale-95
                            ${
                              paymentMethod === method.id
                                ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />

                          <span className="text-[10px] sm:text-xs font-bold">
                            {method.title}
                          </span>

                          <span className="text-[8px] sm:text-[9px] text-slate-500">
                            {method.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PAYMENT DETAILS */}
                <div className="
                  bg-slate-50/80
                  border border-slate-200
                  rounded-xl sm:rounded-2xl
                  p-3 sm:p-4
                ">
                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3 text-center">
                      <div className="
                        flex flex-col sm:flex-row
                        items-center justify-center
                        gap-3 sm:gap-4
                      ">
                        <div className="
                          bg-white
                          p-2
                          rounded-xl
                          border-2 border-slate-300
                          shadow-sm
                        ">
                          <div className="
                            w-28 h-28 sm:w-32 sm:h-32
                            bg-slate-950
                            rounded-lg
                            p-2
                            flex flex-col
                            items-center justify-between
                            text-white
                          ">
                            <div className="
                              w-full h-full
                              border-2 border-dashed border-white/60
                              flex flex-col
                              items-center justify-center
                            ">
                              <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-white" />

                              <span className="
                                text-[8px]
                                font-black
                                uppercase
                                text-amber-300
                                tracking-wider
                                mt-0.5
                              ">
                                Scan to Pay
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center sm:text-left space-y-1.5">
                          <div className="text-[10px] sm:text-xs font-black text-slate-900">
                            Scan QR using any UPI Application
                          </div>

                          <div className="
                            flex items-center justify-center sm:justify-start
                            gap-1 flex-wrap
                          ">
                            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(
                              (app) => (
                                <span
                                  key={app}
                                  className="
                                    px-2 py-0.5
                                    bg-white
                                    border border-slate-200
                                    rounded
                                    text-[9px] sm:text-[10px]
                                    font-bold
                                    text-slate-800
                                  "
                                >
                                  {app}
                                </span>
                              )
                            )}
                          </div>

                          <div className="text-[10px] sm:text-xs text-slate-600 pt-1">
                            Official VPA:{' '}
                            <strong className="
                              text-slate-950
                              font-mono
                              select-all
                              break-all
                            ">
                              besel.board@icici
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="
                        relative
                        flex items-center justify-center
                        pt-1
                      ">
                        <div className="border-t border-slate-200 w-full" />

                        <span className="
                          bg-slate-50
                          px-2.5
                          text-[9px] sm:text-[10px]
                          font-bold
                          uppercase
                          text-slate-500
                          absolute
                        ">
                          OR ENTER UPI ID
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your UPI ID"
                          className="
                            flex-1 min-w-0
                            px-3 py-2
                            text-xs sm:text-sm
                            bg-white
                            border border-slate-300
                            rounded-xl
                            font-mono
                            focus:ring-2 focus:ring-sky-500
                            focus:outline-none
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `UPI ID ${
                                upiId || 'besel.board@icici'
                              } verified successfully!`
                            )
                          }
                          className="
                            px-3 sm:px-3.5
                            py-2
                            bg-slate-200
                            hover:bg-slate-300
                            text-slate-800
                            text-[10px] sm:text-xs
                            font-bold
                            rounded-xl
                            transition
                            cursor-pointer
                            shrink-0
                          "
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CARD */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-800 mb-1">
                          Card Number
                        </label>

                        <input
                          type="text"
                          maxLength="19"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          className="
                            w-full min-w-0
                            px-3 py-2
                            text-xs sm:text-sm
                            bg-white
                            border border-slate-300
                            rounded-xl
                            font-mono
                            focus:ring-2 focus:ring-sky-500
                            focus:outline-none
                          "
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-800 mb-1">
                            Expiry (MM/YY)
                          </label>

                          <input
                            type="text"
                            maxLength="5"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="
                              w-full min-w-0
                              px-3 py-2
                              text-xs sm:text-sm
                              bg-white
                              border border-slate-300
                              rounded-xl
                              font-mono
                              focus:ring-2 focus:ring-sky-500
                              focus:outline-none
                            "
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-800 mb-1">
                            CVV
                          </label>

                          <input
                            type="password"
                            maxLength="4"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="***"
                            className="
                              w-full min-w-0
                              px-3 py-2
                              text-xs sm:text-sm
                              bg-white
                              border border-slate-300
                              rounded-xl
                              font-mono
                              focus:ring-2 focus:ring-sky-500
                              focus:outline-none
                            "
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-800 mb-1">
                          Cardholder Name
                        </label>

                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="
                            w-full min-w-0
                            px-3 py-2
                            text-xs sm:text-sm
                            bg-white
                            border border-slate-300
                            rounded-xl
                            focus:ring-2 focus:ring-sky-500
                            focus:outline-none
                          "
                        />
                      </div>
                    </div>
                  )}

                  {/* NET BANKING */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-2.5">
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-800">
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
                            className={`
                              p-2 sm:p-2.5
                              rounded-xl
                              border
                              text-[10px] sm:text-xs
                              font-bold
                              transition
                              text-left
                              cursor-pointer
                              active:scale-95
                              ${
                                selectedBank === bank
                                  ? 'border-sky-600 bg-sky-100/70 text-sky-950 font-black'
                                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                              }
                            `}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECURITY BANNER */}
                <div className="
                  flex flex-col sm:flex-row
                  items-start sm:items-center
                  justify-between
                  gap-2
                  text-[10px] sm:text-[11px]
                  text-slate-600
                  bg-slate-100
                  px-3 py-2
                  rounded-xl
                  border border-slate-200
                ">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />

                    <span>256-Bit SSL • NPCI & RBI Compliant</span>
                  </div>

                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-500">
                    <input
                      type="checkbox"
                      id="failSim"
                      checked={simulateFailure}
                      onChange={(e) =>
                        setSimulateFailure(e.target.checked)
                      }
                      className="
                        rounded
                        text-rose-600
                        focus:ring-rose-500
                        cursor-pointer
                      "
                    />

                    <label htmlFor="failSim" className="cursor-pointer">
                      Simulate Failure
                    </label>
                  </div>
                </div>

                {/* PAYMENT ACTIONS */}
                <div className="
                  flex items-center justify-between
                  gap-2
                  pt-1
                ">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('form')}
                    className="
                      px-3 py-2.5
                      rounded-xl
                      border border-slate-300
                      text-slate-700
                      hover:bg-slate-100
                      font-bold
                      text-[10px] sm:text-xs
                      transition
                      flex items-center gap-1
                      cursor-pointer
                      active:scale-95
                      shrink-0
                    "
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="
                      flex-1 min-w-0
                      bg-emerald-600
                      hover:bg-emerald-700
                      active:scale-[0.98]
                      disabled:opacity-60
                      text-white
                      py-3
                      rounded-xl
                      font-black
                      text-xs sm:text-sm
                      transition
                      flex items-center justify-center
                      gap-2
                      shadow-lg
                      cursor-pointer
                    "
                  >
                    <Lock className="w-4 h-4 shrink-0" />

                    <span className="truncate">
                      Pay {event.fee} Securely
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* =====================================================
                PROCESSING
            ====================================================== */}

            {currentStep === 'processing' && (
              <div className="
                py-10 sm:py-12
                px-3 sm:px-4
                text-center
                space-y-4
              ">
                <div className="
                  relative
                  inline-flex
                  items-center justify-center
                ">
                  <Loader2 className="
                    w-12 h-12 sm:w-16 sm:h-16
                    text-sky-600
                    animate-spin
                  " />

                  <Lock className="w-5 h-5 text-slate-700 absolute" />
                </div>

                <h4 className="
                  text-base sm:text-xl
                  font-bold
                  font-heading
                  text-slate-900
                ">
                  Processing Payment of {event.fee}...
                </h4>

                <p className="
                  text-[11px] sm:text-xs
                  text-slate-600
                  max-w-sm
                  mx-auto
                  leading-relaxed
                ">
                  Connecting to payment gateway bank network. Please do
                  not refresh the page.
                </p>

                <div className="
                  inline-flex items-center gap-2
                  text-[9px] sm:text-[11px]
                  font-semibold
                  text-emerald-700
                  bg-emerald-50
                  px-3 py-1
                  rounded-full
                  border border-emerald-200
                ">
                  <span className="
                    w-2 h-2
                    rounded-full
                    bg-emerald-500
                    animate-ping
                  " />

                  <span>
                    Verifying UPI / Bank Authorization...
                  </span>
                </div>
              </div>
            )}

            {/* =====================================================
                PAYMENT FAILED
            ====================================================== */}

            {currentStep === 'payment_failed' && (
              <div className="
                py-6 sm:py-8
                px-3
                text-center
                space-y-4
              ">
                <div className="
                  w-14 h-14
                  rounded-full
                  bg-rose-100
                  text-rose-600
                  flex items-center justify-center
                  mx-auto
                  shadow-inner
                ">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <h4 className="
                  text-lg sm:text-2xl
                  font-black
                  font-heading
                  text-rose-700
                ">
                  Payment Not Completed
                </h4>

                <p className="
                  text-[11px] sm:text-xs
                  text-slate-600
                  max-w-md
                  mx-auto
                  leading-relaxed
                ">
                  The transaction could not be completed by your bank.
                  Your account was not debited.
                </p>

                <div className="
                  bg-rose-50
                  border border-rose-200
                  rounded-xl
                  p-3
                  text-[10px] sm:text-xs
                  text-rose-900
                  font-semibold
                  max-w-md
                  mx-auto
                  text-left
                  space-y-1
                ">
                  <div>
                    Error Code:{' '}
                    <span className="font-mono">
                      ERR_BANK_DECLINED_04
                    </span>
                  </div>

                  <div>Candidate: {formData.studentName}</div>
                  <div>Amount: {event.fee}</div>
                </div>

                <div className="
                  flex flex-col sm:flex-row
                  items-center justify-center
                  gap-2
                  pt-2
                ">
                  <button
                    type="button"
                    onClick={() => {
                      setSimulateFailure(false);
                      setCurrentStep('payment');
                    }}
                    className="
                      w-full sm:w-auto
                      px-6 py-2.5
                      bg-[#0F2B5C]
                      hover:bg-slate-900
                      text-white
                      rounded-xl
                      text-xs
                      font-bold
                      transition
                      cursor-pointer
                      shadow-md
                    "
                  >
                    Retry Payment ({event.fee})
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('form')}
                    className="
                      w-full sm:w-auto
                      px-4 py-2.5
                      border border-slate-300
                      hover:bg-slate-100
                      text-slate-700
                      rounded-xl
                      text-xs
                      font-semibold
                      transition
                      cursor-pointer
                    "
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
              <div className="
                py-5 sm:py-6
                px-2 sm:px-3
                text-center
                space-y-4 sm:space-y-5
              ">
                <div className="
                  w-14 h-14
                  rounded-full
                  bg-emerald-100
                  text-emerald-600
                  flex items-center justify-center
                  mx-auto
                  shadow-md
                  animate-bounce
                ">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="
                    text-[10px] sm:text-xs
                    font-black
                    uppercase
                    text-emerald-700
                    tracking-wider
                    bg-emerald-100
                    px-3 py-1
                    rounded-full
                  ">
                    Payment Confirmed
                  </span>

                  <h4 className="
                    text-lg sm:text-2xl
                    font-black
                    font-heading
                    text-slate-900
                    mt-2
                  ">
                    Registration Successful!
                  </h4>

                  <p className="
                    text-[11px] sm:text-xs
                    text-slate-600
                    mt-1
                  ">
                    Confirmed for{' '}
                    <strong className="text-slate-900">
                      {formData.studentName}
                    </strong>
                    . Your event registration is complete.
                  </p>
                </div>

                <div className="
                  bg-slate-50
                  border border-slate-200
                  rounded-xl
                  p-3 sm:p-3.5
                  max-w-md
                  mx-auto
                  text-left
                  text-[10px] sm:text-xs
                  space-y-2
                ">
                  <div className="
                    flex items-center justify-between
                    pb-2
                    border-b border-slate-200
                  ">
                    <span className="font-bold text-slate-700">
                      Amount Paid:
                    </span>

                    <span className="
                      text-base
                      font-black
                      text-emerald-700
                      font-mono
                    ">
                      {event.fee}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-600 shrink-0">
                      Txn ID:
                    </span>

                    <span className="
                      font-mono
                      font-bold
                      text-slate-900
                      break-all
                      text-right
                    ">
                      {txnId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-600 shrink-0">
                      Roll / Reg ID:
                    </span>

                    <span className="
                      font-mono
                      font-bold
                      text-slate-900
                      text-right
                      break-all
                    ">
                      {ticketId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-600 shrink-0">
                      Event:
                    </span>

                    <span className="
                      font-semibold
                      text-slate-900
                      text-right
                      break-words
                    ">
                      {event.eventName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      w-full sm:w-auto
                      px-6 py-2.5
                      bg-[#0F2B5C]
                      hover:bg-slate-900
                      active:scale-95
                      text-white
                      rounded-xl
                      text-xs
                      font-bold
                      transition
                      cursor-pointer
                      shadow-md
                    "
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}