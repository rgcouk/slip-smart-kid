
import React from 'react';

interface ProfessionalPayslipTemplateProps {
  payslipData: any;
  currency: string;
  ytdValues: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
  totalDeductions: number;
  netPay: number;
}

export const ProfessionalPayslipTemplate = React.memo(({ 
  payslipData, 
  currency, 
  ytdValues, 
  totalDeductions, 
  netPay 
}: ProfessionalPayslipTemplateProps) => {
  const getCurrentPeriodNumber = () => {
    if (!payslipData.period) return 1;
    const [, month] = payslipData.period.split('-');
    return parseInt(month) || 1;
  };

  const periodNumber = getCurrentPeriodNumber();

  return (
    <div 
      className="fixed top-0 left-[-9999px]"
      data-payslip-preview
      style={{ 
        width: '794px',
        padding: '40px',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#000',
        position: 'absolute',
        opacity: 1,
        pointerEvents: 'none'
      }}
    >
      {/* Professional Header */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#000' }}>PAYSLIP</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
              Pay Period: {new Date(payslipData.period + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>Employee No: {payslipData.payrollNumber || '001'}</p>
            <p style={{ margin: '0' }}>Pay Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>

      {/* Employee and Company Information */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
            Employee Details
          </h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Name:</span>
              <span style={{ fontWeight: 'bold' }}>{payslipData.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Tax Code:</span>
              <span>1257L</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>NI Number:</span>
              <span>JZ23434C</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>NI Category:</span>
              <span>A</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
            Employer Details
          </h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{payslipData.companyName}</div>
            {payslipData.companyAddress && (
              <div style={{ marginBottom: '3px' }}>{payslipData.companyAddress}</div>
            )}
            <div>PAYE Ref: 120/GE26732</div>
            <div>Accounts Office Ref: 120PG00000</div>
          </div>
        </div>
      </div>

      {/* Main Payslip Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '2px solid #000' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Description
            </th>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              This Period ({currency})
            </th>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Year to Date ({currency})
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Payments Section */}
          <tr>
            <td colSpan={3} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#e8f4fd', fontWeight: 'bold' }}>
              PAYMENTS
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '6px' }}>Basic Salary</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
              {payslipData.grossPay.toFixed(2)}
            </td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
              {ytdValues.grossPay.toFixed(2)}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Total Gross Pay</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
              {payslipData.grossPay.toFixed(2)}
            </td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
              {ytdValues.grossPay.toFixed(2)}
            </td>
          </tr>

          {/* Deductions Section */}
          <tr>
            <td colSpan={3} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#fde8e8', fontWeight: 'bold' }}>
              DEDUCTIONS
            </td>
          </tr>
          {payslipData.deductions.map((deduction: any) => (
            <tr key={deduction.id}>
              <td style={{ border: '1px solid #000', padding: '6px' }}>{deduction.name}</td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
                {deduction.amount.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
                {(deduction.amount * periodNumber).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Total Deductions</td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
              {totalDeductions.toFixed(2)}
            </td>
            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
              {ytdValues.totalDeductions.toFixed(2)}
            </td>
          </tr>

          {/* Net Pay */}
          <tr style={{ backgroundColor: '#e8f5e8', borderTop: '2px solid #000' }}>
            <td style={{ border: '1px solid #000', padding: '10px', fontWeight: 'bold', fontSize: '14px' }}>
              NET PAY
            </td>
            <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
              {netPay.toFixed(2)}
            </td>
            <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
              {ytdValues.netPay.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Payment Method */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Payment Method</h4>
        <div style={{ fontSize: '11px' }}>
          <div style={{ marginBottom: '2px' }}>Method: Bank Transfer</div>
          <div>Date Paid: {new Date().toLocaleDateString('en-GB')}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', fontSize: '10px', color: '#666' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: '0 0 5px 0' }}>This payslip is computer generated and does not require a signature.</p>
            <p style={{ margin: '0' }}>For queries, please contact the HR department.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff6600' }}>SlipSim</div>
            <div style={{ fontSize: '9px' }}>Professional Payroll Solutions</div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfessionalPayslipTemplate.displayName = 'ProfessionalPayslipTemplate';
