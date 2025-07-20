
import React from 'react';

interface CompactSummaryProps {
  payslipData: any;
  currency: string;
  ytdValues: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

export const CompactSummary = ({ payslipData, currency, ytdValues }: CompactSummaryProps) => {
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const netPay = payslipData.grossPay - totalDeductions;

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {/* This Month */}
      <div className="border border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-gray-900 text-sm">This Month</h3>
        </div>
        <div className="p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-700">Taxable gross pay</span>
            <span className="font-medium">{currency}{payslipData.grossPay.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Year to Date */}
      <div className="border border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-gray-900 text-sm">Year to Date</h3>
        </div>
        <div className="p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-700">Taxable gross pay</span>
            <span className="font-medium">{currency}{ytdValues.grossPay.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tax</span>
            <span className="font-medium">{currency}{(ytdValues.totalDeductions * 0.7).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Employee National Insurance</span>
            <span className="font-medium">{currency}{(ytdValues.totalDeductions * 0.12).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Employee pension</span>
            <span className="font-medium">{currency}{(ytdValues.totalDeductions * 0.05).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Employer pension</span>
            <span className="font-medium">{currency}{(ytdValues.totalDeductions * 0.03).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="border border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-gray-900 text-sm">Payment</h3>
        </div>
        <div className="p-3 flex flex-col justify-center items-center h-24">
          <div className="text-3xl font-bold text-gray-900">
            {currency}{netPay.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Paid {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>
    </div>
  );
};
