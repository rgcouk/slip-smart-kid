
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

const generatePayslipHTML = (data: PayslipData, currency: string = '£') => {
  const totalDeductions = data.deductions.reduce((sum, d) => sum + d.amount, 0);
  const netPay = data.ytdOverride?.netPay ?? (data.grossPay - totalDeductions);
  
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payslip - ${data.name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          background: white;
          padding: 20px;
        }
        
        .payslip {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 2px solid #333;
          padding: 20px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }
        
        .company-info h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .company-info p {
          font-size: 11px;
          color: #666;
        }
        
        .period-info {
          text-align: right;
          font-size: 11px;
        }
        
        .employee-company-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 25px;
        }
        
        .section-title {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 8px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 3px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 11px;
        }
        
        .payments-deductions {
          margin-bottom: 20px;
        }
        
        .payments-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 20px;
        }
        
        .payment-item, .deduction-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 11px;
          border-bottom: 1px dotted #ccc;
        }
        
        .payment-item:last-child, .deduction-item:last-child {
          border-bottom: none;
          font-weight: bold;
          border-top: 1px solid #333;
          padding-top: 6px;
          margin-top: 6px;
        }
        
        .summary {
          background: #f8f9fa;
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 12px;
        }
        
        .summary-row.total {
          font-weight: bold;
          font-size: 14px;
          border-top: 2px solid #333;
          padding-top: 8px;
          margin-top: 8px;
        }
        
        .footer {
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 15px;
          margin-top: 20px;
        }
        
        .footer .brand {
          color: #ff6b35;
          font-weight: bold;
          font-size: 12px;
        }
        
        .payment-detail {
          font-size: 9px;
          color: #888;
          margin-left: 10px;
        }
        
        @media print {
          body { margin: 0; padding: 0; }
          .payslip { border: none; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="payslip">
        <div class="header">
          <div class="company-info">
            <h1>PAYSLIP</h1>
            <p>Pay Period: ${formatPeriod(data)}</p>
          </div>
          <div class="period-info">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            ${data.payrollNumber ? `<p><strong>Payroll No:</strong> ${data.payrollNumber}</p>` : ''}
          </div>
        </div>
        
        <div class="employee-company-section">
          <div class="employee-details">
            <div class="section-title">Employee Details</div>
            <div class="info-row">
              <span>Name:</span>
              <span><strong>${data.name}</strong></span>
            </div>
            <div class="info-row">
              <span>Pay Period:</span>
              <span>${formatPeriod(data)}</span>
            </div>
            ${data.contractualHours ? `
            <div class="info-row">
              <span>Contractual Hours:</span>
              <span>${data.contractualHours}/week</span>
            </div>` : ''}
          </div>
          
          <div class="company-details">
            <div class="section-title">Company Details</div>
            <div class="info-row">
              <span>Company:</span>
              <span><strong>${data.companyName}</strong></span>
            </div>
            ${data.companyAddress ? `
            <div class="info-row">
              <span>Address:</span>
              <span>${data.companyAddress}</span>
            </div>` : ''}
            ${data.companyPhone ? `
            <div class="info-row">
              <span>Phone:</span>
              <span>${data.companyPhone}</span>
            </div>` : ''}
            ${data.companyEmail ? `
            <div class="info-row">
              <span>Email:</span>
              <span>${data.companyEmail}</span>
            </div>` : ''}
          </div>
        </div>
        
        <div class="payments-deductions">
          <div class="payments-grid">
            <div class="payments">
              <div class="section-title">Payments</div>
              ${data.paymentEntries.map(entry => `
                <div class="payment-item">
                  <div>
                    <div>${entry.description}</div>
                    ${entry.type === 'hourly' && entry.quantity && entry.rate ? 
                      `<div class="payment-detail">${entry.quantity} hrs × ${currency}${entry.rate.toFixed(2)}</div>` : 
                      entry.type === 'overtime' && entry.quantity && entry.rate ?
                      `<div class="payment-detail">${entry.quantity} hrs × ${currency}${entry.rate.toFixed(2)} (OT)</div>` : ''
                    }
                  </div>
                  <span>${currency}${entry.amount.toFixed(2)}</span>
                </div>
              `).join('')}
              <div class="payment-item">
                <span><strong>Total Payments</strong></span>
                <span><strong>${currency}${data.grossPay.toFixed(2)}</strong></span>
              </div>
            </div>
            
            <div class="deductions">
              <div class="section-title">Deductions</div>
              ${data.deductions.length > 0 ? data.deductions.map(deduction => `
                <div class="deduction-item">
                  <span>${deduction.name}</span>
                  <span>${currency}${deduction.amount.toFixed(2)}</span>
                </div>
              `).join('') : '<div class="deduction-item">No deductions</div>'}
              <div class="deduction-item">
                <span><strong>Total Deductions</strong></span>
                <span><strong>${currency}${totalDeductions.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="summary">
          <div class="summary-row">
            <span>Gross Pay:</span>
            <span>${currency}${data.grossPay.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Total Deductions:</span>
            <span>-${currency}${totalDeductions.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Net Pay:</span>
            <span>${currency}${netPay.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>This payslip is computer generated and does not require a signature.</p>
          <p>For queries, please contact the HR department.</p>
          <div style="margin-top: 10px;">
            <span>Powered by </span>
            <span class="brand">SlipSim</span>
            <span> • Professional Payroll Solutions</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
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
    
    // Generate HTML content
    const html = generatePayslipHTML(payslipData, currency);
    
    // Use Puppeteer to generate PDF
    // For now, we'll use a service like htmlcsstoimg.com or similar
    // In a real implementation, you'd need to deploy Puppeteer in a container
    const response = await fetch('https://htmlcsstoimage.com/demo_run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        css: '',
        width: 800,
        height: 1000,
        device_scale_factor: 2,
        format: 'pdf'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const pdfBuffer = await response.arrayBuffer();
    
    console.log('PDF generated successfully, size:', pdfBuffer.byteLength);

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
