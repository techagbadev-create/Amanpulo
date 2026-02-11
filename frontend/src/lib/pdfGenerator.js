import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * ==========================================================
 * PDF GENERATION UTILITY
 * ==========================================================
 *
 * Utility functions for generating PDF receipts from HTML elements.
 * Uses jsPDF and html2canvas to convert DOM elements to PDF.
 *
 * USAGE:
 * ------
 * import { generateReceiptPDF, downloadReceiptPDF } from "@/lib/pdfGenerator";
 *
 * // Download PDF
 * await downloadReceiptPDF(receiptRef.current, "AMAN-2026-00001");
 *
 * // Get PDF as blob (for email attachment)
 * const pdfBlob = await generateReceiptPDF(receiptRef.current);
 *
 * CONFIGURATION:
 * --------------
 * - PDF_QUALITY: Image quality (0-1), higher = better but larger file
 * - PDF_SCALE: Scale factor for html2canvas, higher = sharper but slower
 *
 * ==========================================================
 */

// Configuration
const PDF_QUALITY = 0.95;
const PDF_SCALE = 2;

/**
 * Generate a PDF from an HTML element
 *
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {Object} options - Additional options
 * @returns {Promise<Blob>} - PDF as Blob
 */
export async function generateReceiptPDF(element, options = {}) {
  if (!element) {
    throw new Error("No element provided for PDF generation");
  }

  const { quality = PDF_QUALITY, scale = PDF_SCALE } = options;

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      // Ensure fonts are loaded
      onclone: (clonedDoc) => {
        const clonedElement =
          clonedDoc.body.querySelector("[data-receipt]") ||
          clonedDoc.body.firstChild;
        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.margin = "0";
        }
      },
    });

    // Calculate PDF dimensions (A4 size in mm)
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add image to PDF
    const imgData = canvas.toDataURL("image/jpeg", quality);
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    // Return as blob
    return pdf.output("blob");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF receipt");
  }
}

/**
 * Download a PDF receipt
 *
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {string} bookingReference - Booking reference for filename
 * @param {Object} options - Additional options
 */
export async function downloadReceiptPDF(
  element,
  bookingReference,
  options = {},
) {
  if (!element) {
    throw new Error("No element provided for PDF generation");
  }

  const { quality = PDF_QUALITY, scale = PDF_SCALE } = options;

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Calculate PDF dimensions (A4 size in mm)
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? "portrait" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add image to PDF
    const imgData = canvas.toDataURL("image/jpeg", quality);

    // Handle multi-page if content is too long
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename
    const filename = `Booking_Confirmation_${bookingReference || "Receipt"}.pdf`;

    // Download
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Failed to download PDF receipt");
  }
}

/**
 * Convert PDF blob to base64 string (for email attachment)
 *
 * @param {Blob} blob - PDF blob
 * @returns {Promise<string>} - Base64 encoded string
 */
export async function pdfBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove data:application/pdf;base64, prefix
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default {
  generateReceiptPDF,
  downloadReceiptPDF,
  pdfBlobToBase64,
};
