
import React from 'react';

interface CompanyEmployeeDetailsProps {
  payslipData: any;
  isParentMode: boolean;
  selectedChild: any;
}

export const CompanyEmployeeDetails = ({ payslipData, isParentMode, selectedChild }: CompanyEmployeeDetailsProps) => {
  const formatPeriod = (period: string) => {
    if (!period) return '';
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Company Details */}
      <div className="border border-gray-200 rounded">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Company Details</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div>
            <span className="font-medium">{payslipData.companyName}</span>
          </div>
          {payslipData.companyAddress && (
            <div className="text-gray-600">{payslipData.companyAddress}</div>
          )}
          {payslipData.companyPhone && (
            <div className="text-gray-600">Tel: {payslipData.companyPhone}</div>
          )}
          {payslipData.companyEmail && (
            <div className="text-gray-600">Email: {payslipData.companyEmail}</div>
          )}
          {payslipData.companyRegistration && (
            <div className="text-gray-600">Reg: {payslipData.companyRegistration}</div>
          )}
        </div>
      </div>

      {/* Employee Details */}
      <div className="border border-gray-200 rounded">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Employee Details</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{payslipData.name}</span>
          </div>
          {payslipData.payrollNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600">Payroll Number:</span>
              <span className="font-medium">{payslipData.payrollNumber}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Pay Period:</span>
            <span className="font-medium">{formatPeriod(payslipData.period)}</span>
          </div>
          {isParentMode && selectedChild && (
            <div className="flex justify-between">
              <span className="text-gray-600">Created for:</span>
              <span className="font-medium">{selectedChild.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
