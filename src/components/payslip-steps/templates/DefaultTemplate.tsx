import React from 'react';
import { TemplateProps } from './index';
import { PayslipHeader } from '../preview/PayslipHeader';
import { CompanyEmployeeDetails } from '../preview/CompanyEmployeeDetails';
import { PaymentsDeductionsSection } from '../preview/PaymentsDeductionsSection';
import { SummarySection } from '../preview/SummarySection';
import { PayslipFooter } from '../preview/PayslipFooter';

export const DefaultTemplate: React.FC<TemplateProps> = ({ 
  payslipData, 
  currency, 
  ytdValues,
  totalDeductions,
  netPay,
  isParentMode = false,
  selectedChild,
  locale = 'en-GB'
}) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 sm:p-6 mx-auto max-w-4xl">
      {/* Hidden PDF Template */}
      <div 
        className="fixed top-0 left-[-9999px]"
        data-payslip-preview
        style={{ 
          width: '794px',
          padding: '40px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.4'
        }}
      >
        {/* PDF Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
              {payslipData.companyName || 'Company Name'}
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
              {payslipData.companyAddress || 'Company Address'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', margin: '0', color: '#333' }}>PAY SLIP</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              Pay Period: {payslipData.period}
            </p>
          </div>
        </div>

        {/* Employee Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#333' }}>Employee Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '12px' }}>
            <div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Name:</strong> {payslipData.name}
              </div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Employee ID:</strong> {payslipData.payrollNumber || 'N/A'}
              </div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Tax Code:</strong> {payslipData.taxCode || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '5px' }}>
                <strong>NI Number:</strong> {payslipData.niNumber || 'N/A'}
              </div>
              <div style={{ marginBottom: '5px' }}>
                <strong>NI Category:</strong> {payslipData.niCategory || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Payments and Deductions */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Description</th>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>This Period</th>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>Year to Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Gross Pay */}
            <tr>
              <td style={{ border: '1px solid #333', padding: '6px' }}>Gross Pay</td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{payslipData.grossPay?.toFixed(2) || '0.00'}
              </td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}
              </td>
            </tr>
            
            {/* Payment Entries */}
            {payslipData.paymentEntries?.map((entry: any, index: number) => (
              <tr key={entry.id || index}>
                <td style={{ border: '1px solid #333', padding: '6px' }}>{entry.description}</td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                  {currency}{entry.amount?.toFixed(2) || '0.00'}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                  {currency}{(entry.amount * (ytdValues.grossPay / payslipData.grossPay)).toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}

            {/* Deductions */}
            {payslipData.deductions?.map((deduction: any, index: number) => (
              <tr key={deduction.id || index}>
                <td style={{ border: '1px solid #333', padding: '6px' }}>{deduction.name}</td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                  -{currency}{deduction.amount?.toFixed(2) || '0.00'}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                  -{currency}{(deduction.amount * (ytdValues.grossPay / payslipData.grossPay)).toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}

            {/* Net Pay */}
            <tr style={{ backgroundColor: '#e8f5e8', fontWeight: 'bold' }}>
              <td style={{ border: '1px solid #333', padding: '8px' }}>NET PAY</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>
                {currency}{netPay?.toFixed(2) || '0.00'}
              </td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>
                {currency}{ytdValues.netPay?.toFixed(2) || '0.00'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', fontSize: '10px', color: '#666', textAlign: 'center' }}>
          <p style={{ margin: '0' }}>
            This payslip is computer generated and does not require a signature.
          </p>
        </div>
      </div>

      {/* Visible Display Version */}
      <div className="space-y-6">
        <PayslipHeader 
          period={payslipData.period}
          locale={locale}
        />

        <CompanyEmployeeDetails 
          payslipData={payslipData}
          isParentMode={isParentMode}
          selectedChild={selectedChild}
        />

        <PaymentsDeductionsSection 
          payslipData={payslipData}
          currency={currency}
          ytdValues={ytdValues}
        />

        <SummarySection 
          payslipData={payslipData}
          currency={currency}
          ytdValues={ytdValues}
        />

        <PayslipFooter />
      </div>
    </div>
  );
};