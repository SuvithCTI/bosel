import React from 'react';
import bselLogo from '../assets/bsel_logo.png';
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
const HEADER_FONT = "'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif";
const TABLE_HEADER_BLUE = '#d4eefa'; // light blue column header row and grade value box

const PAGE_CENTER_X = 362;

// Header blocks
// Symmetrical arrangement: Left text spans x=126..306, Center Seal is centered at x=362 (x=317..407),
// and Right text is centered at x=517 (spans x=427..607).
const LEFT_HEADER_CENTER_X = 226;
const RIGHT_HEADER_CENTER_X = 517;
const RIGHT_HEADER_MAX_WIDTH = 180;

// Watermark strip colours
const STRIP_BG = NAVY;
const STRIP_BORDER = GOLD;
const STRIP_TEXT = '#fde68a';

const DEFAULT_RIGHT_HEADING = {
  title: 'TENKASI',
  subtitle: 'VISION FOUNDATION',
  tagline: 'EDUCATION • EMPOWERMENT • EXCELLENCE',
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
  ['S.', 'No.'],
  ['Subject '],
  ['Max', 'Marks [60]'],
  ['Assessment', '[40]'],
  ['Marks', 'Obtained '],
  ['Percentage', '%'],
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
  measureCtx.font = "900 100px 'Cinzel', 'Outfit', Georgia, serif";
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

// Sizing specifically for right header to match BSEL details on left and fit evenly
const fitRightTitleSize = (text) => {
  const str = String(text || '').trim();
  if (!str) return 25;
  const widthAt25 = (measureAt100px(str) / 100) * 25 + str.length * 1.8;
  if (widthAt25 <= RIGHT_HEADER_MAX_WIDTH) return 25;
  return Math.max(16, Math.round((RIGHT_HEADER_MAX_WIDTH / (measureAt100px(str) / 100 + str.length * 0.018)) * 10) / 10);
};

const fitRightSubtitleSize = (text) => {
  const str = String(text || '').trim();
  if (!str) return 10.5;
  const widthAtTarget = (measureAt100px(str) / 100) * 10.5 + str.length * 1.2;
  if (widthAtTarget <= RIGHT_HEADER_MAX_WIDTH) return 10.5;
  return Math.max(7.5, Math.round((RIGHT_HEADER_MAX_WIDTH / (measureAt100px(str) / 100 + str.length * 0.012)) * 10) / 10);
};

const fitRightMottoSize = (text) => {
  const str = String(text || '').trim();
  if (!str) return 7;
  const widthAtTarget = (measureAt100px(str) / 100) * 7 + str.length * 0.35;
  if (widthAtTarget <= RIGHT_HEADER_MAX_WIDTH) return 7;
  return Math.max(5.5, Math.round((RIGHT_HEADER_MAX_WIDTH / (measureAt100px(str) / 100 + str.length * 0.0035)) * 10) / 10);
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

export default function MarksheetTemplate({
  remark = null,
  rightHeading = null,
  qrCodeDataUrl = null,
  studentData = null,
  subjects = [],
  summary = null,
  photoUrl = null,
  schoolLogo = null,
  directorSign = null,
  paperType = null,
  issueDate = null,
  showMarks = true,
}) {
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

  const cellW = 724 / 16;
  const cellH = 1024 / 48;
  const watermarkTiles = [];
  for (let r = 0; r < 48; r++) {
    for (let c = 0; c < 16; c++) {
      watermarkTiles.push({
        key: `${r}-${c}`,
        x: c * cellW + cellW / 2,
        y: r * cellH + cellH / 2,
      });
    }
  }
  const EMBLEM_SIZE = 362;
  const EMBLEM_X = 724 / 2 - EMBLEM_SIZE / 2;
  const EMBLEM_Y = 1024 / 2 - EMBLEM_SIZE / 2;

  const studentValues = studentData
    ? [
        studentData.registrationNo || '',
        studentData.certificateNo || '',
        (studentData.studentName || '').toUpperCase(),
        studentData.parentName || '',
        studentData.dob || '',
        (studentData.displayCourse || studentData.courseName || '').slice(0, 10).toUpperCase(),
        studentData.level || '',
        studentData.duration || '',
        studentData.school || studentData.centreName || '',
        studentData.address || studentData.centreAddress || '',
      ]
    : null;

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
        <clipPath id="bsel-watermark-clip">
          <rect x="24" y="24" width="676" height="976" />
        </clipPath>
        <radialGradient id="bsel-emblem-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" />
          <stop offset="72%" stopColor="black" />
          <stop offset="100%" stopColor="white" />
        </radialGradient>
        <mask id="bsel-watermark-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="724" height="1024">
          <rect x="0" y="0" width="724" height="1024" fill="white" />
          <rect
            x={EMBLEM_X}
            y={EMBLEM_Y}
            width={EMBLEM_SIZE}
            height={EMBLEM_SIZE}
            fill="url(#bsel-emblem-fade)"
          />
        </mask>
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

      {/* Background Watermark Tiles */}
      <g clipPath="url(#bsel-watermark-clip)">
        <g mask="url(#bsel-watermark-mask)">
          {watermarkTiles.map((t) => (
            <text
              key={t.key}
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Times New Roman', Times, serif"
              fontWeight="700"
              fontSize="11"
              fill="#0b2a55"
              fillOpacity="0.08"
            >
              B★SEL
            </text>
          ))}
        </g>
      </g>

      {/* Centre emblem: watermark logo */}
      <image
        href={bselLogo}
        xlinkHref={bselLogo}
        x={EMBLEM_X}
        y={EMBLEM_Y}
        width={EMBLEM_SIZE}
        height={EMBLEM_SIZE}
        opacity="0.09"
        preserveAspectRatio="xMidYMid meet"
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
        href={bselLogo}
        xlinkHref={bselLogo}
        x="44"
        y="34"
        width="74"
        height="74"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Left block: three-line wordmark, evenly sized and spaced to match Right block */}
      <text
        x="126"
        y="62"
        textAnchor="start"
        fontFamily={HEADER_FONT}
        fontWeight="900"
        fontSize="25"
        letterSpacing="1.8"
        fill={NAVY}
      >
        B <tspan fill={GOLD}>★</tspan> SEL
      </text>
      <text
        x="126"
        y="82"
        textAnchor="start"
        fontFamily={HEADER_FONT}
        fontWeight="800"
        fontSize="10.5"
        letterSpacing="1.2"
        fill={NAVY}
      >
        LEARN • GROW • ACHIEVE
      </text>
      <text
        x="126"
        y="100"
        textAnchor="start"
        fontFamily={HEADER_FONT}
        fontWeight="700"
        fontSize="7"
        letterSpacing="0.3"
        fill={NAVY}
      >
        BOARD OF SKILLS AND EDUCATIONAL LEARNING
      </text>

      {/* Centre: government / institutional seal, perfectly centered at PAGE_CENTER_X (362) */}
      <image
        href={centerSeal}
        x={PAGE_CENTER_X - 45}
        y="25"
        width="90"
        height="90"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Right block: institution heading, evenly sized and aligned with left BSEL block */}
      <text
        x={RIGHT_HEADER_CENTER_X}
        y="62"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="900"
        fontSize={fitRightTitleSize(heading.title)}
        letterSpacing="1.8"
        fill={NAVY}
      >
        {String(heading.title || '').slice(0, 12).toUpperCase()}
      </text>
      <text
        x={RIGHT_HEADER_CENTER_X}
        y="82"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="800"
        fontSize={fitRightSubtitleSize(heading.subtitle)}
        letterSpacing="1.2"
        fill={NAVY}
      >
        {String(heading.subtitle || '').slice(0, 22).toUpperCase()}
      </text>
      {/* Right block tagline: same fixed size and spacing as the left block's third line */}
      <text
        x={RIGHT_HEADER_CENTER_X}
        y="100"
        textAnchor="middle"
        fontFamily={HEADER_FONT}
        fontWeight="700"
        fontSize={fitRightMottoSize(heading.tagline)}
        letterSpacing="0.35"
        fill={NAVY}
      >
        {String(heading.tagline || '').slice(0, 30).toUpperCase()}
      </text>

      {/* School logo */}
      {schoolLogo && (
        <image
          href={schoolLogo}
          xlinkHref={schoolLogo}
          x="615"
          y="40"
          width="58"
          height="62"
          preserveAspectRatio="xMidYMid meet"
        />
      )}

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
            {/* Thin repeating watermark strip: whole words only, centred on the strip */}
      {(() => {
        const count = 16;      // number of full words across the strip
        const spacing = 42;    // distance between word centres
        const centerX = 362;   // centre of the 724-wide page

        return Array.from({ length: count }, (_, i) => (
          <text
            key={`strip-${i}`}
            x={centerX + (i - (count - 1) / 2) * spacing}
            y="131"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize="9"
            fill={STRIP_TEXT}
            opacity="0.85"
          >
            B★SEL
          </text>
        ));
      })()}

      {/* ---------- Section: Student & Course Details ---------- */}
      <SectionTitle x={197} y={142} w={331} h={22} fill={GOLD} text="STUDENT & COURSE DETAILS" />

      {LABELS.map((label, i) => {
        const cy = 181.4 + i * 26.2;
        const longLabel = label.length >= 19;
        const val = studentValues ? studentValues[i] : null;
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
            {val && (
              <text
                x="215"
                y={cy + 5}
                fill="#000000"
                fontFamily={SERIF}
                fontWeight="bold"
                fontSize="15"
              >
                {val}
              </text>
            )}
          </g>
        );
      })}

      {/* QR Code frame (just left to the photo) */}
      <rect x="428" y="228" width="113" height="130" fill="#ffffff" stroke={GOLD} strokeWidth="3" />
      <rect x="433" y="233" width="103" height="120" fill="#ffffff" stroke={NAVY} strokeWidth="2" />
      {qrCodeDataUrl ? (
        <image
          href={qrCodeDataUrl}
          xlinkHref={qrCodeDataUrl}
          x="438"
          y="238"
          width="93"
          height="93"
          preserveAspectRatio="xMidYMid meet"
        />
      ) : null}
      <text
        x="484.5"
        y="346"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="7.5"
        letterSpacing="0.4"
        fill={NAVY}
      >
        SCAN TO VERIFY
      </text>

      {/* Photo frame (photo overlay sits inside this) */}
      <rect x="551" y="228" width="113" height="130" fill="#ffffff" stroke={GOLD} strokeWidth="3" />
      <rect x="556" y="233" width="103" height="120" fill="#ffffff" stroke={NAVY} strokeWidth="2" />
      {photoUrl ? (
        <image
          href={photoUrl}
          xlinkHref={photoUrl}
          x="557"
          y="234"
          width="101"
          height="118"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <g>
          <circle cx="607.5" cy="285" r="32" fill="#081d3d" />
          <path d="M607.5 275 L611 286 L622.5 286 L613.3 292.8 L616.8 303.8 L607.5 297 L598.2 303.8 L601.7 292.8 L592.5 286 L604 286 Z" fill={GOLD} />
          <text x="607.5" y="325" textAnchor="middle" fontFamily={SERIF} fontWeight="bold" fontSize="8" fill={NAVY}>OFFICIAL</text>
        </g>
      )}

      {paperType && (
        <g>
          <rect x="612" y="132" width="60" height="44" fill="#fde047" stroke={NAVY} strokeWidth="2" rx="3" />
          <text x="642" y="145" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="7" fill={NAVY}>TYPE</text>
          <text x="642" y="167" textAnchor="middle" fontFamily={SERIF} fontWeight="900" fontSize="16" fill={NAVY}>{paperType}</text>
        </g>
      )}
      {/* ---------- Heading above the subjects table ---------- */}
      <SectionTitle x={197} y={440} w={331} h={22} fill={GOLD} text="GRADE CARD & RESULT" />
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
        const startY = 519;

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

      {showMarks && subjects && subjects.slice(0, 5).map((sub, i) => {
        const cy = [559, 595, 631, 668, 704][i];
        const asm = sub.assessment !== null && sub.assessment !== undefined ? Math.round(Number(sub.assessment)) : 0;
        const exam = sub.exam !== null && sub.exam !== undefined ? Math.round(Number(sub.exam)) : 0;
        const total = sub.marks !== null && sub.marks !== undefined ? Math.round(Number(sub.marks)) : (asm + exam);
        return (
          <g key={sub.id || i} fontFamily={SERIF} fontWeight="bold" fill={NAVY}>
            <text x="94" y={cy + 4} fontSize="12" fill={NAVY}>
              {sub.name}
            </text>
            <text x="473.5" y={cy + 4} textAnchor="middle" fontSize="12" fill={NAVY}>
              60
            </text>
            <text x="534.5" y={cy + 4} textAnchor="middle" fontSize="12" fill={NAVY}>
              {asm}
            </text>
            <text x="595.5" y={cy + 4} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={NAVY}>
              {exam}
            </text>
            <text x="656.5" y={cy + 4} textAnchor="middle" fontSize="12" fill={NAVY}>
              {`${total}%`}
            </text>
          </g>
        );
      })}

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

      {showMarks && summary && (
        <g fontFamily={SERIF} fontWeight="900" fill={NAVY} textAnchor="middle" dominantBaseline="central">
          <text x="134" y="817" fontSize="15">{summary.totalMax || 500}</text>
          <text x="286" y="817" fontSize="15">{summary.totalObtained ?? 0}</text>
          <text x="437" y="817" fontSize="15">{summary.percentage ? `${summary.percentage}%` : '0%'}</text>
        </g>
      )}

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

      {showMarks && summary && (
        <text
          x="603"
          y="817"
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight="900"
          fontSize="22"
          fill="#b45309"
        >
          {summary.overallGrade || 'D'}
        </text>
      )}

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

      {showMarks && issueDate && (
        <text
          x="600"
          y="884"
          textAnchor="middle"
          fontFamily={SERIF}
          fontSize="13"
          fontWeight="bold"
          fill={NAVY}
        >
          {issueDate}
        </text>
      )}

      {/* ---------- Footer ---------- */}
      {/* Footer headings (centred over their logo groups, clear of the Remarks box) */}
      
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
      <text x="60" y="989" fontFamily={SERIF} fontWeight="bold" fontSize="12" fill={NAVY}>
        Center Director / Principal
      </text>

      {directorSign && (
        <image
          href={directorSign}
          xlinkHref={directorSign}
          x="55"
          y="930"
          width="120"
          height="55"
          preserveAspectRatio="xMidYMid meet"
        />
      )}

      {/* Authorized signature image: wider, centred over the label */}
      <image
        href={signImage}
        x="495"
        y="880"
        width="230"
        height="130"
        preserveAspectRatio="xMidYMid meet"
      />
      <text x="618" y="989" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight="bold" fontSize="12" fill={NAVY}>
        Authorized Signature
      </text>
    </svg>
  );
}