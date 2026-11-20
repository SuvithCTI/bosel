import React from 'react';
import centerSeal from '../assets/cert_center_gold_emblem.png';
import msmeLogo from '../assets/msme-logo.png';
import iafLogo from '../assets/iaf-logo.png';
import isoLogo from '../assets/iso-9001-logo.png';
import signImage from '../assets/Sign.png';

// Vector version of the B★SEL marksheet template.
// Drawn on a 724 x 1024 grid, the same grid the data overlays use,
// so the percentage positions in OfficialMarksheetView still line up.

const NAVY = '#0b2a55';
const GOLD = '#b8892f';
const SERIF = "'Times New Roman', Times, serif";
const HEADER_FONT = 'Georgia, serif';
const TABLE_HEADER_BLUE = '#d4eefa'; // light blue column header row and grade value box

const PAGE_CENTER_X = 362;

// Header blocks
// Left wordmark is centred on x = 226.
// Right block sits between the centre seal (ends at x = 422) and the logo box (starts at about x = 627),
// so it spans x = 430 to 606.
const LEFT_HEADER_CENTER_X = 226;
const RIGHT_HEADER_CENTER_X = 518;
const RIGHT_HEADER_MAX_WIDTH = 176;

// Watermark strip colours
const STRIP_BG = NAVY;
const STRIP_BORDER = GOLD;
const STRIP_TEXT = '#fde68a';

const DEFAULT_RIGHT_HEADING = {
  title: 'TENKASI',
  subtitle: 'VISION FOUNDATION',
  tagline: 'EDUCATION · EMPOWERMENT · EXCELLENCE',
};

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
  ['Assessment'],
  ['Marks', 'Obtained'],
  ['Percentage'],
];

const ROW_LINES = [541, 577, 613, 650, 686, 722];

// Thickness for the table grid
const TABLE_OUTER_STROKE = 4;
const TABLE_INNER_STROKE = 2.5;

// Navy band styling
const BAND_INSET = 4;
const BAND_INNER_STROKE = 1.2;

// Remarks box geometry (on the 724 x 1024 grid)
const REMARK_BOX = { x: 57, y: 852, w: 456, h: 48 };
const REMARK_STAR = { cx: 85, cy: 884, r: 9 };
const REMARK_TEXT_X = 102;
const REMARK_TEXT_Y = 889;

// Border geometry
const FRAME_OUTER = { x: 10, y: 10, w: 704, h: 1007 };
const FRAME_GOLD = { x: 22, y: 22, w: 680, h: 980 };

// Title bar spans from the table's top border down to the column header row
const SUBJECT_BAND = { x: 37, y: 467, w: 650, h: 37 };
const TOTALS_BAND = { x: 58, y: 766, w: 455, h: 30 };
const GRADE_BAND = { x: 541, y: 763, w: 124, h: 35 };

// Measures real text width in the browser so the fit is accurate
let measureCtx = null;
const measureAt100px = (text) => {
  const str = String(text || '');
  if (typeof document === 'undefined') return str.length * 60;
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.font = 'bold 100px Georgia, serif';
  return measureCtx.measureText(str).width;
};

// Returns the largest font size up to maxSize that fits maxWidth.
// emSpacing approximates the letter-spacing added per character, in px per px of font size.
const fitHeaderSize = (text, maxSize, maxWidth = RIGHT_HEADER_MAX_WIDTH, emSpacing = 0.01) => {
  const str = String(text || '');
  const widthPerPx = measureAt100px(str) / 100 + str.length * emSpacing;
  if (widthPerPx <= 0) return maxSize;
  return Math.round(Math.min(maxSize, maxWidth / widthPerPx) * 10) / 10;
};

// Gold diamond on the gold rule at a corner
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

// Edge diamond placeholder (size 0 keeps it invisible, as in the reference)
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

// Navy header band with a thin white inset outline
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

