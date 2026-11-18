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
const TABLE_HEADER_BLUE = '#d4eefa'; // light blue column header row and grade value box

const PAGE_CENTER_X = 362;

// Watermark strip colours
const STRIP_BG = NAVY;        // strip background
const STRIP_BORDER = GOLD;    // strip border colour
const STRIP_TEXT = '#fde68a'; // strip text colour

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

const TABLE_COLS = [37, 88, 443, 504, 565, 626, 687];
const TABLE_HEADERS = [
  ['S.No.'],
  ['Subject / Module'],
  ['Max', 'Marks'],
  ['Practical'],
  ['Marks', 'Obtained'],
  ['Percentage'],
];

const ROW_LINES = [541, 577, 613, 650, 686, 722];

// Thickness for the table grid (thick lines like the reference sheet)
const TABLE_OUTER_STROKE = 4;
const TABLE_INNER_STROKE = 2.5;

// Navy band styling (matches the reference sheet's header bars)
const BAND_INSET = 4;          // distance of the white inner line from the band edge
const BAND_INNER_STROKE = 1.2; // weight of the white inner line

// Remarks box geometry (on the 724 x 1024 grid)
const REMARK_BOX = { x: 57, y: 852, w: 456, h: 48 };
const REMARK_STAR = { cx: 85, cy: 884, r: 9 };
const REMARK_TEXT_X = 102;
const REMARK_TEXT_Y = 889;

// Border geometry
// Thick navy outer frame, with the gold rule sitting inside it.
const FRAME_OUTER = { x: 10, y: 10, w: 704, h: 1007 }; // thick navy outer frame (stroke 8)
const FRAME_GOLD = { x: 22, y: 22, w: 680, h: 980 };   // gold rule; diamonds sit on this line

// Title bar spans from the table's top border down to the column header row,
// so there is no gap above or below it.
const SUBJECT_BAND = { x: 37, y: 467, w: 650, h: 37 };
const TOTALS_BAND = { x: 58, y: 766, w: 455, h: 30 };
const GRADE_BAND = { x: 541, y: 763, w: 124, h: 35 };

// Gold diamond on the gold rule at a corner (no outline)
const CornerDiamond = ({ x, y }) => {
  const d = 7;
  return (
    <polygon
      points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`}
      fill={GOLD}
      stroke="none"
    />
  );
};

// Smaller gold diamond at the middle of the left and right gold rule (no outline)
const EdgeDiamond = ({ x, y }) => {
  const d = 0;
  return (
    <polygon
      points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`}
      fill={GOLD}
      stroke="none"
    />
  );
};

