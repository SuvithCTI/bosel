import React, { useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Download, Loader2, Printer } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import StudentAdmissionFormView from './StudentAdmissionFormView';
import BselReceipt, { printReceiptSheets } from './admin/BselReceipt';
import { triggerDirectPdfDownload } from '../utils/pdfExport';

const waitForImages = async (element) => {
  const images = Array.from(element.querySelectorAll('img'));
  const imagePromises = images.map((image) => {
    if (image.complete) {
      if (!image.naturalWidth) {
        throw new Error('A document image could not be loaded.');
      }
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', () => reject(new Error('A document image could not be loaded.')), { once: true });
    });
  });

  const svgImageSources = Array.from(element.querySelectorAll('image'))
    .map((image) => image.href?.baseVal || image.getAttribute('href'))
    .filter(Boolean);
  const svgImagePromises = svgImageSources.map((source) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = () => reject(new Error('A receipt image could not be loaded.'));
    image.src = source;
    if (image.complete) {
      if (image.naturalWidth) resolve();
      else reject(new Error('A receipt image could not be loaded.'));
    }
  }));

  await Promise.all([...imagePromises, ...svgImagePromises]);
};

const getStudentReceipt = (student) => ({
  receiptNo: student.receiptRefNo || student.receiptNo || student.userId || '',
  date: student.enrolmentDate || student.date || '',
  studentName: student.studentName || student.name || '',
  parentName: student.parentName || student.fatherName || student.guardianName || '',
  school: student.branch || student.institution || student.school || '',
  standard: student.studentClass || student.grade || student.classGrade || '',
  program: student.program || student.courseName || student.course || '',
  amount: student.feeAmount || '₹450',
  paymentMode: student.paymentMode || '',
  refNo: student.paymentRefNo || student.receiptRefNo || '',
  verifiedBy: student.verifiedBy || 'Super Admin',
  contactNumber: student.phone || student.contactNumber || '',
});

