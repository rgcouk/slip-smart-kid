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
  isParentMode = false,
  selectedChild,
  locale = 'en-GB'
}) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 sm:p-6 mx-auto max-w-4xl">
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
  );
};