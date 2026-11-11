import React, { useRef } from "react";
import { Printer, X } from "lucide-react";

const BselReceipt = ({
  receipt = {},
  onClose,
  showActions = true,
}) => {
  const receiptRef = useRef(null);

  // Dynamic receipt information
  const data = {
    receiptNo: receipt.receiptNo || receipt.id || "N/A",
    date: receipt.date || "N/A",

    studentName:
      receipt.studentName ||
      receipt.payerName ||
      receipt.name ||
      "",

    parentName:
      receipt.parentGuardianName ||
      receipt.parentName ||
      receipt.guardianName ||
      "",

    school:
      receipt.school ||
      receipt.studyCenter ||
      receipt.branch ||
      "",

    standard:
      receipt.standard ||
      receipt.class ||
      "",

    program:
      receipt.program ||
      receipt.course ||
      "",

    amount: receipt.amount || "",
    paymentMode: receipt.paymentMode || "",
    refNo: receipt.refNo || "",
    verifiedBy: receipt.verifiedBy || "B★SEL Desk",
    contactNumber: receipt.contactNumber || "",
  };

  const escapeHTML = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Print only the receipt
  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=750"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print the receipt.");
      return;
    }

    const receiptHTML = receiptRef.current.outerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BSEL Official Fee Receipt</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 20px;
              background: white;
              font-family: Arial, Helvetica, sans-serif;
            }

            .bsel-receipt {
              width: 100%;
              max-width: 1000px;
              margin: 0 auto;
            }

            .receipt-paper {
              position: relative;
              width: 100%;
              background: #ffffff;
              color: #263238;
              padding: 18px 28px 12px;
              border: 2px solid #b99a56;
              outline: 1px solid #d5c18c;
              outline-offset: -7px;
              overflow: hidden;
            }

            .receipt-paper::before {
              content: "";
              position: absolute;
              inset: 9px;
              border: 1px solid #c3a66b;
              pointer-events: none;
            }

            .receipt-header {
              text-align: center;
              padding: 7px 10px 12px;
              border-bottom: 2px solid #b99a56;
              position: relative;
            }

            .receipt-title {
              font-family: Georgia, serif;
              font-size: 25px;
              font-weight: bold;
              color: #725a2c;
              margin: 0 0 8px;
              text-transform: uppercase;
            }

            .receipt-logo {
              font-family: Georgia, serif;
              font-size: 25px;
              font-weight: bold;
              color: #172b3b;
              margin-bottom: 3px;
            }

            .receipt-org {
              font-size: 14px;
              font-weight: bold;
              color: #303b42;
              margin: 3px 0;
            }

            .receipt-certification {
              font-size: 10px;
              color: #777;
              margin-top: 4px;
            }

            .receipt-meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              padding: 12px 20px;
              border-bottom: 1px solid #c3a66b;
              font-size: 12px;
            }

            .receipt-meta strong {
              color: #263238;
            }

            .receipt-section {
              margin: 12px 15px;
              border: 1px solid #b99a56;
            }

            .receipt-section-title {
              padding: 6px 9px;
              background: #f7f3e9;
              color: #6e552a;
              font-size: 12px;
              font-weight: bold;
              border-bottom: 1px solid #b99a56;
              text-transform: uppercase;
            }

            .receipt-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
            }

            .receipt-field {
              min-height: 31px;
              padding: 6px 9px;
              display: flex;
              align-items: center;
              gap: 5px;
              border-bottom: 1px solid #ded5c1;
              font-size: 11px;
              min-width: 0;
            }

            .receipt-field:nth-child(odd) {
              border-right: 1px solid #ded5c1;
            }

            .receipt-label {
              color: #555;
              white-space: nowrap;
            }

            .receipt-value {
              color: #172b3b;
              font-weight: bold;
              overflow-wrap: anywhere;
            }

            .receipt-paid {
              position: absolute;
              right: 35px;
              bottom: 55px;
              width: 85px;
              height: 85px;
              border: 3px double #a98b4c;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #a98b4c;
              font-family: Georgia, serif;
              font-size: 15px;
              font-weight: bold;
              transform: rotate(-15deg);
              opacity: 0.85;
            }

            .receipt-paid-inner {
              width: 72px;
              height: 72px;
              border: 1px solid #a98b4c;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .receipt-footer {
              text-align: center;
              padding: 10px 5px 5px;
              border-top: 1px solid #b99a56;
              font-size: 10px;
              color: #666;
              line-height: 1.6;
            }

            .receipt-amount {
              margin: 10px 15px;
              padding: 8px 10px;
              border: 1px solid #c3a66b;
              display: flex;
              justify-content: space-between;
              gap: 10px;
              font-size: 11px;
            }

            @page {
              size: A4 landscape;
              margin: 12mm;
            }

            @media print {
              body {
                padding: 0;
                margin: 0;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              .bsel-receipt {
                max-width: none;
                width: 100%;
              }

              .receipt-paper {
                width: 100%;
                break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          ${receiptHTML}

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.focus();
                window.print();
              }, 500);
            };

            window.onafterprint = function () {
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="w-full bg-white">

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between gap-3 mb-4">

          <div>
            <h2 className="text-sm font-black text-slate-800">
              B★SEL Official Fee Receipt
            </h2>

            <p className="text-xs text-slate-500">
              Receipt No: {data.receiptNo}
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#081d3d] hover:bg-[#172b4d] text-white px-4 py-2 rounded-lg text-xs font-bold transition"
            >
              <Printer size={15} />
              Print
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            )}

          </div>
        </div>
      )}

      {/* Receipt Design */}
      <div
        ref={receiptRef}
        className="bsel-receipt"
      >

        <div className="receipt-paper">

          {/* Header */}
          <div className="receipt-header">

            <h1 className="receipt-title">
              Bill of Supply / Fee Receipt
            </h1>

            <div className="receipt-logo">
              B★SEL
            </div>

            <div className="receipt-org">
              Board of Skills and Educational Learning
            </div>

            <div className="receipt-org">
              ISO 9001:2015 Certified Educational Organization
            </div>

            <div className="receipt-certification">
              (Certified by Paramount Quality Certifications)
            </div>

          </div>

          {/* Receipt Number and Date */}
          <div className="receipt-meta">

            <div>
              <strong>Receipt No:</strong>{" "}
              {data.receiptNo}
            </div>

            <div>
              <strong>Date:</strong>{" "}
              {data.date}
            </div>

          </div>

          {/* Student Details */}
          <div className="receipt-section">

            <div className="receipt-section-title">
              Student Details
            </div>

            <div className="receipt-grid">

              <div className="receipt-field">
                <span className="receipt-label">
                  Student Name:
                </span>

                <span className="receipt-value">
                  {data.studentName}
                </span>
              </div>

              <div className="receipt-field">
                <span className="receipt-label">
                  Parent/Guardian Name:
                </span>

                <span className="receipt-value">
                  {data.parentName}
                </span>
              </div>

              <div className="receipt-field">
                <span className="receipt-label">
                  School/Study Center:
                </span>

                <span className="receipt-value">
                  {data.school}
                </span>
              </div>

              <div className="receipt-field">
                <span className="receipt-label">
                  Standard:
                </span>

                <span className="receipt-value">
                  {data.standard}
                </span>
              </div>

              <div className="receipt-field">
                <span className="receipt-label">
                  Programme:
                </span>

                <span className="receipt-value">
                  {data.program}
                </span>
              </div>

              <div className="receipt-field">
                <span className="receipt-label">
                  Payment Mode:
                </span>

                <span className="receipt-value">
                  {data.paymentMode}
                </span>
              </div>

            </div>

          </div>

          {/* Amount */}
          <div className="receipt-amount">

            <div>
              <strong>Amount Paid:</strong>{" "}
              {data.amount}
            </div>

            <div>
              <strong>Reference:</strong>{" "}
              {data.refNo}
            </div>

          </div>

          {/* Paid Stamp */}
          <div className="receipt-paid">
            <div className="receipt-paid-inner">
              PAID
            </div>
          </div>

          {/* Footer */}
          <div className="receipt-footer">

            <strong>
              B★SEL Educational Network
            </strong>

            <br />

            A Decade Ahead | Contact Number:{" "}
            {data.contactNumber || "N/A"}

            <br />

            Authenticated by: {data.verifiedBy}

          </div>

        </div>

      </div>

    </div>
  );
};

export default BselReceipt;