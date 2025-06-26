
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
    console.log('🟢 Starting PDF generation for:', payslipData.name);
    
    // Find the payslip preview element
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      console.error('❌ Payslip preview element not found');
      throw new Error('Payslip preview element not found');
    }
    
    console.log('✅ Found payslip element:', payslipElement);

    // Wait for any animations or layouts to settle
    console.log('⏳ Waiting for layout to settle...');
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('📸 Starting html2canvas...');
    // Create canvas with simpler settings
    const canvas = await html2canvas(payslipElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      removeContainer: true
    });

    console.log('✅ Canvas created successfully:', {
      width: canvas.width,
      height: canvas.height
    });

    // Simple A4 calculations
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    console.log('📏 Page dimensions:', { pageWidth, pageHeight });

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

    console.log('📐 Calculated image dimensions:', {
      imgWidth,
      imgHeight,
      aspectRatio: imgAspectRatio,
      margin
    });

    // Validate coordinates
    if (imgWidth <= 0 || imgHeight <= 0 || margin < 0) {
      console.error('❌ Invalid coordinates calculated:', {
        imgWidth,
        imgHeight,
        margin
      });
      throw new Error('Invalid image dimensions calculated');
    }

    console.log('📄 Creating PDF...');
    // Create PDF
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Convert canvas to image
    console.log('🖼️ Converting canvas to image data...');
    const imgData = canvas.toDataURL('image/png');
    console.log('✅ Image data created, length:', imgData.length);
    
    // Add image with simple positioning
    console.log('➕ Adding image to PDF with coordinates:', {
      x: margin,
      y: margin,
      width: imgWidth,
      height: imgHeight
    });
    
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    console.log('✅ Image added to PDF successfully');

    // Generate filename
    const fileName = `payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
    console.log('📁 Generated filename:', fileName);
    
    // Download the PDF
    console.log('💾 Attempting to save PDF...');
    pdf.save(fileName);
    
    console.log('🎉 PDF generation completed successfully!');
  } catch (error) {
    console.error('💥 PDF generation failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

export const generatePayslipBlob = async (payslipData: PayslipData, currency: string = '£'): Promise<Blob> => {
  try {
    console.log('🟢 Starting PDF blob generation for:', payslipData.name);
    
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      console.error('❌ Payslip preview element not found for blob generation');
      throw new Error('Payslip preview element not found');
    }

    console.log('✅ Found payslip element for blob');
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('📸 Starting html2canvas for blob...');
    const canvas = await html2canvas(payslipElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      removeContainer: true
    });

    console.log('✅ Canvas created for blob:', {
      width: canvas.width,
      height: canvas.height
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

    console.log('📐 Blob image dimensions:', {
      imgWidth,
      imgHeight,
      aspectRatio: imgAspectRatio
    });

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    console.log('➕ Adding image to PDF blob...');
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    
    console.log('🔄 Converting PDF to blob...');
    const blob = pdf.output('blob');
    console.log('✅ Blob generated successfully, size:', blob.size);

    return blob;
  } catch (error) {
    console.error('💥 PDF blob generation failed:', error);
    console.error('Blob error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};
