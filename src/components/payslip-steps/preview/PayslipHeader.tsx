
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
    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-800">
      <div className="flex items-center">
        {companyLogo && (
          <div className="mr-4">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="h-16 w-auto"
            />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">PAYSLIP</h1>
          <p className="text-sm text-gray-600">Pay Period: {formatPeriod(period)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">Tax Year: {getTaxYear()}</p>
        <p className="text-xs text-gray-600">Generated: {new Date().toLocaleDateString('en-GB')}</p>
      </div>
    </div>
  );
};
