import React from 'react';
import centerSeal from '../assets/cert_center_gold_emblem.png';
import msmeLogo from '../assets/msme-logo.png';
import iafLogo from '../assets/iaf-logo.png';
import isoLogo from '../assets/iso-9001-logo.png';

// Vector version of the B★SEL marksheet template.
// Drawn on a 724 x 1024 grid, the same grid the data overlays use,
// so the percentage positions in OfficialMarksheetView still line up.

const NAVY = '#0b2a55';
const GOLD = '#b8892f';
const SERIF = "'Times New Roman', Times, serif";

const PAGE_CENTER_X = 362;

// Watermark strip colours
const STRIP_BG = NAVY;        // strip background
const STRIP_BORDER = GOLD;    // strip border colour (change this to adjust)
const STRIP_TEXT = '#ffffff'; // strip text colour

const LABELS = [
  'Registration No.',
  'Certificate No.',
  'Student Name',
  'Parent / Guardian',
  'Date of Birth',
  'Course',
  'Level',
  'Duration',
  'School / Exam Centre',
  'Address',
];

const TABLE_COLS = [37, 88, 282, 391, 500, 608, 687];
const TABLE_HEADERS = ['S.No.', 'Subject / Module', 'Max Marks', 'Assessment', 'Marks Obtained', 'Percentage'];
const ROW_LINES = [541, 577, 613, 650, 686, 722];

const Corner = ({ x, y, sx, sy }) => (
  <g stroke={GOLD} strokeWidth="1.6" fill="none">
    <path d={`M${x},${y + 58 * sy} L${x},${y} L${x + 60 * sx},${y}`} />
    <circle cx={x} cy={y} r="2.5" fill={GOLD} stroke="none" />
  </g>
);

const SectionTitle = ({ x, y, w, h, fill, text }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={fill} />
    <text
      x={x + w / 2}
      y={y + h / 2 + 6}
      textAnchor="middle"
      fill="#ffffff"
      fontFamily={SERIF}
      fontWeight="bold"
      fontSize="16"
      letterSpacing="0.6"
    >
      {text}
    </text>
  </g>
);

const Star = ({ cx, cy, r }) => {
  const X = Number(cx);
  const Y = Number(cy);
  const R = Number(r);

  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? R : R * 0.45;
    const px = X + radius * Math.cos(angle);
    const py = Y + radius * Math.sin(angle);
    pts.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }

  return <polygon points={pts.join(' ')} fill={GOLD} />;
};

