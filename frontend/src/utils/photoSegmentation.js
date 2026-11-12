let segmenterInstance = null;
let segmenterInitPromise = null;

function loadMediaPipeScript() {
  if (typeof window !== 'undefined' && window.SelfieSegmentation) {
    return Promise.resolve(window.SelfieSegmentation);
  }

  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      return reject(new Error('Document not available'));
    }

    const script = document.createElement('script');
    script.src = '/mediapipe/selfie_segmentation.js';
    script.async = true;
    script.onload = () => {
      if (window.SelfieSegmentation) {
        resolve(window.SelfieSegmentation);
      } else {
        reject(new Error('SelfieSegmentation not found on window'));
      }
    };
    script.onerror = () => {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
      cdnScript.async = true;
      cdnScript.onload = () => {
        if (window.SelfieSegmentation) {
          resolve(window.SelfieSegmentation);
        } else {
          reject(new Error('SelfieSegmentation not found from CDN'));
        }
      };
      cdnScript.onerror = (err) => reject(err);
      document.head.appendChild(cdnScript);
    };

    document.head.appendChild(script);
  });
}

async function getSegmenter() {
  if (segmenterInstance) return segmenterInstance;
  if (segmenterInitPromise) return segmenterInitPromise;

  segmenterInitPromise = (async () => {
    try {
      const SelfieSegmentationClass = await loadMediaPipeScript();
      const segmenter = new SelfieSegmentationClass({
        locateFile: (file) => {
          if (typeof window !== 'undefined' && window.location.origin) {
            return `${window.location.origin}/mediapipe/${file}`;
          }
          return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
        }
      });

      segmenter.setOptions({
        modelSelection: 1, // 1: landscape/full-body
        selfieMode: false
      });

      segmenterInstance = segmenter;
      return segmenter;
    } catch (err) {
      console.warn('Failed to initialize SelfieSegmentation:', err);
      segmenterInitPromise = null;
      throw err;
    }
  })();

  return segmenterInitPromise;
}

/**
 * Connected-Component Analysis to isolate ONLY the main central subject
 * and wipe out all side objects, clutter, extra items, or floating artifacts.
 */
function isolatePrimarySubjectMask(maskData, w, h) {
  const labels = new Int32Array(w * h);
  let currentLabel = 1;
  const compSizes = [0];
  const compSumX = [0];
  const compSumY = [0];

  const queue = new Int32Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (maskData[idx] > 35 && labels[idx] === 0) {
        let qHead = 0;
        let qTail = 0;
        labels[idx] = currentLabel;
        queue[qTail++] = idx;

        let size = 0;
        let sx = 0;
        let sy = 0;

        while (qHead < qTail) {
          const curr = queue[qHead++];
          const cx = curr % w;
          const cy = Math.floor(curr / w);
          size++;
          sx += cx;
          sy += cy;

          if (cx > 0) {
            const n = curr - 1;
            if (maskData[n] > 35 && labels[n] === 0) {
              labels[n] = currentLabel;
              queue[qTail++] = n;
            }
          }
          if (cx < w - 1) {
            const n = curr + 1;
            if (maskData[n] > 35 && labels[n] === 0) {
              labels[n] = currentLabel;
              queue[qTail++] = n;
            }
          }
          if (cy > 0) {
            const n = curr - w;
            if (maskData[n] > 35 && labels[n] === 0) {
              labels[n] = currentLabel;
              queue[qTail++] = n;
            }
          }
          if (cy < h - 1) {
            const n = curr + w;
            if (maskData[n] > 35 && labels[n] === 0) {
              labels[n] = currentLabel;
              queue[qTail++] = n;
            }
          }
        }

        compSizes.push(size);
        compSumX.push(sx);
        compSumY.push(sy);
        currentLabel++;
      }
    }
  }

  if (currentLabel <= 1) return maskData;

  // Find the primary central subject
  let bestLabel = 1;
  let bestScore = -1;
  const centerX = w / 2;

  for (let l = 1; l < currentLabel; l++) {
    const size = compSizes[l];
    if (size < 40) continue;
    const meanX = compSumX[l] / size;
    const distX = Math.abs(meanX - centerX) / (w / 2);
    // Strong weighting for being in the horizontal center
    const score = size / (1.0 + 4.5 * (distX * distX));
    if (score > bestScore) {
      bestScore = score;
      bestLabel = l;
    }
  }

  // Create clean mask keeping ONLY the best component (erasing all side/background clutter)
  const cleanMask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (labels[i] === bestLabel) {
      cleanMask[i] = maskData[i];
    } else {
      cleanMask[i] = 0; // Wipe out completely
    }
  }

  return cleanMask;
}

/**
 * Fits and renders isolated subject onto a standard 3.5 : 4.5 passport canvas (420 x 540 px)
 * with the solid background color perfectly aligned from edge to edge and the subject
 * symmetrically centered horizontally and vertically.
 */
