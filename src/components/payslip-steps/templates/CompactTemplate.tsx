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
  isParentMode = false,
  selectedChild
}) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mx-auto max-w-3xl">
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
  );
};