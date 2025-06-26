
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
      scale: 3, // Reduced scale to avoid coordinate issues
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

    // Calculate PDF dimensions for A4 (210 x 297mm) with safer margins
    const imgWidth = 190; // Reduced width to ensure margins
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF with high-quality settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });
    
    // Convert canvas to high-quality image
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Safe positioning calculations
    const xOffset = 10; // 10mm left margin
    const yOffset = Math.max(10, (pageHeight - imgHeight) / 8); // Minimum 10mm top margin
    const finalHeight = Math.min(imgHeight, pageHeight - 20); // Leave 20mm total margin
    
    // Ensure coordinates are valid numbers
    const safeX = Math.max(0, xOffset);
    const safeY = Math.max(0, yOffset);
    const safeWidth = Math.min(imgWidth, 190); // Max width with margins
    const safeHeight = Math.min(finalHeight, pageHeight - safeY - 10); // Ensure bottom margin
    
    console.log('PDF coordinates:', { safeX, safeY, safeWidth, safeHeight });
    
    pdf.addImage(imgData, 'PNG', safeX, safeY, safeWidth, safeHeight, '', 'FAST');

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
      scale: 3,
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

    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const xOffset = 10;
    const yOffset = Math.max(10, (pageHeight - imgHeight) / 8);
    const finalHeight = Math.min(imgHeight, pageHeight - 20);
    
    const safeX = Math.max(0, xOffset);
    const safeY = Math.max(0, yOffset);
    const safeWidth = Math.min(imgWidth, 190);
    const safeHeight = Math.min(finalHeight, pageHeight - safeY - 10);
    
    pdf.addImage(imgData, 'PNG', safeX, safeY, safeWidth, safeHeight, '', 'FAST');

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF blob generation failed:', error);
    throw error;
  }
};
