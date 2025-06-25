
import React from 'react';

interface SummarySectionProps {
  payslipData: any;
  currency: string;
  ytdValues: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

export const SummarySection = ({ payslipData, currency, ytdValues }: SummarySectionProps) => {
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const netPay = payslipData.grossPay - totalDeductions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* This Month */}
      <div className="border border-gray-200 rounded">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">This Month</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Pay</span>
            <span className="font-medium">{currency}{payslipData.grossPay.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Deductions</span>
            <span className="font-medium">{currency}{totalDeductions.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Net Pay</span>
              <span>{currency}{netPay.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Year to Date */}
      <div className="border border-gray-200 rounded">
        <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-blue-800">
            Year to Date
            {payslipData.ytdOverride && (
              <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                Manual
              </span>
            )}
          </h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Pay</span>
            <span className="font-medium">{currency}{ytdValues.grossPay.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Deductions</span>
            <span className="font-medium">{currency}{ytdValues.totalDeductions.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Net Pay</span>
              <span>{currency}{ytdValues.netPay.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