export default function StudentDocumentMergeModal({ type, students = [], onClose, showToast }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const documentRef = useRef(null);

  const isReceipt = type === 'receipt';
  const orientation = 'portrait';
  const documentLabel = isReceipt ? 'Receipt' : 'Admission Form';
  const contentSelector = isReceipt ? '[data-official-fee-receipt]' : '[data-merged-admission-form]';

  const captureStudentDocument = async (index) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const pageElement = documentRef.current?.querySelectorAll(contentSelector)[index];
    if (!pageElement) {
      throw new Error(`Could not render the ${documentLabel.toLowerCase()} for ${students[index].studentName || 'a student'}.`);
    }

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    await waitForImages(pageElement);

    return html2canvas(pageElement, {
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024,
      backgroundColor: '#ffffff',
      onclone: (_clonedDoc, clonedEl) => {
        const adm = clonedEl.querySelector?.('#printable-admission-form, [data-merged-admission-form]') || clonedEl;
        if (adm && !isReceipt) {
          adm.style.width = '794px';
          adm.style.maxWidth = '794px';
          adm.style.margin = '0 auto';
        }
      }
    });
  };

  const handleDownload = async () => {
    if (isGenerating || students.length === 0) return;

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let index = 0; index < students.length; index += 1) {
        setProgressText(`${index + 1}/${students.length}`);
        const canvas = await captureStudentDocument(index);

        let imageData;
        let imageFormat = 'JPEG';
        try {
          imageData = canvas.toDataURL('image/jpeg', 0.95);
        } catch {
          imageData = canvas.toDataURL('image/png');
          imageFormat = 'PNG';
        }

        if (index > 0 && (!isReceipt || index % 3 === 0)) {
          pdf.addPage('a4', orientation);
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const aspectRatio = canvas.width / canvas.height;
        let imageWidth;
        let imageHeight;
        let imageX;
        let imageY;

        if (isReceipt) {
          const margin = 10;
          imageWidth = pageWidth - margin * 2;
          imageHeight = imageWidth / aspectRatio;
          imageX = margin;
          imageY = margin + (index % 3) * (imageHeight + 3.6);
        } else {
          const margin = 8;
          const availableWidth = pageWidth - margin * 2;
          const availableHeight = pageHeight - margin * 2;
          imageWidth = availableWidth;
          imageHeight = imageWidth / aspectRatio;

          if (imageHeight > availableHeight) {
            imageHeight = availableHeight;
            imageWidth = imageHeight * aspectRatio;
          }

          imageX = (pageWidth - imageWidth) / 2;
          imageY = (pageHeight - imageHeight) / 2;
        }

        pdf.addImage(
          imageData,
          imageFormat,
          imageX,
          imageY,
          imageWidth,
          imageHeight,
          undefined,
          'FAST'
        );
      }

      triggerDirectPdfDownload(
        pdf,
        `BSEL_Merged_${isReceipt ? 'Receipts' : 'Admission_Forms'}_${students.length}_Students.pdf`
      );
      showToast?.(`Downloaded merged ${documentLabel.toLowerCase()} PDF for ${students.length} students.`);
    } catch (error) {
      console.error(`Merged ${documentLabel} PDF generation failed:`, error);
      setErrorMessage(error.message || `Could not generate the merged ${documentLabel.toLowerCase()} PDF.`);
      showToast?.(`PDF generation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  const handlePrintReceipts = () => {
    if (isGenerating || !isReceipt || students.length === 0) return;
    printReceiptSheets(students.map(getStudentReceipt));
  };

  const handlePrintAdmissions = async () => {
    if (isGenerating || isReceipt || students.length === 0) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      const message = 'Allow pop-ups to print the admission forms.';
      setErrorMessage(message);
      showToast?.(message);
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const pageImages = [];
      for (let index = 0; index < students.length; index += 1) {
        setProgressText(`${index + 1}/${students.length}`);
        const canvas = await captureStudentDocument(index);
        pageImages.push(canvas.toDataURL('image/jpeg', 0.95));
      }

      const pages = pageImages.map((source, index) => (
        `<div class="page"><img src="${source}" alt="Admission form ${index + 1}"></div>`
      ));
      printWindow.document.open();
      printWindow.document.write(`<!doctype html>
        <html>
          <head>
            <title>BSEL Admission Forms (${students.length})</title>
            <style>
              @page { size: A4 portrait; margin: 8mm; }
              * { box-sizing: border-box; }
              html, body { margin: 0; padding: 0; background: #fff; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .page {
                width: 194mm;
                height: 281mm;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                page-break-after: always;
                break-after: page;
              }
              .page:last-child { page-break-after: auto; break-after: auto; }
              .page img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; }
              @media screen {
                body { padding: 8mm; background: #e2e8f0; }
                .page { background: #fff; margin-bottom: 8mm; }
              }
            </style>
          </head>
          <body>${pages.join('')}</body>
        </html>`);
      printWindow.document.close();

      await Promise.all(Array.from(printWindow.document.images).map((image) => {
        if (image.complete) {
          if (!image.naturalWidth) {
            throw new Error('An admission form page could not be loaded for printing.');
          }
          return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', () => reject(new Error('An admission form page could not be loaded for printing.')), { once: true });
        });
      }));

      printWindow.onafterprint = () => printWindow.close();
      printWindow.focus();
      printWindow.print();
      showToast?.(`Print dialog opened for ${students.length} admission forms.`);
    } catch (error) {
      console.error('Merged admission form printing failed:', error);
      setErrorMessage(error.message || 'Could not prepare admission forms for printing.');
      showToast?.(`Printing failed: ${error.message || 'Unknown error'}`);
      if (!printWindow.closed) printWindow.close();
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  if (!students.length) return null;

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex flex-col items-center px-3 py-4">
      <div className="w-full max-w-[1050px] bg-[#081d3d] text-white rounded-xl border border-amber-400/40 shadow-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-sm font-bold">
            Merge {isReceipt ? 'Receipts' : 'Admission Forms'}
            <span className="ml-2 text-amber-300">({students.length} students)</span>
            <div className="mt-1 text-[11px] font-medium text-slate-300">
              All selected {isReceipt ? 'receipts' : 'admission forms'} are stacked below
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isReceipt ? handlePrintReceipts : handlePrintAdmissions}
            disabled={isGenerating}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black flex items-center gap-2 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            {isReceipt ? 'Print Receipts' : 'Print Admission Forms'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isGenerating ? `Generating ${progressText}...` : 'Download Merged PDF'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="w-full max-w-[1050px] mb-3 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-100 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div ref={documentRef} className="w-full max-w-[1050px] bg-white rounded-lg shadow-xl overflow-x-auto">
        {isReceipt ? (
          <BselReceipt
            receipts={students.map(getStudentReceipt)}
            showActions={false}
            width={820}
          />
        ) : (
          <div className="space-y-5 p-3 sm:p-5">
            {students.map((student, index) => (
              <section
                key={student.userId || student.id || `${student.studentName || 'student'}-${index}`}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <h3 className="bg-slate-100 px-4 py-2 text-xs font-black text-slate-800">
                  Admission Form {index + 1} of {students.length} — {student.studentName || student.name || 'Student'}
                </h3>
                <div data-merged-admission-form>
                  <StudentAdmissionFormView student={student} onClose={onClose} batchMode />
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
