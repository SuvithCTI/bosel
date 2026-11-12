import abacusLogo from '../assets/partner-logos/abacus-logo.png';
import computerLogo from '../assets/partner-logos/computer-logo.png';
import danceLogo from '../assets/partner-logos/dance-logo.png';
import handwritingLogo from '../assets/partner-logos/handwriting-logo.png';
import phonicsLogo from '../assets/partner-logos/phonics-logo.png';

export const PROGRAM_PARTNER_LOGOS = {
  abacus: abacusLogo,
  'computer-fundamentals': computerLogo,
  computer: computerLogo,
  bharatanatyam: danceLogo,
  dance: danceLogo,
  handwriting: handwritingLogo,
  phonics: phonicsLogo,
};

export const getProgramPartnerLogo = (idOrProg) => {
  if (!idOrProg) return null;
  const str = typeof idOrProg === 'object'
    ? `${idOrProg.id || ''} ${idOrProg.name || ''} ${idOrProg.fullName || ''}`.toLowerCase()
    : String(idOrProg).toLowerCase();

  if (str.includes('abacus')) return abacusLogo;
  if (str.includes('handwriting')) return handwritingLogo;
  if (str.includes('phonic')) return phonicsLogo;
  if (str.includes('dance') || str.includes('bharat')) return danceLogo;
  if (str.includes('computer')) return computerLogo;

  return null;
};
