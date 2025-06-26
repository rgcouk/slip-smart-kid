
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

    // Wait for any animations or layouts to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas with simpler settings
    const canvas = await html2canvas(payslipElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true
    });

    // Simple A4 calculations
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    // Calculate image dimensions to fit A4 with margins
    const margin = 10;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    
    const imgAspectRatio = canvas.width / canvas.height;
    let imgWidth = maxWidth;
    let imgHeight = maxWidth / imgAspectRatio;
    
    // If too tall, scale down
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = maxHeight * imgAspectRatio;
    }

    // Create PDF
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    
    // Add image with simple positioning
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

    // Generate filename
    const fileName = `payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
    
    // Download the PDF
    pdf.save(fileName);
    
    console.log('PDF generated successfully');
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

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(payslipElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    
    const imgAspectRatio = canvas.width / canvas.height;
    let imgWidth = maxWidth;
    let imgHeight = maxWidth / imgAspectRatio;
    
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = maxHeight * imgAspectRatio;
    }

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF blob generation failed:', error);
    throw error;
  }
};
