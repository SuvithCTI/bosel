const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'AboutPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const visionMissionHeader = '{/* =========================================================================\n          2 & 3. OUR VISION & OUR MISSION';
const visionMissionHeaderCRLF = '{/* =========================================================================\r\n          2 & 3. OUR VISION & OUR MISSION';

let vmStart = content.indexOf(visionMissionHeaderCRLF);
if (vmStart === -1) vmStart = content.indexOf(visionMissionHeader);

const whatWeDoHeader = '{/* =========================================================================\n          2. WHAT WE DO';
const whatWeDoHeaderCRLF = '{/* =========================================================================\r\n          2. WHAT WE DO';

let wwdStart = content.indexOf(whatWeDoHeaderCRLF);
if (wwdStart === -1) wwdStart = content.indexOf(whatWeDoHeader);

const founderHeader = '{/* =========================================================================\n          5. MEET OUR FOUNDER';
const founderHeaderCRLF = '{/* =========================================================================\r\n          5. MEET OUR FOUNDER';

let founderStart = content.indexOf(founderHeaderCRLF);
if (founderStart === -1) founderStart = content.indexOf(founderHeader);

if (vmStart === -1 || wwdStart === -1 || founderStart === -1) {
  console.error('Indices not found:', { vmStart, wwdStart, founderStart });
  process.exit(1);
}

const before = content.substring(0, vmStart);
let vmSection = content.substring(vmStart, wwdStart);
let wwdSection = content.substring(wwdStart, founderStart);
const after = content.substring(founderStart);

// Update section comments back to older format
vmSection = vmSection.replace('2 & 3. OUR VISION & OUR MISSION', '3 & 4. OUR VISION & OUR MISSION (SEPARATE VISUALLY APPEALING CARDS)');

// Swap: What We Do first (older position), then Vision & Mission
const restored = before + wwdSection + vmSection + after;

fs.writeFileSync(filePath, restored, 'utf8');
console.log('Successfully restored What We Do to older position in AboutPage.jsx');
