
import React from 'react';

interface PaymentsDeductionsSectionProps {
  payslipData: any;
  currency: string;
  ytdValues?: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

export const PaymentsDeductionsSection = ({ payslipData, currency }: PaymentsDeductionsSectionProps) => {
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Payments */}
      <div className="border border-gray-200 rounded">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Payments</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Pay</span>
            <span className="font-medium">{currency}{payslipData.grossPay.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{currency}{payslipData.grossPay.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div className="border border-gray-200 rounded">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Deductions</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          {payslipData.deductions.length > 0 ? (
            <>
              {payslipData.deductions.map((deduction: any) => (
                <div key={deduction.id} className="flex justify-between">
                  <span className="text-gray-600">{deduction.name}</span>
                  <span className="font-medium">{currency}{deduction.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{currency}{totalDeductions.toFixed(2)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic">No deductions</div>
          )}
        </div>
      </div>
    </div>
  );
};
