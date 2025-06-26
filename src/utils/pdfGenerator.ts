
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { sanitizeTextInput } from './validation';

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

// Sanitize payslip data for PDF generation
const sanitizePayslipData = (data: PayslipData): PayslipData => {
  return {
    ...data,
    name: sanitizeTextInput(data.name, 100),
    companyName: sanitizeTextInput(data.companyName, 100),
    companyAddress: data.companyAddress ? sanitizeTextInput(data.companyAddress, 200) : undefined,
    companyPhone: data.companyPhone ? sanitizeTextInput(data.companyPhone, 20) : undefined,
    companyEmail: data.companyEmail ? sanitizeTextInput(data.companyEmail, 100) : undefined,
    companyRegistration: data.companyRegistration ? sanitizeTextInput(data.companyRegistration, 50) : undefined,
    payrollNumber: data.payrollNumber ? sanitizeTextInput(data.payrollNumber, 20) : undefined,
    period: sanitizeTextInput(data.period, 20),
    deductions: data.deductions.map(d => ({
      id: sanitizeTextInput(d.id, 50),
      name: sanitizeTextInput(d.name, 50),
      amount: Number(d.amount) || 0
    }))
  };
};

// Validate PDF generation inputs
const validatePDFInputs = (payslipData: PayslipData): void => {
  if (!payslipData.name?.trim()) {
    throw new Error('Employee name is required for PDF generation');
  }
  
  if (!payslipData.companyName?.trim()) {
    throw new Error('Company name is required for PDF generation');
  }
  
  if (typeof payslipData.grossPay !== 'number' || payslipData.grossPay < 0) {
    throw new Error('Invalid gross pay amount for PDF generation');
  }
  
  if (!Array.isArray(payslipData.deductions)) {
    throw new Error('Invalid deductions data for PDF generation');
  }
};

export const generatePayslipPDF = async (payslipData: PayslipData, currency: string = '£'): Promise<void> => {
  try {
    console.log('🟢 Starting PDF generation for:', payslipData.name);
    
    // Validate inputs
    validatePDFInputs(payslipData);
    
    // Sanitize data
    const sanitizedData = sanitizePayslipData(payslipData);
    console.log('✅ Data validated and sanitized');
    
    // Find the payslip preview element
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      console.error('❌ Payslip preview element not found');
      throw new Error('Payslip preview element not found');
    }
    
    console.log('✅ Found payslip element:', payslipElement);

    // Security check: ensure element is actually visible
    const elementRect = payslipElement.getBoundingClientRect();
    if (elementRect.width === 0 || elementRect.height === 0) {
      console.error('❌ Payslip preview element is not visible');
      throw new Error('Payslip preview element is not visible');
    }

    // Wait for any animations or layouts to settle
    console.log('⏳ Waiting for layout to settle...');
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('📸 Starting html2canvas...');
    // Create canvas with security-conscious settings
    const canvas = await html2canvas(payslipElement, {
      scale: Math.min(1.5, window.devicePixelRatio || 1), // Limit scale to prevent memory issues
      useCORS: true,
      allowTaint: false, // More secure
      backgroundColor: '#ffffff',
      logging: false, // Disable logging in production
      removeContainer: true,
      width: Math.min(elementRect.width, 2000), // Limit canvas size
      height: Math.min(elementRect.height, 3000)
    });

    console.log('✅ Canvas created successfully:', {
      width: canvas.width,
      height: canvas.height
    });

    // Validate canvas dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Invalid canvas dimensions generated');
    }

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
    
    // Validate image data
    if (!imgData || imgData.length < 100) {
      throw new Error('Failed to generate valid image data');
    }
    
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

    // Generate safe filename
    const safeName = sanitizedData.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const safePeriod = sanitizedData.period.replace(/[^a-zA-Z0-9-]/g, '-');
    const fileName = `payslip-${safeName}-${safePeriod}.pdf`;
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
    
    // Don't expose internal errors to user
    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error occurred during PDF generation');
    } else if (error.message.includes('memory') || error.message.includes('canvas')) {
      throw new Error('Unable to process image for PDF generation');
    } else {
      throw new Error('PDF generation failed. Please try again.');
    }
  }
};

export const generatePayslipBlob = async (payslipData: PayslipData, currency: string = '£'): Promise<Blob> => {
  try {
    console.log('🟢 Starting PDF blob generation for:', payslipData.name);
    
    // Validate inputs
    validatePDFInputs(payslipData);
    
    // Sanitize data
    const sanitizedData = sanitizePayslipData(payslipData);
    
    const payslipElement = document.querySelector('[data-payslip-preview]') as HTMLElement;
    
    if (!payslipElement) {
      console.error('❌ Payslip preview element not found for blob generation');
      throw new Error('Payslip preview element not found');
    }

    console.log('✅ Found payslip element for blob');
    
    // Security check: ensure element is actually visible
    const elementRect = payslipElement.getBoundingClientRect();
    if (elementRect.width === 0 || elementRect.height === 0) {
      throw new Error('Payslip preview element is not visible');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('📸 Starting html2canvas for blob...');
    const canvas = await html2canvas(payslipElement, {
      scale: Math.min(1.5, window.devicePixelRatio || 1),
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true,
      width: Math.min(elementRect.width, 2000),
      height: Math.min(elementRect.height, 3000)
    });

    console.log('✅ Canvas created for blob:', {
      width: canvas.width,
      height: canvas.height
    });

    // Validate canvas
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Invalid canvas dimensions for blob generation');
    }

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
    
    // Validate image data
    if (!imgData || imgData.length < 100) {
      throw new Error('Failed to generate valid image data for blob');
    }
    
    console.log('➕ Adding image to PDF blob...');
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    
    console.log('🔄 Converting PDF to blob...');
    const blob = pdf.output('blob');
    console.log('✅ Blob generated successfully, size:', blob.size);

    // Validate blob size (reasonable limits)
    if (blob.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Generated PDF is too large');
    }

    return blob;
  } catch (error) {
    console.error('💥 PDF blob generation failed:', error);
    console.error('Blob error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Don't expose internal errors
    throw new Error('PDF generation failed. Please try again.');
  }
};
