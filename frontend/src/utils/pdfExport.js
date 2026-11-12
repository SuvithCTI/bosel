import html2canvas from 'html2canvas-pro';
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
    allowTaint: false,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth || document.documentElement.offsetWidth,
    backgroundColor
  });

  let imgData;
  let format = 'JPEG';
  try {
    imgData = canvas.toDataURL('image/jpeg', 0.98);
  } catch {
    imgData = canvas.toDataURL('image/png');
    format = 'PNG';
  }

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
    format,
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

/**
 * Merges two HTML elements into a single multi-page PDF document:
 * - Page 1: Landscape element (Official Certificate - 297mm x 210mm)
 * - Page 2: Portrait element (Official Marksheet - 210mm x 297mm)
 * Automatically centers both pages proportionally with zero distortion,
 * and triggers immediate local file download.
 */
export const exportMergedLandscapeAndPortraitPdf = async ({
  page1Element,
  page2Element,
  filename = 'BSEL_Merged_Certificate_Marksheet.pdf',
  page1Scale = 2,
  page2Scale = 2
}) => {
  if (!page1Element || !page2Element) {
    throw new Error('Both Certificate and Marksheet elements must be present to merge.');
  }

  // 1. Capture Page 1 (Landscape Certificate)
  const p1Canvas = await html2canvas(page1Element, {
    scale: page1Scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: page1Element.scrollWidth || 1050,
    backgroundColor: '#fcfbf7'
  });

  let p1ImgData;
  let p1Format = 'JPEG';
  try {
    p1ImgData = p1Canvas.toDataURL('image/jpeg', 0.95);
  } catch {
    p1ImgData = p1Canvas.toDataURL('image/png');
    p1Format = 'PNG';
  }

  // 2. Capture Page 2 (Portrait Marksheet)
  const p2Canvas = await html2canvas(page2Element, {
    scale: page2Scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: page2Element.scrollWidth || 750,
    backgroundColor: '#ffffff'
  });

  let p2ImgData;
  let p2Format = 'JPEG';
  try {
    p2ImgData = p2Canvas.toDataURL('image/jpeg', 0.95);
  } catch {
    p2ImgData = p2Canvas.toDataURL('image/png');
    p2Format = 'PNG';
  }

  // 3. Initialize jsPDF Page 1 (Landscape A4: 297mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const p1Width = pdf.internal.pageSize.getWidth();
  const p1Height = pdf.internal.pageSize.getHeight();
  const p1Aspect = p1Canvas.width / p1Canvas.height;

  let p1W = p1Width;
  let p1H = p1Width / p1Aspect;
  if (p1H > p1Height) {
    p1H = p1Height;
    p1W = p1Height * p1Aspect;
  }
  const p1X = (p1Width - p1W) / 2;
  const p1Y = (p1Height - p1H) / 2;

  pdf.addImage(p1ImgData, p1Format, p1X, p1Y, p1W, p1H, undefined, 'FAST');

  // 4. Add Page 2 (Portrait A4: 210mm x 297mm)
  pdf.addPage('a4', 'portrait');
  const p2Width = pdf.internal.pageSize.getWidth();
  const p2Height = pdf.internal.pageSize.getHeight();
  const p2Margin = 6; // mm margin for clean printing

  const availP2W = p2Width - p2Margin * 2;
  const availP2H = p2Height - p2Margin * 2;
  const p2Aspect = p2Canvas.width / p2Canvas.height;

  let p2W = availP2W;
  let p2H = availP2W / p2Aspect;
  if (p2H > availP2H) {
    p2H = availP2H;
    p2W = availP2H * p2Aspect;
  }
  const p2X = p2Margin + (availP2W - p2W) / 2;
  const p2Y = p2Margin + (availP2H - p2H) / 2;

  pdf.addImage(p2ImgData, p2Format, p2X, p2Y, p2W, p2H, undefined, 'FAST');

  // 5. Trigger download directly to local storage
  triggerDirectPdfDownload(pdf, filename);
  return pdf;
};
