
import React from 'react';

interface CalculationPreviewProps {
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  currencySymbol: string;
}

export const CalculationPreview = ({ grossPay, totalDeductions, netPay, currencySymbol }: CalculationPreviewProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Gross Pay:</span>
          <span className="font-medium">{currencySymbol}{grossPay.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Total Deductions:</span>
          <span className="font-medium text-red-600">-{currencySymbol}{totalDeductions.toFixed(2)}</span>
        </div>
        <div className="border-t border-green-300 pt-2 flex justify-between">
          <span className="font-semibold text-green-800">Net Pay:</span>
          <span className="font-semibold text-green-800">{currencySymbol}{netPay.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
