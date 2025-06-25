
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

    // Create canvas from the payslip element
    const canvas = await html2canvas(payslipElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add the canvas as image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

    // If content is longer than one page, add more pages
    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
      }
    }

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
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: payslipElement.scrollWidth,
      height: payslipElement.scrollHeight
    });

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
      }
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};