function renderToPassportCanvas(sourceImage, mask, srcW, srcH, targetColor) {
  // Output canvas: standard 3.5 : 4.5 passport resolution (420 x 540 px)
  const outW = 420;
  const outH = 540;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext('2d');

  if (targetColor === 'original') {
    outCtx.fillStyle = '#0f172a';
    outCtx.fillRect(0, 0, outW, outH);

    // Center-fit the original image into the passport frame
    const scale = Math.max(outW / srcW, outH / srcH);
    const renderW = Math.round(srcW * scale);
    const renderH = Math.round(srcH * scale);
    const posX = Math.round((outW - renderW) / 2);
    const posY = Math.round((outH - renderH) / 2);
    outCtx.drawImage(sourceImage, posX, posY, renderW, renderH);

    return outCanvas.toDataURL('image/jpeg', 0.95);
  }

  // 1. Fill entire 3.5 : 4.5 canvas edge-to-edge with solid chosen color (zero gaps)
  outCtx.fillStyle = targetColor;
  outCtx.fillRect(0, 0, outW, outH);

  // 2. Extract isolated subject onto transparent canvas
  const subCanvas = document.createElement('canvas');
  subCanvas.width = srcW;
  subCanvas.height = srcH;
  const subCtx = subCanvas.getContext('2d');
  subCtx.drawImage(sourceImage, 0, 0, srcW, srcH);

  const imgData = subCtx.getImageData(0, 0, srcW, srcH);
  const data = imgData.data;

  let minX = srcW;
  let maxX = 0;
  let minY = srcH;
  let maxY = 0;
  let hasPixels = false;

  for (let y = 0; y < srcH; y++) {
    for (let x = 0; x < srcW; x++) {
      const idx = y * srcW + x;
      const alpha = mask[idx];
      data[idx * 4 + 3] = alpha;

      if (alpha > 40) {
        hasPixels = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  subCtx.putImageData(imgData, 0, 0);

  if (!hasPixels) {
    const scale = Math.max(outW / srcW, outH / srcH);
    const renderW = Math.round(srcW * scale);
    const renderH = Math.round(srcH * scale);
    const posX = Math.round((outW - renderW) / 2);
    const posY = Math.round((outH - renderH) / 2);
    outCtx.drawImage(sourceImage, posX, posY, renderW, renderH);
    return outCanvas.toDataURL('image/jpeg', 0.95);
  }

  const subW = Math.max(1, maxX - minX + 1);
  const subH = Math.max(1, maxY - minY + 1);

  // Standard passport proportion: subject occupies ~82% of passport height
  const scale = Math.min((outW * 0.82) / subW, (outH * 0.82) / subH);
  const renderW = Math.round(subW * scale);
  const renderH = Math.round(subH * scale);

  // Symmetrical alignment: Center subject horizontally and vertically
  const posX = Math.round((outW - renderW) / 2);
  const posY = Math.round((outH - renderH) / 2);

  outCtx.drawImage(subCanvas, minX, minY, subW, subH, posX, posY, renderW, renderH);

  return outCanvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Robust canvas fallback for background replacement:
 * Flood-fills background from borders, identifies central subject, and removes clutter.
 */
export function algorithmicBackgroundReplace(img, chosenColor) {
  const w = img.naturalWidth || img.videoWidth || img.width || 400;
  const h = img.naturalHeight || img.videoHeight || img.height || 500;

  if (chosenColor === 'original') {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', 0.95);
  }

  const procCanvas = document.createElement('canvas');
  procCanvas.width = w;
  procCanvas.height = h;
  const procCtx = procCanvas.getContext('2d');
  procCtx.drawImage(img, 0, 0, w, h);

  const imgData = procCtx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Gather border samples from all four corners
  const bgSamples = [];
  const sampleW = Math.max(6, Math.floor(w * 0.15));
  const sampleH = Math.max(6, Math.floor(h * 0.15));

  for (let y = 0; y < sampleH; y += 2) {
    for (let x = 0; x < sampleW; x += 2) {
      const idx = (y * w + x) * 4;
      bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
    }
    for (let x = w - sampleW; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
    }
  }

  for (let y = Math.max(0, h - sampleH); y < h; y += 2) {
    for (let x = 0; x < sampleW; x += 2) {
      const idx = (y * w + x) * 4;
      bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
    }
    for (let x = w - sampleW; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
    }
  }

  let avgR = 0;
  let avgG = 0;
  let avgB = 0;
  const count = bgSamples.length || 1;
  bgSamples.forEach(c => {
    avgR += c[0];
    avgG += c[1];
    avgB += c[2];
  });
  avgR /= count;
  avgG /= count;
  avgB /= count;

  // Breadth-First-Search flood fill from all 4 borders to mark background
  const isBg = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qHead = 0;
  let qTail = 0;

  // Seed with all border pixels
  for (let x = 0; x < w; x++) {
    const top = x;
    const bot = (h - 1) * w + x;
    isBg[top] = 1;
    queue[qTail++] = top;
    isBg[bot] = 1;
    queue[qTail++] = bot;
  }
  for (let y = 1; y < h - 1; y++) {
    const left = y * w;
    const right = y * w + (w - 1);
    isBg[left] = 1;
    queue[qTail++] = left;
    isBg[right] = 1;
    queue[qTail++] = right;
  }

  const floodThreshold = 55;
  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cIdx = curr * 4;
    const cr = data[cIdx];
    const cg = data[cIdx + 1];
    const cb = data[cIdx + 2];

    const neighbors = [curr - 1, curr + 1, curr - w, curr + w];
    for (let n = 0; n < 4; n++) {
      const nIdx = neighbors[n];
      const nx = nIdx % w;
      const ny = Math.floor(nIdx / w);
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !isBg[nIdx]) {
        const pIdx = nIdx * 4;
        const nr = data[pIdx];
        const ng = data[pIdx + 1];
        const nb = data[pIdx + 2];

        const distGlobal = Math.sqrt((nr - avgR) ** 2 + (ng - avgG) ** 2 + (nb - avgB) ** 2);
        const distLocal = Math.sqrt((nr - cr) ** 2 + (ng - cg) ** 2 + (nb - cb) ** 2);

        if (distGlobal < floodThreshold || distLocal < 18) {
          isBg[nIdx] = 1;
          queue[qTail++] = nIdx;
        }
      }
    }
  }

  // Create raw foreground mask (1 where not background)
  const rawMask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    rawMask[i] = isBg[i] ? 0 : 255;
  }

  // Isolate ONLY the primary central subject (erases all secondary clutter)
  const cleanMask = isolatePrimarySubjectMask(rawMask, w, h);

  // Render to edge-to-edge 4:5 passport canvas
  return renderToPassportCanvas(img, cleanMask, w, h, chosenColor);
}

/**
 * Replace background using AI + Connected Component Isolation + Passport Framing
 * @param {HTMLImageElement|string} imageSource 
 * @param {string} targetColor - e.g. '#ffffff', '#38bdf8', '#94a3b8'
 * @returns {Promise<string>} dataUrl of processed image with full background replaced & fitted
 */
export async function replacePhotoBackground(imageSource, targetColor) {
  if (!imageSource) return null;

  let imgElement = imageSource;
  if (typeof imageSource === 'string') {
    imgElement = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = imageSource;
    });
  }

  const w = imgElement.naturalWidth || imgElement.width || 400;
  const h = imgElement.naturalHeight || imgElement.height || 500;

  if (targetColor === 'original') {
    return renderToPassportCanvas(imgElement, null, w, h, 'original');
  }

  try {
    const segmenter = await getSegmenter();
    const w = imgElement.naturalWidth || imgElement.width || 400;
    const h = imgElement.naturalHeight || imgElement.height || 500;

    return new Promise((resolve) => {
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn('AI segmentation timeout, using algorithmic fallback.');
          resolve(algorithmicBackgroundReplace(imgElement, targetColor));
        }
      }, 3500);

      segmenter.onResults((results) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);

        try {
          // Read segmentation mask pixels
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = w;
          maskCanvas.height = h;
          const maskCtx = maskCanvas.getContext('2d');
          maskCtx.drawImage(results.segmentationMask, 0, 0, w, h);

          const maskData = maskCtx.getImageData(0, 0, w, h).data;
          const rawMask = new Uint8Array(w * h);

          for (let i = 0; i < w * h; i++) {
            // MediaPipe puts confidence in red/alpha channels
            const val = maskData[i * 4];
            rawMask[i] = val > 90 ? val : 0;
          }

          // Isolate ONLY the primary subject (wiping out any other background objects)
          const cleanMask = isolatePrimarySubjectMask(rawMask, w, h);

          // Check if primary subject was found; if not, fall back to algorithmic
          let activeCount = 0;
          for (let i = 0; i < w * h; i++) {
            if (cleanMask[i] > 40) activeCount++;
          }

          if (activeCount < 500) {
            // Not a human or AI found nothing -> use algorithmic fallback
            resolve(algorithmicBackgroundReplace(imgElement, targetColor));
            return;
          }

          // Render cleanly onto 4:5 passport canvas
          resolve(renderToPassportCanvas(imgElement, cleanMask, w, h, targetColor));
        } catch (err) {
          console.error('Error drawing segmentation results:', err);
          resolve(algorithmicBackgroundReplace(imgElement, targetColor));
        }
      });

      segmenter.send({ image: imgElement }).catch((err) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          console.warn('segmenter.send failed:', err);
          resolve(algorithmicBackgroundReplace(imgElement, targetColor));
        }
      });
    });
  } catch (err) {
    console.warn('MediaPipe error:', err);
    return algorithmicBackgroundReplace(imgElement, targetColor);
  }
}
