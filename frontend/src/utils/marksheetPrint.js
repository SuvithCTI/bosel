// Prints or saves a marksheet through the browser's own print engine.
// This keeps the SVG masks, container-query font sizes and Tailwind styles intact,
// which html2canvas cannot render reliably.

const absUrl = (value) => {
  try {
    return new URL(value, window.location.href).href;
  } catch {
    return value;
  }
};

// Wait until every image used by the sheet has loaded (or 4 seconds have passed)
const preloadImages = (urls) =>
  Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          const done = () => resolve();
          img.onload = done;
          img.onerror = done;
          img.src = src;
          setTimeout(done, 4000);
        })
    )
  );

export const printMarksheetElement = (element, { title = 'BSEL Marksheet' } = {}) => {
  if (!element) return false;

  // Use the sheet itself if a wrapper element was passed in
  const sheet = element.querySelector('#printable-marksheet-sheet') || element;

  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) return false;

  // Copy only the app's stylesheets from <head>. Skip <style> tags inside the page body,
  // because those contain "@media print" rules that hide everything except the sheet.
  const stylesHtml = Array.from(
    document.head.querySelectorAll('style, link[rel="stylesheet"]')
  )
    .map((node) => node.outerHTML)
    .join('\n');

  // Clone the sheet and remove interactive-only elements
  const clone = sheet.cloneNode(true);
  clone.querySelectorAll('.no-print').forEach((n) => n.remove());
  clone.querySelectorAll('input').forEach((n) => n.remove());

  // Make every image URL absolute so it resolves inside the new window
  const imageUrls = [];
  clone.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src) {
      const url = absUrl(src);
      img.setAttribute('src', url);
      imageUrls.push(url);
    }
  });
  clone.querySelectorAll('image').forEach((im) => {
    ['href', 'xlink:href'].forEach((attr) => {
      const v = im.getAttribute(attr);
      if (v) {
        const url = absUrl(v);
        im.setAttribute(attr, url);
        imageUrls.push(url);
      }
    });
  });

  const safeTitle = String(title).replace(/[<>&"']/g, '');

  win.document.open();
  win.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  ${stylesHtml}
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
    }
    body { display: block !important; }
    #printable-marksheet-sheet {
      width: 210mm !important;
      height: 297mm !important;
      max-width: none !important;
      aspect-ratio: auto !important;
      border: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
      position: relative !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  </style>
</head>
<body>${clone.outerHTML}</body>
</html>`);
  win.document.close();

  const startPrint = async () => {
    await Promise.all([
      win.document.fonts ? win.document.fonts.ready : Promise.resolve(),
      preloadImages(imageUrls),
    ]);
    // Short pause so the layout settles before the dialog opens
    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };

  if (win.document.readyState === 'complete') {
    startPrint();
  } else {
    win.addEventListener('load', startPrint);
  }

  win.addEventListener('afterprint', () => {
    setTimeout(() => win.close(), 300);
  });

  return true;
};