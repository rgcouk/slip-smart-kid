
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
      scale: 4, // Ultra high scale for crisp text and borders
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: true, // Better text rendering
      letterRendering: true // Improved font rendering
    });

    // Calculate PDF dimensions for A4 (210 x 297mm)
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF with high-quality settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false // Don't compress for better quality
    });
    
    // Convert canvas to high-quality image
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Center the content and ensure it fits on one page
    const yOffset = Math.max(0, (pageHeight - imgHeight) / 6);
    const finalHeight = Math.min(imgHeight, pageHeight - (yOffset * 2));
    
    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, finalHeight, '', 'FAST');

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
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: true,
      letterRendering: true
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const yOffset = Math.max(0, (pageHeight - imgHeight) / 6);
    const finalHeight = Math.min(imgHeight, pageHeight - (yOffset * 2));
    
    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, finalHeight, '', 'FAST');

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF blob generation failed:', error);
    throw error;
  }
};