// Navy header band with a thin white inset outline (as in the reference sheet)
const NavyBand = ({ x, y, w, h, inset = BAND_INSET }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={NAVY} stroke={NAVY} strokeWidth="2" />
    <rect
      x={x + inset}
      y={y + inset}
      width={w - inset * 2}
      height={h - inset * 2}
      fill="none"
      stroke="#ffffff"
      strokeWidth={BAND_INNER_STROKE}
    />
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

export default function MarksheetTemplate({ remark = null }) {
  const colCenters = TABLE_COLS.slice(0, -1).map((x, i) => (x + TABLE_COLS[i + 1]) / 2);

  const goldLeft = FRAME_GOLD.x;
  const goldRight = FRAME_GOLD.x + FRAME_GOLD.w;
  const goldTop = FRAME_GOLD.y;
  const goldBottom = FRAME_GOLD.y + FRAME_GOLD.h;
  const goldMidY = FRAME_GOLD.y + FRAME_GOLD.h / 2;

  return (
    <svg
      viewBox="0 0 724 1024"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {/* ---------- Page background ---------- */}
      <rect x="0" y="0" width="724" height="1024" fill="#ffffff" />

      {/* ---------- Border: thick navy outer frame and gold rule ---------- */}
      <rect
        x={FRAME_OUTER.x}
        y={FRAME_OUTER.y}
        width={FRAME_OUTER.w}
        height={FRAME_OUTER.h}
        fill="none"
        stroke={NAVY}
        strokeWidth="8"
      />
      <rect
        x={FRAME_GOLD.x}
        y={FRAME_GOLD.y}
        width={FRAME_GOLD.w}
        height={FRAME_GOLD.h}
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
      />

      {/* Corner diamonds on the gold rule */}
      <CornerDiamond x={goldLeft} y={goldTop} />
      <CornerDiamond x={goldRight} y={goldTop} />
      <CornerDiamond x={goldLeft} y={goldBottom} />
      <CornerDiamond x={goldRight} y={goldBottom} />

      {/* Edge diamonds at the middle of the left and right gold rule */}
      <EdgeDiamond x={goldLeft} y={goldMidY} />
      <EdgeDiamond x={goldRight} y={goldMidY} />

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

      {/* Middle-left: wordmark block, kept clear of the logo and the centre seal */}
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
        width="90"
        height="90"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Thin repeating watermark strip (navy background, gold border) */}
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
        const longLabel = label.length >= 19; // e.g. "School / Exam Centre"
        return (
          <g key={label} fontFamily={SERIF} fontWeight="bold" fontSize="16" fill={NAVY}>
            <text
              x="57"
              y={cy + 5}
              textLength={longLabel ? 136 : undefined}
              lengthAdjust="spacingAndGlyphs"
            >
              {label}
            </text>
            <text x="200" y={cy + 5}>:</text>
          </g>
        );
      })}

      {/* Photo frame (photo overlay sits inside this) */}
      <rect x="551" y="228" width="113" height="130" fill="none" stroke={GOLD} strokeWidth="3" />
      <rect x="556" y="233" width="103" height="120" fill="none" stroke={NAVY} strokeWidth="2" />

      {/* ---------- Section: Grade Card / Result Sheet ---------- */}
     

      {/* ---------- Subjects & Marks table ---------- */}
      {/* Outer thick navy border */}
      <rect
        x="37"
        y="467"
        width="650"
        height="283"
        fill="none"
        stroke={NAVY}
        strokeWidth={TABLE_OUTER_STROKE}
      />

      {/* Title bar: fills the space from the top border to the column header row */}
      <NavyBand {...SUBJECT_BAND} />
      <text
        x={SUBJECT_BAND.x + SUBJECT_BAND.w / 2}
        y={SUBJECT_BAND.y + SUBJECT_BAND.h / 2}
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        letterSpacing="0.8"
        fill="#ffffff"
      >
        SUBJECTS &amp; MARKS OBTAINED
      </text>

      {/* Column header row (light blue background) */}
      <rect
        x="40"
        y="504"
        width="644"
        height="37"
        fill={TABLE_HEADER_BLUE}
        stroke={NAVY}
        strokeWidth={TABLE_INNER_STROKE}
      />
      {TABLE_HEADERS.map((lines, i) => {
        const cx = colCenters[i];
        const startY = lines.length === 1 ? 527 : 519;

        return (
          <text
            key={lines.join(' ')}
            x={cx}
            y={startY}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="9.5"
            fill={NAVY}
          >
            {lines.map((line, j) => (
              <tspan key={j} x={cx} dy={j === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {/* Vertical column dividers (thick) */}
      {TABLE_COLS.slice(1, -1).map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="504"
          x2={x}
          y2="722"
          stroke={NAVY}
          strokeWidth={TABLE_INNER_STROKE}
        />
      ))}

      {/* Horizontal row lines (thick) */}
      {ROW_LINES.map((y) => (
        <line
          key={`h${y}`}
          x1="40"
          y1={y}
          x2="684"
          y2={y}
          stroke={NAVY}
          strokeWidth={TABLE_INNER_STROKE}
        />
      ))}

      {/* Row numbers 1–5 */}
      {[559, 595, 631, 668, 704].map((cy, i) => (
        <text key={`n${i}`} x="62" y={cy + 4} textAnchor="middle" fontFamily={SERIF} fontSize="12" fill={NAVY}>
          {i + 1}
        </text>
      ))}

      <line x1="37" y1="722" x2="687" y2="722" stroke={NAVY} strokeWidth={TABLE_OUTER_STROKE} />
      <text x="45" y="740" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10.5" fill={NAVY}>
        Grade Details:
      </text>

      {/* ---------- Totals / Grade ---------- */}
      <rect x="58" y="766" width="455" height="72" fill="none" stroke={NAVY} strokeWidth="2" />
      {/* Totals header band: navy with white inset outline */}
      <NavyBand {...TOTALS_BAND} />
      <line x1="58" y1="796" x2="513" y2="796" stroke={NAVY} strokeWidth="1.5" />
      <line x1="210" y1="796" x2="210" y2="838" stroke={NAVY} strokeWidth="1.2" />
      <line x1="362" y1="796" x2="362" y2="838" stroke={NAVY} strokeWidth="1.2" />
      <g fontFamily="Arial, sans-serif" fontSize="15" letterSpacing="0.5" fill="#ffffff" textAnchor="middle" dominantBaseline="central">
        <text x="134" y={TOTALS_BAND.y + TOTALS_BAND.h / 2}>Total Marks</text>
        <text x="286" y={TOTALS_BAND.y + TOTALS_BAND.h / 2}>Marks Obtained</text>
        <text x="437" y={TOTALS_BAND.y + TOTALS_BAND.h / 2}>Percentage</text>
      </g>

      <rect x="541" y="763" width="124" height="75" fill="none" stroke={NAVY} strokeWidth="2" />
      {/* Grade header band: navy with white inset outline */}
      <NavyBand {...GRADE_BAND} />
      {/* Grade value box: light blue fill */}
      <rect x="543" y="798" width="120" height="38" fill={TABLE_HEADER_BLUE} />
      <line x1="541" y1="798" x2="665" y2="798" stroke={NAVY} strokeWidth="1.5" />
      <text
        x={GRADE_BAND.x + GRADE_BAND.w / 2}
        y={GRADE_BAND.y + GRADE_BAND.h / 2}
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        letterSpacing="0.5"
        fill="#ffffff"
      >
        Grade
      </text>

      {/* ---------- Remarks & Date of Issue ---------- */}
      <rect
        x={REMARK_BOX.x}
        y={REMARK_BOX.y}
        width={REMARK_BOX.w}
        height={REMARK_BOX.h}
        fill="none"
        stroke={NAVY}
        strokeWidth="2"
      />
      <rect x="62" y="852" width="86" height="18" fill={NAVY} />
      <text x="105" y="865" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#ffffff">
        Remarks
      </text>
      <Star cx={REMARK_STAR.cx} cy={REMARK_STAR.cy} r={REMARK_STAR.r} />

      {/* Remark text (drawn only when a remark is provided) */}
      {remark && (
        <text
          x={REMARK_TEXT_X}
          y={REMARK_TEXT_Y + 1}
          textAnchor="start"
          fontFamily={SERIF}
          fontStyle="italic"
          fontWeight="bold"
          fontSize="16"
          fill={NAVY}
        >
          {`\u201C${remark}\u201D`}
        </text>
      )}

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