export default function MarksheetTemplate() {
  const colCenters = TABLE_COLS.slice(0, -1).map((x, i) => (x + TABLE_COLS[i + 1]) / 2);

  return (
    <svg
      viewBox="0 0 724 1024"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {/* ---------- Page background ---------- */}
      <rect x="0" y="0" width="724" height="1024" fill="#ffffff" />

      {/* ---------- Outer border (double frame) ---------- */}
      <rect x="18" y="18" width="688" height="988" fill="none" stroke={NAVY} strokeWidth="4" />
      <rect x="24" y="24" width="676" height="976" fill="none" stroke={NAVY} strokeWidth="1" />

      <Corner x={35} y={30} sx={1} sy={1} />
      <Corner x={689} y={30} sx={-1} sy={1} />
      <Corner x={35} y={994} sx={1} sy={-1} />
      <Corner x={689} y={994} sx={-1} sy={-1} />

      {/* ---------- Header ---------- */}
      {/* Left: B★SEL crest (same file used by Logo.jsx) */}
      <image
        href="/bsel_logo.png"
        x="44"
        y="36"
        width="76"
        height="76"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Middle-left: wordmark block, left-aligned, kept clear of the logo and the centre seal */}
      <text
        x="130"
        y="50"
        textAnchor="start"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="8"
        fill={NAVY}
      >
        Presents through its educational initiative
      </text>
      <text
        x="130"
        y="84"
        textAnchor="start"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="30"
        fill={NAVY}
      >
        B<tspan fill={GOLD}>★</tspan>SEL
      </text>
      <text
        x="130"
        y="98"
        textAnchor="start"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="7"
        fill={NAVY}
        letterSpacing="0.2"
      >
        BOARD OF SKILLS AND EDUCATIONAL LEARNING
      </text>

      {/* Centre: government / institutional seal, centred on the page */}
      <image
        href={centerSeal}
        x={PAGE_CENTER_X - 30}
        y="34"
        width="60"
        height="60"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Thin repeating watermark strip (navy background, gold border, white text) */}
      <rect
        x="24"
        y="120"
        width="676"
        height="14"
        fill={STRIP_BG}
        stroke={STRIP_BORDER}
        strokeWidth="1"
      />
      <text
        x="28"
        y="131"
        textLength="668"
        lengthAdjust="spacing"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="9"
        fill={STRIP_TEXT}
        opacity="0.85"
      >
        B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL B★SEL
      </text>

      {/* ---------- Section: Student & Course Details ---------- */}
      <SectionTitle x={197} y={142} w={331} h={22} fill={GOLD} text="STUDENT & COURSE DETAILS" />

      {LABELS.map((label, i) => {
        const cy = 181.4 + i * 26.2;
        return (
          <g key={label} fontFamily={SERIF} fontWeight="bold" fontSize="13" fill={NAVY}>
            <text x="57" y={cy + 5}>{label}</text>
            <text x="200" y={cy + 5}>:</text>
          </g>
        );
      })}

      {/* Photo frame (photo overlay sits inside this) */}
      <rect x="551" y="228" width="113" height="130" fill="none" stroke={GOLD} strokeWidth="3" />
      <rect x="556" y="233" width="103" height="120" fill="none" stroke={NAVY} strokeWidth="2" />

      {/* ---------- Section: Grade Card / Result Sheet ---------- */}
      <SectionTitle x={197} y={440} w={331} h={22} fill={NAVY} text="GRADE CARD / RESULT SHEET" />

      {/* ---------- Subjects & Marks table ---------- */}
      <rect x="37" y="467" width="650" height="283" fill="none" stroke={NAVY} strokeWidth="2" />

      <rect x="40" y="471" width="644" height="28" fill="none" stroke={NAVY} strokeWidth="1.5" />
      <text x="362" y="491" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="17" fill={NAVY}>
        SUBJECTS &amp; MARKS OBTAINED
      </text>

      {/* Column header row */}
      <rect x="40" y="504" width="644" height="37" fill="none" stroke={NAVY} strokeWidth="1.5" />
      {TABLE_HEADERS.map((h, i) => (
        <text
          key={h}
          x={colCenters[i]}
          y="527"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="10.5"
          fill={NAVY}
        >
          {h}
        </text>
      ))}

      {/* Vertical column dividers */}
      {TABLE_COLS.slice(1, -1).map((x) => (
        <line key={`v${x}`} x1={x} y1="504" x2={x} y2="722" stroke={NAVY} strokeWidth="1.2" />
      ))}

      {/* Horizontal row lines */}
      {ROW_LINES.map((y) => (
        <line key={`h${y}`} x1="40" y1={y} x2="684" y2={y} stroke={NAVY} strokeWidth="1.2" />
      ))}

      {/* Row numbers 1–5 */}
      {[559, 595, 631, 668, 704].map((cy, i) => (
        <text key={`n${i}`} x="62" y={cy + 4} textAnchor="middle" fontFamily={SERIF} fontSize="12" fill={NAVY}>
          {i + 1}
        </text>
      ))}

      <line x1="37" y1="722" x2="687" y2="722" stroke={NAVY} strokeWidth="1.5" />
      <text x="45" y="740" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10.5" fill={NAVY}>
        Grade Details:
      </text>

      {/* ---------- Totals / Grade ---------- */}
      <rect x="58" y="766" width="455" height="72" fill="none" stroke={NAVY} strokeWidth="2" />
      <line x1="58" y1="796" x2="513" y2="796" stroke={NAVY} strokeWidth="1.5" />
      <line x1="210" y1="796" x2="210" y2="838" stroke={NAVY} strokeWidth="1.2" />
      <line x1="362" y1="796" x2="362" y2="838" stroke={NAVY} strokeWidth="1.2" />
      <g fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill={NAVY} textAnchor="middle">
        <text x="134" y="789">Total Marks</text>
        <text x="286" y="789">Marks Obtained</text>
        <text x="437" y="789">Percentage</text>
      </g>

      <rect x="541" y="763" width="124" height="75" fill="none" stroke={NAVY} strokeWidth="2" />
      <line x1="541" y1="798" x2="665" y2="798" stroke={NAVY} strokeWidth="1.5" />
      <text x="603" y="787" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="17" fill={NAVY}>
        Grade
      </text>

      {/* ---------- Remarks & Date of Issue ---------- */}
      <rect x="57" y="852" width="456" height="48" fill="none" stroke={NAVY} strokeWidth="2" />
      <rect x="62" y="852" width="86" height="18" fill={NAVY} />
      <text x="105" y="865" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#ffffff">
        Remarks
      </text>
      <Star cx={85} cy={884} r={9} />

      <rect x="541" y="852" width="124" height="48" fill="none" stroke={NAVY} strokeWidth="2" />
      <rect x="546" y="852" width="108" height="18" fill={NAVY} />
      <text x="600" y="865" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#ffffff">
        Date of Issue
      </text>

      {/* ---------- Footer ---------- */}
      <text x="362" y="910" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9" fill={NAVY}>
        REGISTERED UNDER MINISTRY OF MSME, GOVT. OF INDIA
      </text>

      {/* Footer logos: MSME (left), IAF (centre), ISO 9001 (right) */}
      <image
        href={msmeLogo}
        x="283"
        y="922"
        width="60"
        height="32"
        preserveAspectRatio="xMidYMid meet"
      />
      <image
        href={iafLogo}
        x="346"
        y="918"
        width="62"
        height="42"
        preserveAspectRatio="xMidYMid meet"
      />
      <image
        href={isoLogo}
        x="418"
        y="918"
        width="50"
        height="50"
        preserveAspectRatio="xMidYMid meet"
      />

      <text x="362" y="978" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9" fill={NAVY}>
        REGISTERED UNDER GOVT. OF TAMIL NADU (REGD. TRUST)
      </text>

      {/* Principal / signature area */}
      <text x="60" y="972" fontFamily={SERIF} fontWeight="bold" fontSize="12" fill={GOLD}>
        Center Director / Principal
      </text>
      <image href="/marksheet/bsel-seal.png" x="562" y="918" width="58" height="58" preserveAspectRatio="xMidYMid meet" />
      <text x="518" y="972" fontFamily={SERIF} fontStyle="italic" fontWeight="bold" fontSize="12" fill={NAVY}>
        Authorized Signature
      </text>
    </svg>
  );
}