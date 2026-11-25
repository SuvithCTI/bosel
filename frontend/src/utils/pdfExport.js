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
 * High-fidelity native SVG rasterizer:
 * Converts an SVG element directly to a high-resolution Canvas by converting
 * nested <image> tags to data URLs and preserving all vector patterns, gradients,
 * filters, and typography identically to the live browser preview.
 */
export const svgElementToCanvas = async (svgEl, scale = 3) => {
  if (!svgEl) return null;

  try {
    // 1. Clone the SVG
    const clone = svgEl.cloneNode(true);

    // 2. Remove all .print:hidden and helper edit elements from clone
    const hiddenEls = clone.querySelectorAll('.print\\:hidden, [class*="print:hidden"], [data-html2canvas-ignore="true"]');
    hiddenEls.forEach((el) => el.remove());

    // 3. Compute target resolution based on viewBox or bounding rect
    const viewBox = clone.viewBox?.baseVal;
    const vbW = viewBox && viewBox.width > 0 ? viewBox.width : 1070;
    const vbH = viewBox && viewBox.height > 0 ? viewBox.height : 757;
    const width = Math.round(vbW * scale);
    const height = Math.round(vbH * scale);

    clone.setAttribute('width', `${width}`);
    clone.setAttribute('height', `${height}`);

    // 4. Convert all <image> hrefs to self-contained data URLs (base64)
    const images = clone.querySelectorAll('image');
    for (const img of images) {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href');
      if (href && !href.startsWith('data:')) {
        let converted = false;
        // Method A: Fetch as Blob and convert via FileReader (no canvas tainting)
        try {
          const resp = await fetch(href);
          if (resp.ok) {
            const blob = await resp.blob();
            const dataUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(blob);
            });
            if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
              img.setAttribute('href', dataUrl);
              img.setAttribute('xlink:href', dataUrl);
              converted = true;
            }
          }
        } catch {
          // Ignore and try fallback
        }

        // Method B: Image element drawing into offscreen canvas
        if (!converted) {
          try {
            const offImg = new Image();
            offImg.crossOrigin = 'anonymous';
            await new Promise((res) => {
              offImg.onload = res;
              offImg.onerror = res;
              offImg.src = href;
            });
            if (offImg.naturalWidth) {
              const offCanvas = document.createElement('canvas');
              offCanvas.width = offImg.naturalWidth;
              offCanvas.height = offImg.naturalHeight;
              const ctx = offCanvas.getContext('2d');
              ctx.drawImage(offImg, 0, 0);
              const dataUrl = offCanvas.toDataURL('image/png');
              img.setAttribute('href', dataUrl);
              img.setAttribute('xlink:href', dataUrl);
            }
          } catch {
            // Keep original href if conversion fails
          }
        }
      }
    }

    // 5. Inject font styles inside SVG <style>
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Great+Vibes&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    `;
    clone.prepend(styleEl);

    // 6. Serialize and render via Image
    const xml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);

    const renderImg = new Image();
    await new Promise((resolve, reject) => {
      renderImg.onload = resolve;
      renderImg.onerror = reject;
      renderImg.src = blobUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(renderImg, 0, 0, width, height);
    URL.revokeObjectURL(blobUrl);

    return canvas;
  } catch (err) {
    console.warn('Native SVG rasterization fallback to html2canvas:', err);
    return null;
  }
};

/**
 * High-precision, properly aligned PDF export from any HTML DOM element.
 */
export const exportPdfFromElement = async (element, options = {}, maybeOpts = {}) => {
  if (!element) {
    throw new Error('Target element for PDF export not found.');
  }

  const resolvedOpts = typeof options === 'string'
    ? { filename: options, ...maybeOpts }
    : (options || {});

  const {
    filename = 'document.pdf',
    orientation = 'portrait',
    margin = orientation === 'landscape' ? 0 : 0, // mm - default 0 for authentic full-bleed official documents
    backgroundColor = '#ffffff',
    scale = 2.5
  } = resolvedOpts;

  // Wait for all webfonts (Cinzel, Great Vibes, Outfit, etc.) to be fully ready
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  // 1. Check if the element IS or strictly contains the official Certificate SVG
  let canvas = null;
  const certSvg = element.id === 'printable-certificate-svg'
    ? element
    : element.querySelector?.('#printable-certificate-svg');

  if (certSvg) {
    canvas = await svgElementToCanvas(certSvg, scale);
  }

  // 2. High-fidelity html2canvas rasterization (preserves desktop alignment even when generated on mobile)
  if (!canvas) {
    canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(element.scrollWidth || 0, document.documentElement.offsetWidth || 0, 1024),
      backgroundColor,
      ignoreElements: (el) => {
        return (
          el.classList?.contains('print:hidden') ||
          el.classList?.contains('no-print') ||
          el.getAttribute?.('data-html2canvas-ignore') === 'true'
        );
      },
      onclone: (_clonedDoc, clonedEl) => {
        const target = clonedEl || _clonedDoc.body;
        target.style.transform = 'none';
        target.style.margin = '0';

        // Marksheet desktop dimension lock
        const ms = target.id === 'printable-marksheet-sheet' ? target : target.querySelector?.('#printable-marksheet-sheet');
        if (ms) {
          ms.style.width = '724px';
          ms.style.maxWidth = '724px';
          ms.style.aspectRatio = '724 / 1024';
          ms.style.margin = '0 auto';
        }

        // Certificate desktop dimension lock
        const cert = target.id === 'printable-certificate' ? target : target.querySelector?.('#printable-certificate');
        if (cert) {
          cert.style.width = '1024px';
          cert.style.maxWidth = '1024px';
          cert.style.margin = '0 auto';
        }

        // Question paper booklet dimension lock
        const qp = target.id === 'printable-question-paper' ? target : target.querySelector?.('#printable-question-paper, .batch-qp-page');
        if (qp) {
          qp.style.width = '724px';
          qp.style.maxWidth = '724px';
          qp.style.margin = '0 auto';
        }

        // Admission form dimension lock
        const adm = target.id === 'printable-admission-form' ? target : target.querySelector?.('#printable-admission-form, [data-merged-admission-form]');
        if (adm) {
          adm.style.width = '794px';
          adm.style.maxWidth = '794px';
          adm.style.margin = '0 auto';
        }
      }
    });
  }

  let imgData;
  let format = 'PNG';
  try {
    imgData = canvas.toDataURL('image/png');
  } catch {
    imgData = canvas.toDataURL('image/jpeg', 0.98);
    format = 'JPEG';
  }

  // 3. Initialize jsPDF with standard A4 format
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

  // 4. Calculate proportional fit so content is NEVER distorted or clipped
  const canvasAspect = canvas.width / canvas.height;
  let renderWidth = availWidth;
  let renderHeight = availWidth / canvasAspect;

  if (renderHeight > availHeight) {
    renderHeight = availHeight;
    renderWidth = availHeight * canvasAspect;
  }

  // 5. Center horizontally and vertically within printable margins
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

  // 6. Trigger direct browser download
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
  page1Scale = 2.5,
  page2Scale = 2.5
}) => {
  if (!page1Element || !page2Element) {
    throw new Error('Both Certificate and Marksheet elements must be present to merge.');
  }

  // Wait for all webfonts to be ready
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  // 1. Capture Page 1 (Landscape Certificate)
  const certSvg = page1Element.id === 'printable-certificate-svg'
    ? page1Element
    : page1Element.querySelector?.('#printable-certificate-svg');

  let p1Canvas = null;
  if (certSvg) {
    p1Canvas = await svgElementToCanvas(certSvg, page1Scale || 2.5);
  }
  if (!p1Canvas) {
    p1Canvas = await html2canvas(page1Element, {
      scale: page1Scale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1050,
      backgroundColor: '#ffffff',
      onclone: (_clonedDoc, clonedEl) => {
        const cert = clonedEl.id === 'printable-certificate' ? clonedEl : clonedEl.querySelector?.('#printable-certificate');
        if (cert) {
          cert.style.width = '1024px';
          cert.style.maxWidth = '1024px';
          cert.style.margin = '0 auto';
        }
      }
    });
  }

  let p1ImgData;
  let p1Format = 'JPEG';
  try {
    p1ImgData = p1Canvas.toDataURL('image/jpeg', 0.98);
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
    windowWidth: 1024,
    backgroundColor: '#ffffff',
    onclone: (_clonedDoc, clonedEl) => {
      const ms = clonedEl.id === 'printable-marksheet-sheet' ? clonedEl : clonedEl.querySelector?.('#printable-marksheet-sheet');
      if (ms) {
        ms.style.width = '724px';
        ms.style.maxWidth = '724px';
        ms.style.aspectRatio = '724 / 1024';
        ms.style.margin = '0 auto';
      }
    }
  });

  let p2ImgData;
  let p2Format = 'JPEG';
  try {
    p2ImgData = p2Canvas.toDataURL('image/jpeg', 0.98);
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
  const p2Margin = 0; // Seamless fit for authentic official marksheet

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
