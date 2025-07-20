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
          fontSize: '12px',
          lineHeight: '1.3'
        }}
      >
        {/* PDF Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#333' }}>
            {payslipData.companyName || 'Company Name'}
          </h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Payslip for {payslipData.period}
          </p>
        </div>

        {/* Employee Information - Compact */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '11px' }}>
          <div>
            <div><strong>Employee:</strong> {payslipData.name}</div>
            <div><strong>ID:</strong> {payslipData.payrollNumber || 'N/A'}</div>
          </div>
          <div>
            <div><strong>Tax Code:</strong> {payslipData.taxCode || 'N/A'}</div>
            <div><strong>NI:</strong> {payslipData.niNumber || 'N/A'}</div>
          </div>
        </div>

        {/* Simple Payment Summary */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>Gross Pay:</span>
            <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
          </div>
          
          {payslipData.deductions?.map((deduction: any, index: number) => (
            <div key={deduction.id || index} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '10px', color: '#666' }}>
              <span>{deduction.name}:</span>
              <span>-{currency}{deduction.amount?.toFixed(2) || '0.00'}</span>
            </div>
          ))}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #333', fontWeight: 'bold', fontSize: '14px' }}>
            <span>NET PAY:</span>
            <span>{currency}{netPay?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        {/* YTD Summary */}
        <div style={{ fontSize: '10px', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>YTD Gross:</span>
            <span>{currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>YTD Deductions:</span>
            <span>{currency}{ytdValues.totalDeductions?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>YTD Net:</span>
            <span>{currency}{ytdValues.netPay?.toFixed(2) || '0.00'}</span>
          </div>
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