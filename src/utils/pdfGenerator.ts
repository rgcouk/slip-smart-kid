
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PayslipData {
  name: string;
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyRegistration?: string;
  companyLogo?: string;
  grossPay: number;
  deductions: Array<{ id: string; name: string; amount: number }>;
  period: string;
  payrollNumber?: string;
  ytdOverride?: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

const validateCoordinate = (value: number, fallback: number = 0): number => {
  if (isNaN(value) || !isFinite(value) || value < 0) {
    console.warn(`Invalid coordinate detected: ${value}, using fallback: ${fallback}`);
    return fallback;
  }
  return value;
};

export const generatePayslipPDF = async (payslipData: PayslipData, currency: string = '£'): Promise<void> => {
  try {
    // Find the payslip preview element
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      throw new Error('Payslip preview element not found');
    }

    // Wait a moment for any animations or layouts to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create canvas from the payslip element with premium quality settings
    const canvas = await html2canvas(payslipElement, {
      scale: 2, // Reduced scale for better stability
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: true
    });

    // Fixed dimensions for A4
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15; // Safe margin
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Calculate dimensions maintaining aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
    let imgWidth = maxWidth;
    let imgHeight = maxWidth / canvasAspectRatio;

    // If height exceeds page, scale down
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = maxHeight * canvasAspectRatio;
    }

    // Create PDF with high-quality settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });
    
    // Convert canvas to high-quality image
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate safe positioning - center the image
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = margin;
    
    // Validate all coordinates
    const safeX = validateCoordinate(xOffset, margin);
    const safeY = validateCoordinate(yOffset, margin);
    const safeWidth = validateCoordinate(imgWidth, maxWidth);
    const safeHeight = validateCoordinate(imgHeight, maxHeight);
    
    console.log('PDF coordinates:', { 
      safeX, 
      safeY, 
      safeWidth, 
      safeHeight,
      pageWidth,
      pageHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });
    
    // Final validation before adding image
    if (safeX >= 0 && safeY >= 0 && safeWidth > 0 && safeHeight > 0 && 
        safeX + safeWidth <= pageWidth && safeY + safeHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', safeX, safeY, safeWidth, safeHeight, '', 'FAST');
    } else {
      throw new Error(`Invalid final coordinates: x=${safeX}, y=${safeY}, w=${safeWidth}, h=${safeHeight}`);
    }

    // Generate professional filename
    const fileName = `payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
    
    // Download the PDF
    pdf.save(fileName);
    
    console.log('Professional PDF generated successfully');
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

export const generatePayslipBlob = async (payslipData: PayslipData, currency: string = '£'): Promise<Blob> => {
  try {
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      throw new Error('Payslip preview element not found');
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(payslipElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: true
    });

    // Fixed dimensions for A4
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Calculate dimensions maintaining aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
    let imgWidth = maxWidth;
    let imgHeight = maxWidth / canvasAspectRatio;

    // If height exceeds page, scale down
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = maxHeight * canvasAspectRatio;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate safe positioning - center the image
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = margin;
    
    // Validate all coordinates
    const safeX = validateCoordinate(xOffset, margin);
    const safeY = validateCoordinate(yOffset, margin);
    const safeWidth = validateCoordinate(imgWidth, maxWidth);
    const safeHeight = validateCoordinate(imgHeight, maxHeight);
    
    // Final validation before adding image
    if (safeX >= 0 && safeY >= 0 && safeWidth > 0 && safeHeight > 0 && 
        safeX + safeWidth <= pageWidth && safeY + safeHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', safeX, safeY, safeWidth, safeHeight, '', 'FAST');
    } else {
      throw new Error(`Invalid final coordinates: x=${safeX}, y=${safeY}, w=${safeWidth}, h=${safeHeight}`);
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF blob generation failed:', error);
    throw error;
  }
};
