
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
        // Header Section
        title: {
          type: "text",
          position: { x: 10, y: 10 },
          width: 80,
          height: 12,
          fontSize: 24,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left"
        },
        generatedDate: {
          type: "text",
          position: { x: 130, y: 10 },
          width: 60,
          height: 8,
          fontSize: 10,
          fontColor: "#666666",
          fontName: "Helvetica",
          alignment: "right"
        },
        
        // Employee Details Section
        employeeLabel: {
          type: "text",
          position: { x: 10, y: 35 },
          width: 80,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Helvetica-Bold",
          alignment: "left"
        },
        employeeName: {
          type: "text",
          position: { x: 10, y: 45 },
          width: 80,
          height: 8,
          fontSize: 11,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left"
        },
        payPeriod: {
          type: "text",
          position: { x: 10, y: 55 },
          width: 80,
          height: 8,
          fontSize: 11,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Company Details Section
        companyLabel: {
          type: "text",
          position: { x: 110, y: 35 },
          width: 80,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Helvetica-Bold",
          alignment: "left"
        },
        companyName: {
          type: "text",
          position: { x: 110, y: 45 },
          width: 80,
          height: 8,
          fontSize: 11,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left"
        },
        companyAddress: {
          type: "text",
          position: { x: 110, y: 55 },
          width: 80,
          height: 8,
          fontSize: 9,
          fontColor: "#666666",
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Payments Section
        paymentsLabel: {
          type: "text",
          position: { x: 10, y: 80 },
          width: 80,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Helvetica-Bold",
          alignment: "left"
        },
        paymentsContent: {
          type: "text",
          position: { x: 10, y: 90 },
          width: 80,
          height: 40,
          fontSize: 10,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Deductions Section
        deductionsLabel: {
          type: "text",
          position: { x: 110, y: 80 },
          width: 80,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Helvetica-Bold",
          alignment: "left"
        },
        deductionsContent: {
          type: "text",
          position: { x: 110, y: 90 },
          width: 80,
          height: 40,
          fontSize: 10,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left"
        },
        
        // Summary Section
        summaryBox: {
          type: "text",
          position: { x: 10, y: 140 },
          width: 180,
          height: 30,
          fontSize: 11,
          fontColor: "#333333",
          fontName: "Helvetica",
          alignment: "left",
          backgroundColor: "#f8f9fa"
        },
        
        // Footer
        footer: {
          type: "text",
          position: { x: 10, y: 180 },
          width: 180,
          height: 20,
          fontSize: 9,
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
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return 'Unknown Period';
};

const generatePayslipPDF = async (data: PayslipData, currency: string = '£') => {
  const totalDeductions = data.deductions.reduce((sum, d) => sum + d.amount, 0);
  const netPay = data.ytdOverride?.netPay ?? (data.grossPay - totalDeductions);
  
  // Format payments content
  let paymentsText = '';
  data.paymentEntries.forEach(entry => {
    paymentsText += `${entry.description}\n`;
    if (entry.type === 'hourly' && entry.quantity && entry.rate) {
      paymentsText += `  ${entry.quantity} hrs × ${currency}${entry.rate.toFixed(2)}\n`;
    } else if (entry.type === 'overtime' && entry.quantity && entry.rate) {
      paymentsText += `  ${entry.quantity} hrs × ${currency}${entry.rate.toFixed(2)} (OT)\n`;
    }
    paymentsText += `  ${currency}${entry.amount.toFixed(2)}\n\n`;
  });
  paymentsText += `Total Payments: ${currency}${data.grossPay.toFixed(2)}`;
  
  // Format deductions content
  let deductionsText = '';
  if (data.deductions.length > 0) {
    data.deductions.forEach(deduction => {
      deductionsText += `${deduction.name}\n${currency}${deduction.amount.toFixed(2)}\n\n`;
    });
  } else {
    deductionsText = 'No deductions\n';
  }
  deductionsText += `Total Deductions: ${currency}${totalDeductions.toFixed(2)}`;
  
  // Format summary
  const summaryText = `Gross Pay: ${currency}${data.grossPay.toFixed(2)}
Total Deductions: -${currency}${totalDeductions.toFixed(2)}

NET PAY: ${currency}${netPay.toFixed(2)}`;
  
  // Footer text
  const footerText = `This payslip is computer generated and does not require a signature.
For queries, please contact the HR department.

Powered by SlipSim • Professional Payroll Solutions`;
  
  const template = createPayslipTemplate();
  
  const inputs = [
    {
      title: "PAYSLIP",
      generatedDate: `Generated: ${new Date().toLocaleDateString('en-GB')}${data.payrollNumber ? `\nPayroll No: ${data.payrollNumber}` : ''}`,
      employeeLabel: "Employee Details",
      employeeName: `Name: ${data.name}`,
      payPeriod: `Pay Period: ${formatPeriod(data)}${data.contractualHours ? `\nContractual Hours: ${data.contractualHours}/week` : ''}`,
      companyLabel: "Company Details",
      companyName: `Company: ${data.companyName}`,
      companyAddress: `${data.companyAddress || ''}${data.companyPhone ? `\nPhone: ${data.companyPhone}` : ''}${data.companyEmail ? `\nEmail: ${data.companyEmail}` : ''}`,
      paymentsLabel: "Payments",
      paymentsContent: paymentsText,
      deductionsLabel: "Deductions",
      deductionsContent: deductionsText,
      summaryBox: summaryText,
      footer: footerText
    }
  ];
  
  try {
    const pdfBuffer = await generate({
      template,
      inputs
    });
    
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

    console.log('Generating PDF with pdfme for:', payslipData.name);
    
    const pdfBuffer = await generatePayslipPDF(payslipData, currency);
    
    console.log('PDF generated successfully with pdfme, size:', pdfBuffer.length);

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
