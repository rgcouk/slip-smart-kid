
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

    // Create canvas from the payslip element with higher quality settings
    const canvas = await html2canvas(payslipElement, {
      scale: 3, // Increased scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight,
      logging: false, // Disable logging for cleaner output
      imageTimeout: 10000 // Increased timeout
    });

    // Calculate PDF dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF with A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add the canvas as image to PDF - centered and properly sized
    const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
    
    // Center the content if it's smaller than the page
    const yOffset = imgHeight < pageHeight ? (pageHeight - imgHeight) / 4 : 0;
    
    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, Math.min(imgHeight, pageHeight - yOffset));

    // Generate filename
    const fileName = `payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
    
    // Download the PDF
    pdf.save(fileName);
    
    console.log('PDF generated and downloaded successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generatePayslipBlob = async (payslipData: PayslipData, currency: string = '£'): Promise<Blob> => {
  try {
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      throw new Error('Payslip preview element not found');
    }

    const canvas = await html2canvas(payslipElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight,
      logging: false,
      imageTimeout: 10000
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const yOffset = imgHeight < pageHeight ? (pageHeight - imgHeight) / 4 : 0;
    
    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, Math.min(imgHeight, pageHeight - yOffset));

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};
