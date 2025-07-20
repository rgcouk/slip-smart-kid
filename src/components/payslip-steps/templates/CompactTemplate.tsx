import React from 'react';
import { TemplateProps } from './index';
import { CompactEmployeeDetails } from '../preview/CompactEmployeeDetails';
import { CompactPaymentsDeductions } from '../preview/CompactPaymentsDeductions';
import { CompactSummary } from '../preview/CompactSummary';
import { CompactPayslipFooter } from '../preview/CompactPayslipFooter';

export const CompactTemplate: React.FC<TemplateProps> = ({ 
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
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mx-auto max-w-3xl">
      {/* Hidden PDF Template */}
      <div 
        className="fixed top-0 left-[-9999px]"
        data-payslip-preview
        style={{ 
          width: '794px',
          padding: '30px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          lineHeight: '1.4'
        }}
      >
        {/* PDF Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '15px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', color: '#333' }}>
            {payslipData.companyName || 'Company Name'}
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            Payslip for {payslipData.period || 'Pay Period'}
          </p>
          {payslipData.companyAddress && (
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              {payslipData.companyAddress}
            </p>
          )}
        </div>

        {/* Employee Information Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '12px', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
          <div>
            <div style={{ marginBottom: '4px' }}><strong>Employee:</strong> {payslipData.name || 'N/A'}</div>
            <div style={{ marginBottom: '4px' }}><strong>Employee ID:</strong> {payslipData.payrollNumber || 'N/A'}</div>
            <div><strong>Tax Code:</strong> {payslipData.taxCode || 'N/A'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '4px' }}><strong>NI Number:</strong> {payslipData.niNumber || 'N/A'}</div>
            <div style={{ marginBottom: '4px' }}><strong>NI Category:</strong> {payslipData.niCategory || 'A'}</div>
            <div><strong>Pay Date:</strong> {new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        {/* Payment Details Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Amount</th>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>YTD</th>
            </tr>
          </thead>
          <tbody>
            {/* Gross Pay */}
            <tr>
              <td style={{ border: '1px solid #333', padding: '6px', fontWeight: 'bold', color: '#28a745' }}>Gross Pay</td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                {currency}{payslipData.grossPay?.toFixed(2) || '0.00'}
              </td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', color: '#28a745' }}>
                {currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}
              </td>
            </tr>
            
            {/* Payment Entries */}
            {payslipData.paymentEntries?.map((entry: any, index: number) => (
              <tr key={entry.id || index}>
                <td style={{ border: '1px solid #333', padding: '6px', paddingLeft: '12px', fontSize: '11px', color: '#666' }}>
                  + {entry.description}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontSize: '11px' }}>
                  {currency}{entry.amount?.toFixed(2) || '0.00'}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontSize: '11px', color: '#666' }}>
                  {currency}{(entry.amount * (ytdValues.grossPay / (payslipData.grossPay || 1))).toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}

            {/* Deductions */}
            {payslipData.deductions?.map((deduction: any, index: number) => (
              <tr key={deduction.id || index}>
                <td style={{ border: '1px solid #333', padding: '6px', paddingLeft: '12px', fontSize: '11px', color: '#dc3545' }}>
                  - {deduction.name}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontSize: '11px', color: '#dc3545' }}>
                  -{currency}{deduction.amount?.toFixed(2) || '0.00'}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontSize: '11px', color: '#dc3545' }}>
                  -{currency}{(deduction.amount * (ytdValues.grossPay / (payslipData.grossPay || 1))).toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}

            {/* Total Deductions */}
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #333', padding: '6px', fontWeight: 'bold' }}>Total Deductions</td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                -{currency}{totalDeductions?.toFixed(2) || '0.00'}
              </td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                -{currency}{ytdValues.totalDeductions?.toFixed(2) || '0.00'}
              </td>
            </tr>

            {/* Net Pay */}
            <tr style={{ backgroundColor: '#d4edda', borderTop: '2px solid #28a745' }}>
              <td style={{ border: '1px solid #333', padding: '10px', fontWeight: 'bold', fontSize: '14px', color: '#155724' }}>
                NET PAY
              </td>
              <td style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#155724' }}>
                {currency}{netPay?.toFixed(2) || '0.00'}
              </td>
              <td style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#155724' }}>
                {currency}{ytdValues.netPay?.toFixed(2) || '0.00'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '12px', fontSize: '10px', color: '#666', textAlign: 'center' }}>
          <p style={{ margin: '0' }}>
            This payslip is computer generated and does not require a signature.
          </p>
          {payslipData.companyEmail && (
            <p style={{ margin: '5px 0 0 0' }}>
              For queries, contact: {payslipData.companyEmail}
            </p>
          )}
        </div>
      </div>

      {/* Visible Display Version */}
      <div className="space-y-4">
        {/* Compact Header */}
        <div className="text-center mb-4 border-b border-gray-300 pb-3">
          <h1 className="text-xl font-bold text-gray-800">{payslipData.companyName || 'Company Name'}</h1>
          <p className="text-sm text-gray-600">Payslip for {payslipData.period}</p>
        </div>

        {/* Employee Details */}
        <CompactEmployeeDetails 
          payslipData={payslipData}
          isParentMode={isParentMode}
          selectedChild={selectedChild}
        />

        {/* Payments and Deductions */}
        <CompactPaymentsDeductions 
          payslipData={payslipData}
          currency={currency}
        />

        {/* Summary */}
        <CompactSummary 
          payslipData={payslipData}
          currency={currency}
          ytdValues={ytdValues}
        />

        {/* Footer */}
        <CompactPayslipFooter payslipData={payslipData} />
      </div>
    </div>
  );
};