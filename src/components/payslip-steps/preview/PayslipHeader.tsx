
import React from 'react';

interface PayslipHeaderProps {
  companyLogo?: string;
  period: string;
  locale: string;
}

export const PayslipHeader = ({ companyLogo, period, locale }: PayslipHeaderProps) => {
  const formatPeriod = (period: string) => {
    if (!period) return '';
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getTaxYear = () => {
    if (!period) return '';
    const [year, month] = period.split('-');
    const currentYear = parseInt(year);
    
    if (locale === 'UK') {
      const taxYearStart = parseInt(month) >= 4 ? currentYear : currentYear - 1;
      return `${taxYearStart}/${(taxYearStart + 1).toString().slice(2)}`;
    } else {
      return currentYear.toString();
    }
  };

  return (
    <div className="text-center border-b border-gray-200 pb-4 mb-6">
      {companyLogo && (
        <div className="mb-4">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="h-16 w-auto mx-auto"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">PAYSLIP</h1>
      <p className="text-gray-600 mt-1">Pay Period: {formatPeriod(period)}</p>
      <p className="text-sm text-gray-500">Tax Year: {getTaxYear()}</p>
    </div>
  );
};
