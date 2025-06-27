
import { supabase } from '@/integrations/supabase/client';
import { sanitizeTextInput } from './validation';
import { PayslipData } from '@/types/payslip';

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
    paymentEntries: data.paymentEntries.map(entry => ({
      ...entry,
      id: sanitizeTextInput(entry.id, 50),
      description: sanitizeTextInput(entry.description, 100),
      amount: Number(entry.amount) || 0,
      quantity: entry.quantity ? Number(entry.quantity) || 0 : undefined,
      rate: entry.rate ? Number(entry.rate) || 0 : undefined
    })),
    deductions: data.deductions.map(d => ({
      id: sanitizeTextInput(d.id, 50),
      name: sanitizeTextInput(d.name, 50),
      amount: Number(d.amount) || 0,
      type: d.type,
      value: Number(d.value) || 0
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
  
  if (!Array.isArray(payslipData.paymentEntries) || payslipData.paymentEntries.length === 0) {
    throw new Error('At least one payment entry is required for PDF generation');
  }
  
  if (!Array.isArray(payslipData.deductions)) {
    throw new Error('Invalid deductions data for PDF generation');
  }
};

export const generatePayslipPDF = async (payslipData: PayslipData, currency: string = '£'): Promise<void> => {
  try {
    console.log('🟢 Starting Puppeteer PDF generation for:', payslipData.name);
    
    // Validate inputs
    validatePDFInputs(payslipData);
    
    // Sanitize data
    const sanitizedData = sanitizePayslipData(payslipData);
    console.log('✅ Data validated and sanitized');
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        payslipData: sanitizedData,
        currency
      }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }

    // The Edge Function returns the PDF as a blob
    if (data) {
      const safeName = sanitizedData.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
      const safePeriod = sanitizedData.payPeriodStart ? 
        sanitizedData.payPeriodStart.replace(/[^a-zA-Z0-9-]/g, '-') :
        sanitizedData.period?.replace(/[^a-zA-Z0-9-]/g, '-') || 'unknown';
      const fileName = `payslip-${safeName}-${safePeriod}.pdf`;
      
      // Create download link
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('🎉 Puppeteer PDF generation completed successfully!');
    }
  } catch (error) {
    console.error('💥 Puppeteer PDF generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

export const generatePayslipBlob = async (payslipData: PayslipData, currency: string = '£'): Promise<Blob> => {
  try {
    console.log('🟢 Starting Puppeteer PDF blob generation for:', payslipData.name);
    
    // Validate inputs
    validatePDFInputs(payslipData);
    
    // Sanitize data
    const sanitizedData = sanitizePayslipData(payslipData);
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        payslipData: sanitizedData,
        currency
      }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No PDF data received from Edge Function');
    }

    const blob = new Blob([data], { type: 'application/pdf' });
    console.log('✅ Puppeteer PDF blob generated successfully, size:', blob.size);

    return blob;
  } catch (error) {
    console.error('💥 Puppeteer PDF blob generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
