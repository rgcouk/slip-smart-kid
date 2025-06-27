
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { generate } from "https://esm.sh/@pdfme/generator@5.4.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentEntry {
  id: string;
  description: string;
  type: 'hourly' | 'fixed' | 'overtime' | 'bonus';
  quantity?: number;
  rate?: number;
  amount: number;
}

interface PayslipData {
  name: string;
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyRegistration?: string;
  companyLogo?: string;
  grossPay: number;
  contractualHours?: number;
  hourlyRate?: number;
  paymentEntries: PaymentEntry[];
  deductions: Array<{ id: string; name: string; amount: number }>;
  period?: string;
  payPeriodStart?: string;
  payPeriodEnd?: string;
  payrollNumber?: string;
  ytdOverride?: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

const createPayslipTemplate = () => {
  return {
    schemas: [
      {
        // Header
        title: {
          type: "text",
          position: { x: 20, y: 15 },
          width: 100,
          height: 15,
          fontSize: 24,
          fontColor: "#000000",
          fontName: "Helvetica-Bold",
          alignment: "left"
        },
        
        // Employee Details
        employeeSection: {
          type: "text",
          position: { x: 20, y: 40 },
          width: 80,
          height: 60,
          fontSize: 10,
          fontColor: "#000000",
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Company Details
        companySection: {
          type: "text", 
          position: { x: 110, y: 40 },
          width: 80,
          height: 60,
          fontSize: 10,
          fontColor: "#000000",
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Payments Table
        paymentsTable: {
          type: "text",
          position: { x: 20, y: 110 },
          width: 170,
          height: 50,
          fontSize: 9,
          fontColor: "#000000", 
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Summary
        summary: {
          type: "text",
          position: { x: 20, y: 170 },
          width: 170,
          height: 40,
          fontSize: 11,
          fontColor: "#000000",
          fontName: "Helvetica-Bold",
          alignment: "left",
          backgroundColor: "#f8f9fa"
        },
        
        // Footer
        footer: {
          type: "text",
          position: { x: 20, y: 220 },
          width: 170,
          height: 30,
          fontSize: 8,
          fontColor: "#666666",
          fontName: "Helvetica",
          alignment: "center"
        }
      }
    ],
    basePdf: "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9PdXRsaW5lcwovQ291bnQgMAo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Ci9NZWRpYUJveFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVApxCjAgMCAwIHJnCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCEpIFRqCkVUClEKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTAzIDAwMDAwIG4gCjAwMDAwMDAxNjAgMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAowMDAwMDAwMzY2IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNwovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDU5CiUlRU9G"
  };
};

const formatPeriod = (data: PayslipData) => {
  if (data.payPeriodStart && data.payPeriodEnd) {
    const start = new Date(data.payPeriodStart);
    const end = new Date(data.payPeriodEnd);
    return `${start.toLocaleDateString('en-GB')} - ${end.toLocaleDateString('en-GB')}`;
  } else if (data.period) {
    const [year, month] = data.period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }
  return 'Unknown Period';
};

const generatePayslipPDF = async (data: PayslipData, currency: string = '£') => {
  const totalDeductions = data.deductions.reduce((sum, d) => sum + d.amount, 0);
  const netPay = data.ytdOverride?.netPay ?? (data.grossPay - totalDeductions);
  
  // Build employee section
  const employeeText = `EMPLOYEE DETAILS
Name: ${data.name}
Pay Period: ${formatPeriod(data)}
${data.payrollNumber ? `Payroll No: ${data.payrollNumber}` : ''}
${data.contractualHours ? `Hours/Week: ${data.contractualHours}` : ''}`;

  // Build company section  
  const companyText = `COMPANY DETAILS
${data.companyName}
${data.companyAddress || ''}
${data.companyPhone ? `Tel: ${data.companyPhone}` : ''}
${data.companyEmail ? `Email: ${data.companyEmail}` : ''}`;

  // Build payments table using standard ASCII characters
  let paymentsTable = `PAYMENTS & DEDUCTIONS
_________________________________________________________________
Description                           This Period     Year to Date
_________________________________________________________________

PAYMENTS:
`;

  // Add payment entries
  data.paymentEntries.forEach(entry => {
    const ytdAmount = entry.amount * (data.period ? parseInt(data.period.split('-')[1]) : 1);
    paymentsTable += `${entry.description.padEnd(35)} ${currency}${entry.amount.toFixed(2).padStart(10)} ${currency}${ytdAmount.toFixed(2).padStart(10)}\n`;
  });

  paymentsTable += `\nDEDUCTIONS:\n`;
  
  // Add deductions
  data.deductions.forEach(deduction => {
    const ytdAmount = deduction.amount * (data.period ? parseInt(data.period.split('-')[1]) : 1);
    paymentsTable += `${deduction.name.padEnd(35)} ${currency}${deduction.amount.toFixed(2).padStart(10)} ${currency}${ytdAmount.toFixed(2).padStart(10)}\n`;
  });

  // Build summary using standard ASCII characters
  const summaryText = `_________________________________________________________________
TOTAL GROSS PAY:                      ${currency}${data.grossPay.toFixed(2).padStart(10)}
TOTAL DEDUCTIONS:                     ${currency}${totalDeductions.toFixed(2).padStart(10)}
_________________________________________________________________
NET PAY:                              ${currency}${netPay.toFixed(2).padStart(10)}
_________________________________________________________________`;

  const footerText = `This payslip is computer generated and does not require a signature.
For queries, please contact the HR department.

Generated on ${new Date().toLocaleDateString('en-GB')} | Powered by SlipSim`;

  const template = createPayslipTemplate();
  
  const inputs = [
    {
      title: "PAYSLIP",
      employeeSection: employeeText,
      companySection: companyText,
      paymentsTable: paymentsTable,
      summary: summaryText,
      footer: footerText
    }
  ];
  
  try {
    console.log('Generating PDF with pdfme...');
    const pdfBuffer = await generate({
      template,
      inputs
    });
    
    console.log('PDF generated successfully, buffer length:', pdfBuffer.byteLength);
    return new Uint8Array(pdfBuffer);
  } catch (error) {
    console.error('PDFme generation error:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payslipData, currency = '£' } = await req.json();
    
    if (!payslipData) {
      return new Response(
        JSON.stringify({ error: 'Payslip data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PDF for:', payslipData.name);
    
    const pdfBuffer = await generatePayslipPDF(payslipData, currency);
    
    console.log('PDF generated successfully, size:', pdfBuffer.length);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.payPeriodStart || payslipData.period || 'unknown'}.pdf"`
      },
    });

  } catch (error) {
    console.error('PDF generation failed:', error);
    return new Response(
      JSON.stringify({ error: 'PDF generation failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
