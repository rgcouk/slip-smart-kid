
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PayslipData } from '@/types/payslip';

interface GeneratePDFOptions {
  payslipData: PayslipData;
  currency: string;
  onProgress?: (progress: number) => void;
}

// Generate filename following existing convention
const generateFilename = (payslipData: PayslipData): string => {
  const safeName = payslipData.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  const safePeriod = payslipData.payPeriodStart ? 
    payslipData.payPeriodStart.replace(/[^a-zA-Z0-9-]/g, '-') :
    payslipData.period?.replace(/[^a-zA-Z0-9-]/g, '-') || 'unknown';
  return `payslip-${safeName}-${safePeriod}.pdf`;
};

// Client-side PDF generation using html2canvas + jsPDF
export const generateClientPDF = async ({ payslipData, currency, onProgress }: GeneratePDFOptions): Promise<void> => {
  try {
    console.log('🟢 Starting client-side PDF generation for:', payslipData.name);
    
    if (onProgress) onProgress(10);
    
    // Find the professional payslip template element
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      throw new Error('Payslip preview element not found. Please ensure the preview is visible.');
    }

    if (onProgress) onProgress(20);
    
    // Temporarily make the element visible and positioned for capture
    const originalStyle = {
      position: payslipElement.style.position,
      left: payslipElement.style.left,
      opacity: payslipElement.style.opacity,
      pointerEvents: payslipElement.style.pointerEvents
    };
    
    payslipElement.style.position = 'absolute';
    payslipElement.style.left = '0px';
    payslipElement.style.opacity = '1';
    payslipElement.style.pointerEvents = 'auto';

    if (onProgress) onProgress(30);

    // Generate high-quality canvas
    console.log('📸 Capturing payslip as canvas...');
    const canvas = await html2canvas(payslipElement, {
      scale: 2, // High DPI for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      logging: false
    });

    if (onProgress) onProgress(60);

    // Restore original styling
    payslipElement.style.position = originalStyle.position;
    payslipElement.style.left = originalStyle.left;
    payslipElement.style.opacity = originalStyle.opacity;
    payslipElement.style.pointerEvents = originalStyle.pointerEvents;

    console.log('✅ Canvas captured successfully, size:', canvas.width, 'x', canvas.height);

    if (onProgress) onProgress(70);

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit A4 page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add canvas to PDF maintaining aspect ratio
    const canvasAspectRatio = canvas.height / canvas.width;
    const pdfAspectRatio = pdfHeight / pdfWidth;
    
    let imgWidth = pdfWidth;
    let imgHeight = pdfWidth * canvasAspectRatio;
    
    // If image is taller than page, scale to fit height
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = pdfHeight / canvasAspectRatio;
    }

    // Center the image on the page
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    if (onProgress) onProgress(80);

    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      x,
      y,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    if (onProgress) onProgress(90);

    // Generate filename and download
    const filename = generateFilename(payslipData);
    console.log('💾 Saving PDF as:', filename);
    
    pdf.save(filename);

    if (onProgress) onProgress(100);
    
    console.log('🎉 Client-side PDF generation completed successfully!');
    
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
  } catch (error) {
    console.error('💥 Client-side PDF generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Generate PDF blob for preview
export const generateClientPDFBlob = async ({ payslipData, currency, onProgress }: GeneratePDFOptions): Promise<Blob> => {
  try {
    console.log('🟢 Starting client-side PDF blob generation for:', payslipData.name);
    
    if (onProgress) onProgress(10);
    
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      throw new Error('Payslip preview element not found. Please ensure the preview is visible.');
    }

    if (onProgress) onProgress(20);
    
    // Temporarily make the element visible for capture
    const originalStyle = {
      position: payslipElement.style.position,
      left: payslipElement.style.left,
      opacity: payslipElement.style.opacity,
      pointerEvents: payslipElement.style.pointerEvents
    };
    
    payslipElement.style.position = 'absolute';
    payslipElement.style.left = '0px';
    payslipElement.style.opacity = '1';
    payslipElement.style.pointerEvents = 'auto';

    if (onProgress) onProgress(30);

    const canvas = await html2canvas(payslipElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      logging: false
    });

    if (onProgress) onProgress(60);

    // Restore original styling
    payslipElement.style.position = originalStyle.position;
    payslipElement.style.left = originalStyle.left;
    payslipElement.style.opacity = originalStyle.opacity;
    payslipElement.style.pointerEvents = originalStyle.pointerEvents;

    if (onProgress) onProgress(70);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasAspectRatio = canvas.height / canvas.width;
    let imgWidth = pdfWidth;
    let imgHeight = pdfWidth * canvasAspectRatio;
    
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = pdfHeight / canvasAspectRatio;
    }

    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    if (onProgress) onProgress(80);

    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      x,
      y,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    if (onProgress) onProgress(90);

    const pdfBlob = pdf.output('blob');

    if (onProgress) onProgress(100);
    
    console.log('✅ Client-side PDF blob generated successfully, size:', pdfBlob.size, 'bytes');
    return pdfBlob;
    
  } catch (error) {
    console.error('💥 Client-side PDF blob generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Fallback to browser print if PDF generation fails
export const fallbackToPrint = (): void => {
  console.log('🖨️ Falling back to browser print dialog');
  
  const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
  
  if (!payslipElement) {
    window.print();
    return;
  }

  // Create a new window with just the payslip content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Payslip - ${document.title}</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          @media print { body { margin: 0; padding: 0; } }
        </style>
      </head>
      <body>
        ${payslipElement.outerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