export default function MarksheetTemplate({ remark = null, rightHeading = null }) {
  const colCenters = TABLE_COLS.slice(0, -1).map((x, i) => (x + TABLE_COLS[i + 1]) / 2);

  const goldLeft = FRAME_GOLD.x;
  const goldRight = FRAME_GOLD.x + FRAME_GOLD.w;
  const goldTop = FRAME_GOLD.y;
  const goldBottom = FRAME_GOLD.y + FRAME_GOLD.h;
  const goldMidY = FRAME_GOLD.y + FRAME_GOLD.h / 2;

  // Fall back to the defaults for any empty or missing value
  const heading = {
    title: rightHeading?.title || DEFAULT_RIGHT_HEADING.title,
    subtitle: rightHeading?.subtitle || DEFAULT_RIGHT_HEADING.subtitle,
    tagline: rightHeading?.tagline || DEFAULT_RIGHT_HEADING.tagline,
  };

  return (
    <svg
      viewBox="0 0 724 1024"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="strip-clip">
          <rect x="28" y="0" width="668" height="200" />
        </clipPath>
      </defs>

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
      {/* Left: B★SEL crest */}
      <image
        href="/bsel_logo.png"
        x="44"
        y="36"
        width="76"
        height="76"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Left block: three-line wordmark, centred between the crest and the centre seal */}
      <text
        x={LEFT_HEADER_CENTER_X}
        y="62"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="bold"
        fontSize="30"
        fill={NAVY}
      >
        B<tspan fill={GOLD}>★</tspan>SEL
      </text>
      <text
        x={LEFT_HEADER_CENTER_X}
        y="78"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="bold"
        fontSize="11"
        letterSpacing="0.3"
        fill={NAVY}
      >
        Learn · Grow · Achieve
      </text>
      <text
        x={LEFT_HEADER_CENTER_X}
        y="94"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="bold"
        fontSize="7"
        letterSpacing="0.2"
        fill={NAVY}
      >
        BOARD OF SKILLS AND EDUCATIONAL LEARNING
      </text>

      {/* Centre: government / institutional seal */}
      <image
        href={centerSeal}
        x={PAGE_CENTER_X - 30}
        y="34"
        width="90"
        height="90"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Right block: institution heading, same font, baselines and styling as the left block */}
      <text
        x={RIGHT_HEADER_CENTER_X}
        y="62"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="bold"
        fontSize={fitHeaderSize(heading.title, 40, RIGHT_HEADER_MAX_WIDTH, 0.3)}
        letterSpacing="0.3"
        fill={NAVY}
      >
        {heading.title}
      </text>
      <text
        x={RIGHT_HEADER_CENTER_X}
        y="78"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="bold"
        fontSize={fitHeaderSize(heading.subtitle, 16, RIGHT_HEADER_MAX_WIDTH, 0.3)}
        letterSpacing="0.3"
        fill={NAVY}
      >
        {heading.subtitle}
      </text>
      {/* Right block tagline: same fixed size and spacing as the left block's third line */}
<text
  x={RIGHT_HEADER_CENTER_X}
  y="94"
  textAnchor="middle"
  fontFamily={HEADER_FONT}
  fontWeight="bold"
  fontSize="7"
  letterSpacing="0.2"
  fill={NAVY}
>
  {heading.tagline}
</text>

      {/* Thin repeating watermark strip */}
      <rect
        x="24"
        y="120"
        width="676"
        height="14"
        fill={STRIP_BG}
        stroke={STRIP_BORDER}
        strokeWidth="1"
      />
      <g clipPath="url(#strip-clip)">
        <text
          x="28"
          y="131"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="9"
          fill={STRIP_TEXT}
          opacity="0.85"
          xmlSpace="preserve"
        >
          {Array(40).fill("B★SEL").join("\u00A0\u00A0\u00A0\u00A0")}
        </text>
      </g>

      {/* ---------- Section: Student & Course Details ---------- */}
      <SectionTitle x={197} y={142} w={331} h={22} fill={GOLD} text="STUDENT & COURSE DETAILS" />

      {LABELS.map((label, i) => {
        const cy = 181.4 + i * 26.2;
        const longLabel = label.length >= 19;
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

      {/* ---------- Subjects & Marks table ---------- */}
      <rect
        x="37"
        y="467"
        width="650"
        height="283"
        fill="none"
        stroke={NAVY}
        strokeWidth={TABLE_OUTER_STROKE}
      />

      {/* Title bar */}
      <NavyBand {...SUBJECT_BAND} />
      <text
        x={SUBJECT_BAND.x + SUBJECT_BAND.w / 2}
        y={SUBJECT_BAND.y + SUBJECT_BAND.h / 2}
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Georgia, serif"
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

      {/* Vertical column dividers */}
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

      {/* Horizontal row lines */}
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
      <NavyBand {...GRADE_BAND} />
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
      {/* Footer headings (centred over their logo groups, clear of the Remarks box) */}
      <text x="292" y="916" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="7.5" fill={NAVY}>
        REGISTERED UNDER
      </text>
      <text x="397" y="916" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="7.5" fill={NAVY}>
        AUTHORIZED AFFILIATES
      </text>

      {/* Footer row 1: three logos, bottom-aligned on y = 966 */}
      <image
        href={msmeLogo}
        x="262"
        y="924"
        width="60"
        height="32"
        preserveAspectRatio="xMidYMid meet"
      />
      <image
        href={iafLogo}
        x="336"
        y="924"
        width="62"
        height="38"
        preserveAspectRatio="xMidYMid meet"
      />
      <image
        href={isoLogo}
        x="412"
        y="924"
        width="46"
        height="42"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Footer row 2: MSME text */}
      <text x="362" y="975" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9" fill={NAVY}>
        REGISTERED UNDER MINISTRY OF MSME, GOVT. OF INDIA
      </text>

      {/* Footer row 3: one gold star */}
      <Star cx="362" cy="983" r="3.5" />

      {/* Footer row 4: Tamil Nadu text */}
      <text x="362" y="994" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9" fill={NAVY}>
        REGISTERED UNDER GOVT. OF TAMIL NADU (REGD. TRUST)
      </text>

      {/* Principal / signature area */}
      <text x="60" y="972" fontFamily={SERIF} fontWeight="bold" fontSize="12" fill={NAVY}>
        Center Director / Principal
      </text>

      {/* Authorized signature image: wider, centred over the label */}
      <image
        href={signImage}
        x="523"
        y="890"
        width="200"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />
      <text x="618" y="972" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight="bold" fontSize="12" fill={NAVY}>
        Authorized Signature
      </text>
    </svg>
  );
}