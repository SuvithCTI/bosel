import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Triggers a direct file download for a generated jsPDF instance.
 * Uses a blob URL anchor click with an automatic fallback to pdf.save().
 */
export const triggerDirectPdfDownload = (pdf, filename = 'document.pdf') => {
  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  try {
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = safeFilename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch {
        // ignore
      }
    }, 4000);
  } catch (err) {
    console.warn('Direct blob download fallback to pdf.save:', err);
    pdf.save(safeFilename);
  }
};

/**
 * High-precision, properly aligned PDF export from any HTML DOM element.
 *
 * Automatically handles:
 * - Proper A4 Portrait or Landscape page bounds
 * - Proportional scaling with zero distortion
 * - Perfect horizontal & vertical centering with clean margins
 * - html2canvas scroll offset normalization (no empty white gaps)
 * - Direct, instant browser file download
 */
export const exportPdfFromElement = async (element, options = {}) => {
  if (!element) {
    throw new Error('Target element for PDF export not found.');
  }

  const {
    filename = 'document.pdf',
    orientation = 'portrait',
    margin = orientation === 'landscape' ? 0 : 8, // mm
    backgroundColor = '#ffffff',
    scale = 2.5
  } = options;

  // 1. Capture DOM element using html2canvas with scroll-offset normalization
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth || document.documentElement.offsetWidth,
    backgroundColor
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // 2. Initialize jsPDF with standard A4 format
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const availWidth = pageWidth - margin * 2;
  const availHeight = pageHeight - margin * 2;

  // 3. Calculate proportional fit so content is NEVER distorted or clipped
  const canvasAspect = canvas.width / canvas.height;
  let renderWidth = availWidth;
  let renderHeight = availWidth / canvasAspect;

  if (renderHeight > availHeight) {
    renderHeight = availHeight;
    renderWidth = availHeight * canvasAspect;
  }

  // 4. Center horizontally and vertically within printable margins
  const x = margin + (availWidth - renderWidth) / 2;
  const y = margin + (availHeight - renderHeight) / 2;

  pdf.addImage(
    imgData,
    'JPEG',
    x,
    y,
    renderWidth,
    renderHeight,
    undefined,
    'FAST'
  );

  // 5. Trigger direct browser download
  triggerDirectPdfDownload(pdf, filename);
  return pdf;
};
