
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

// Enhanced PDF generation with better error handling and performance
export const generatePayslipPDF = async (payslipData: PayslipData, currency: string = '£'): Promise<void> => {
  try {
    console.log('🟢 Starting PDF generation for:', payslipData.name);
    
    // Validate inputs
    validatePDFInputs(payslipData);
    
    // Sanitize data
    const sanitizedData = sanitizePayslipData(payslipData);
    console.log('✅ Data validated and sanitized');
    
    // Prepare request payload
    const requestPayload = {
      payslipData: sanitizedData,
      currency
    };
    
    console.log('📤 Sending request to edge function...');
    
    // Call the Edge Function with optimized error handling
    const response = await supabase.functions.invoke('generate-pdf', {
      body: requestPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Response received:', {
      hasError: !!response.error,
      hasData: !!response.data,
      dataType: typeof response.data
    });

    if (response.error) {
      console.error('❌ Edge function error:', response.error);
      throw new Error(`PDF generation failed: ${response.error.message || 'Unknown error'}`);
    }

    // Handle different response data types
    let pdfData: ArrayBuffer;
    
    if (response.data instanceof ArrayBuffer) {
      pdfData = response.data;
    } else if (typeof response.data === 'string') {
      // If it's a base64 string, decode it
      try {
        const binaryString = atob(response.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        pdfData = bytes.buffer;
      } catch (decodeError) {
        console.error('❌ Failed to decode PDF data:', decodeError);
        throw new Error('Invalid PDF data format received');
      }
    } else {
      console.error('❌ Unexpected PDF data type:', typeof response.data);
      throw new Error(`Unexpected PDF data type: ${typeof response.data}`);
    }

    if (!pdfData || pdfData.byteLength === 0) {
      throw new Error('Empty PDF data received from server');
    }

    console.log('✅ PDF data processed, size:', pdfData.byteLength);

    // Generate safe filename
    const safeName = sanitizedData.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const safePeriod = sanitizedData.payPeriodStart ? 
      sanitizedData.payPeriodStart.replace(/[^a-zA-Z0-9-]/g, '-') :
      sanitizedData.period?.replace(/[^a-zA-Z0-9-]/g, '-') || 'unknown';
    const fileName = `payslip-${safeName}-${safePeriod}.pdf`;
    
    // Create and trigger download
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL to prevent memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    console.log('🎉 PDF download initiated successfully!');
  } catch (error) {
    console.error('💥 PDF generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Optimized blob generation for preview
export const generatePayslipBlob = async (payslipData: PayslipData, currency: string = '£'): Promise<Blob> => {
  try {
    console.log('🟢 Starting PDF blob generation for:', payslipData.name);
    
    // Validate inputs
    validatePDFInputs(payslipData);
    
    // Sanitize data
    const sanitizedData = sanitizePayslipData(payslipData);
    
    // Prepare request payload
    const requestPayload = {
      payslipData: sanitizedData,
      currency
    };
    
    // Call the Edge Function
    const response = await supabase.functions.invoke('generate-pdf', {
      body: requestPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.error) {
      console.error('❌ Edge function error:', response.error);
      throw new Error(`PDF generation failed: ${response.error.message || 'Unknown error'}`);
    }

    // Handle different response data types
    let pdfData: ArrayBuffer;
    
    if (response.data instanceof ArrayBuffer) {
      pdfData = response.data;
    } else if (typeof response.data === 'string') {
      try {
        const binaryString = atob(response.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        pdfData = bytes.buffer;
      } catch (decodeError) {
        throw new Error('Invalid PDF data format received');
      }
    } else {
      throw new Error(`Unexpected PDF data type: ${typeof response.data}`);
    }

    if (!pdfData || pdfData.byteLength === 0) {
      throw new Error('Empty PDF data received from server');
    }

    const blob = new Blob([pdfData], { type: 'application/pdf' });
    console.log('✅ PDF blob generated successfully, size:', blob.size);

    return blob;
  } catch (error) {
    console.error('💥 PDF blob generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
