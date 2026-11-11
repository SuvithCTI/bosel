import React, { useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Printer, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  EXACT GEOMETRY                                                      */
/*  The whole receipt is drawn in a fixed 628 x 288 coordinate system  */
/*  (the size of your design image). It scales to any width while the  */
/*  aspect ratio, border, and every element position stay identical.   */
/* ------------------------------------------------------------------ */
const W = 628;
const H = 288;

const GOLD = "#b99a56";
const GOLD_DARK = "#8a6d2f";
const GOLD_SOFT = "#d9c791";
const NAVY = "#081d3d";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

/* Squeeze text only when it would overflow its slot */
const fit = (text, maxW, fs, k = 0.56) =>
  String(text).length * fs * k > maxW
    ? { textLength: maxW, lengthAdjust: "spacingAndGlyphs" }
    : {};

/* ---------- Diamond ornament ---------- */
const Diamond = ({ x, y, r = 6 }) => (
  <path
    d={`M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`}
    fill="#fff"
    stroke={GOLD}
    strokeWidth="1.4"
  />
);

/* ---------- Corner fan ornament (mirrored into 4 corners) ---------- */
const CornerOrnament = ({ transform }) => (
  <g transform={transform} stroke={GOLD} fill="none" strokeWidth="1">
    <path d="M20 42L42 20" />
    <path d="M25 49L49 25" strokeWidth="0.7" />
    <path d="M30 56L56 30" strokeWidth="0.5" />
    <path d="M13 30L30 13" strokeWidth="0.5" />
  </g>
);

/* ---------- Frame ---------- */
const Frame = () => (
  <g>
    {/* outer border (chamfered corners) */}
    <path
      d="M26 6H602L622 26V262L602 282H26L6 262V26Z"
      fill="none"
      stroke={GOLD}
      strokeWidth="2"
    />

    {/* inner border with a notch at the middle of every side */}
    <path
      d="M30 13H270L278 20H350L358 13H598L615 30V100L608 108V180L615 188V258L598 275H358L350 268H278L270 275H30L13 258V188L20 180V108L13 100V30Z"
      fill="none"
      stroke={GOLD}
      strokeWidth="1"
    />

    {/* extra deco lines */}
    <g stroke={GOLD_SOFT} strokeWidth="0.8" fill="none">
      <path d="M27 56V122M27 166V232" />
      <path d="M601 56V122M601 166V232" />
      <path d="M120 20H254M374 20H508" />
      <path d="M120 268H254M374 268H508" />
    </g>

    <CornerOrnament transform="" />
    <CornerOrnament transform={`translate(${W} 0) scale(-1 1)`} />
    <CornerOrnament transform={`translate(0 ${H}) scale(1 -1)`} />
    <CornerOrnament transform={`translate(${W} ${H}) scale(-1 -1)`} />

    {/* mid-side diamonds */}
    <Diamond x={314} y={20} />
    <Diamond x={314} y={268} />
    <Diamond x={20} y={144} />
    <Diamond x={608} y={144} />
  </g>
);

/* ---------- PAID seal ---------- */
const burst = (() => {
  const pts = [];
  const n = 24;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? 48 : 43;
    const a = (Math.PI * i) / n;
    pts.push(
      `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
    );
  }
  return pts.join(" ");
})();

const PaidSeal = () => (
  <g transform="translate(511 191) scale(0.68) rotate(-14 50 50)">
    <polygon points="30,80 22,116 38,106 48,118 52,84" fill="#a98b4c" />
    <polygon points="70,80 78,116 62,106 52,118 48,84" fill="#c4a762" />
    <polygon points={burst} fill={GOLD} />
    <circle cx="50" cy="50" r="36" fill="none" stroke="#fff" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="31" fill="none" stroke="#fff" strokeWidth="0.8" />
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontFamily={SERIF}
      fontWeight="700"
      fontSize="19"
      letterSpacing="1"
      fill="#fff"
    >
      PAID
    </text>
  </g>
);

/* ---------- Label + underlined value ---------- */
const Field = ({ label, labelX, y, valueX, endX, value }) => (
  <g>
    <text x={labelX} y={y} fontSize="8.5" fontFamily={SANS} fill={NAVY}>
      {label}
    </text>
    <line
      x1={valueX}
      x2={endX}
      y1={y + 2}
      y2={y + 2}
      stroke={GOLD}
      strokeWidth="0.6"
    />
    {value ? (
      <text
        x={valueX + 2}
        y={y}
        fontSize="8.5"
        fontWeight="700"
        fontFamily={SANS}
        fill={NAVY}
        {...fit(value, endX - valueX - 4, 8.5)}
      >
        {value}
      </text>
    ) : null}
  </g>
);

/* ------------------------------------------------------------------ */
/*  Data mapping (same field fallbacks as before)                       */
/* ------------------------------------------------------------------ */
const buildData = (receipt = {}) => ({
  receiptNo: receipt.receiptNo || receipt.id || "",
  date: receipt.date || "",
  studentName: receipt.studentName || receipt.payerName || receipt.name || "",
  parentName:
    receipt.parentGuardianName || receipt.parentName || receipt.guardianName || "",
  school: receipt.school || receipt.studyCenter || receipt.branch || "",
  standard: receipt.standard || receipt.class || "",
  program: receipt.program || receipt.course || "",
  amount: receipt.amount || "",
  paymentMode: receipt.paymentMode || "",
  refNo: receipt.refNo || "",
  verifiedBy: receipt.verifiedBy || "B★SEL Desk",
  contactNumber: receipt.contactNumber || "",
});

/* ------------------------------------------------------------------ */
/*  One receipt (SVG, fixed 628 x 288 geometry)                         */
/* ------------------------------------------------------------------ */
const ReceiptSVG = ({ receipt, logoHref }) => {
  const data = buildData(receipt);

  const paymentLine = [
    data.amount && `Paid: ${data.amount}`,
    data.paymentMode && data.paymentMode,
    data.refNo && `Ref: ${data.refNo}`,
  ]
    .filter(Boolean)
    .join("  |  ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {/* white paper */}
      <rect width={W} height={H} fill="#fff" />

      <Frame />

      {/* Title */}
      <text
        x="314"
        y="43"
        textAnchor="middle"
        fontFamily={SERIF}
        fontWeight="700"
        fontSize="15"
        fill={GOLD_DARK}
        textLength="328"
        lengthAdjust="spacing"
      >
        BILL OF SUPPLY / FEE RECEIPT
      </text>

      {/* Emblem + wordmark */}
      <image
        href={logoHref}
        x="284"
        y="47"
        width="60"
        height="46"
        preserveAspectRatio="xMidYMid meet"
      />
      <text
        x="314"
        y="99"
        textAnchor="middle"
        fontFamily={SERIF}
        fontWeight="700"
        fontSize="8"
        letterSpacing="1.5"
        fill={NAVY}
      >
        B★SEL
      </text>

      {/* Organisation */}
      <text
        x="314"
        y="111"
        textAnchor="middle"
        fontFamily={SERIF}
        fontWeight="700"
        fontSize="13"
        fill={NAVY}
        textLength="262"
        lengthAdjust="spacingAndGlyphs"
      >
        Board of Skills and Educational Learning
      </text>
      <text
        x="314"
        y="126"
        textAnchor="middle"
        fontFamily={SERIF}
        fontWeight="700"
        fontSize="13"
        fill={NAVY}
        textLength="249"
        lengthAdjust="spacingAndGlyphs"
      >
        ISO 9001:2015 Certified Organization
      </text>
      <text
        x="314"
        y="137"
        textAnchor="middle"
        fontFamily={SANS}
        fontSize="7.5"
        fill="#555"
        textLength="224"
        lengthAdjust="spacingAndGlyphs"
      >
        (Certified by Paramount Quality Certifications)
      </text>

      {/* Receipt no + date */}
      <rect x="138" y="146" width="224" height="18" fill="none" stroke={GOLD} strokeWidth="1" />
      <text x="144" y="158" fontSize="9" fontFamily={SANS} fill={NAVY}>
        Receipt No:
      </text>
      <text
        x="196"
        y="158"
        fontSize="9"
        fontWeight="700"
        fontFamily={SANS}
        fill={NAVY}
        {...fit(data.receiptNo || "BSEL/____/____/", 160, 9)}
      >
        {data.receiptNo || "BSEL/____/____/"}
      </text>

      <rect x="372" y="146" width="116" height="18" fill="none" stroke={GOLD} strokeWidth="1" />
      <text x="378" y="158" fontSize="9" fontFamily={SANS} fill={NAVY}>
        Date:
      </text>
      <text
        x="402"
        y="158"
        fontSize="9"
        fontWeight="700"
        fontFamily={SANS}
        fill={NAVY}
        {...fit(data.date || "__/__/____", 80, 9)}
      >
        {data.date || "__/__/____"}
      </text>

      {/* Student details box */}
      <rect x="64" y="172" width="499" height="59" fill="none" stroke={GOLD} strokeWidth="1" />
      <g stroke={GOLD_SOFT} strokeWidth="0.8">
        <line x1="64" x2="563" y1="186" y2="186" />
        <line x1="64" x2="563" y1="201" y2="201" />
        <line x1="64" x2="563" y1="216" y2="216" />
        <line x1="316" x2="316" y1="186" y2="201" />
        <line x1="316" x2="316" y1="216" y2="231" />
      </g>

      <text x="68" y="182" fontSize="8.5" fontWeight="700" fontFamily={SANS} fill={GOLD_DARK}>
        STUDENT DETAILS:
      </text>

      <Field label="Student Name:" labelX={68} valueX={130} endX={312} y={196} value={data.studentName} />
      <Field label="Parent/Guardian Name:" labelX={320} valueX={420} endX={559} y={196} value={data.parentName} />
      <Field label="School/Study Center:" labelX={68} valueX={162} endX={500} y={211} value={data.school} />
      <Field label="Standard:" labelX={68} valueX={112} endX={312} y={226} value={data.standard} />
      <Field label="Program:" labelX={320} valueX={360} endX={500} y={226} value={data.program} />

      {/* Footer */}
      <text x="314" y="245" textAnchor="middle" fontSize="7.5" fontFamily={SANS} fill="#555">
        © B★SEL Educational Network.
      </text>
      <text x="314" y="256" textAnchor="middle" fontSize="7.5" fontFamily={SANS} fill="#555">
        A Decade Ahead | Contact Number: {data.contactNumber || "N/A"}
      </text>

      {paymentLine && (
        <text x="68" y="245" fontSize="7" fontFamily={SANS} fill={NAVY} {...fit(paymentLine, 175, 7)}>
          {paymentLine}
        </text>
      )}
      <text x="68" y="256" fontSize="7" fontFamily={SANS} fill="#555">
        Authenticated by: {data.verifiedBy}
      </text>

      <PaidSeal />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  A4 sheet constants (portrait, 10mm margins)                         */
/*  190mm wide  ->  190 * 288/628 = 87.13mm tall per receipt            */
/*  3 x 87.13 = 261.4mm  (fits the 277mm printable height)              */
/* ------------------------------------------------------------------ */
const PER_SHEET = 3;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/*  - receipt   : one receipt, printed 3 times on the sheet             */
/*  - receipts  : array of up to 3 different receipts (one per slot)    */
/* ------------------------------------------------------------------ */
const BselReceipt = ({
  receipt = {},
  receipts,
  onClose,
  showActions = true,
  width = 1000, // on-screen preview max width in px
  logoSrc = "/bsel_logo.png", // same file Logo.jsx uses (public/bsel_logo.png)
}) => {
  const previewRef = useRef(null);

  // absolute URL so the print popup (about:blank) can still load the image
  const logoHref =
    typeof window !== "undefined"
      ? new URL(logoSrc, window.location.origin).href
      : logoSrc;

  // what goes on the sheet: given list (max 3) or the same receipt x3
  const sheetItems =
    Array.isArray(receipts) && receipts.length
      ? receipts.slice(0, PER_SHEET)
      : Array.from({ length: PER_SHEET }, () => receipt);

  const first = buildData(sheetItems[0]);

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) {
      alert("Please allow pop-ups to print the receipt.");
      return;
    }

    // build "slot, cut-line, slot, cut-line, slot"
    const parts = [];
    sheetItems.forEach((item, i) => {
      if (i > 0) parts.push('<div class="cut"></div>');
      parts.push(
        '<div class="slot">' +
          renderToStaticMarkup(<ReceiptSVG receipt={item} logoHref={logoHref} />) +
          "</div>"
      );
    });

    w.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>BSEL Fee Receipts</title>
    <style>
      @page { size: A4 portrait; margin: 10mm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #fff; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

      /* printable area of A4 portrait = 190mm x 277mm */
      .sheet {
        width: 190mm;
        height: 276mm;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        page-break-after: avoid;
      }
      .slot { width: 190mm; height: 87.13mm; }   /* 628 : 288 */
      .slot svg { display: block; width: 100%; height: 100%; }
      .cut { border-top: 0.3mm dashed #9ca3af; height: 0; width: 100%; }

      @media screen {
        body { padding: 10mm; background: #e5e7eb; }
        .sheet { background: #fff; }
      }
    </style>
  </head>
  <body>
    <div class="sheet">${parts.join("")}</div>
    <script>
      window.onload = function () {
        setTimeout(function () { window.focus(); window.print(); }, 700);
      };
      window.onafterprint = function () { window.close(); };
    </script>
  </body>
</html>`);
    w.document.close();
  };

  return (
    <div className="w-full bg-white">
      {showActions && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-800">
              B★SEL Official Fee Receipt
            </h2>
            <p className="text-xs text-slate-500">
              Receipt No: {first.receiptNo || "N/A"} &middot; prints {PER_SHEET} per A4 sheet
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-[#081d3d] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#172b4d]"
            >
              <Printer size={15} />
              Print (3 per A4)
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* On-screen preview (first receipt) */}
      <div
        ref={previewRef}
        className="mx-auto w-full bg-white"
        style={{ maxWidth: width }}
      >
        <ReceiptSVG receipt={sheetItems[0]} logoHref={logoHref} />
      </div>
    </div>
  );
};

export default BselReceipt;