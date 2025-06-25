
import React from 'react';

interface CompactPaymentsDeductionsProps {
  payslipData: any;
  currency: string;
}

export const CompactPaymentsDeductions = ({ payslipData, currency }: CompactPaymentsDeductionsProps) => {
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {/* Employee Details */}
      <div className="border border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-gray-900 text-sm">Employee Details</h3>
        </div>
        <div className="p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-700">Works number</span>
            <span className="font-medium">6</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tax code</span>
            <span className="font-medium">1257L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">National Insurance number</span>
            <span className="font-medium">JZ23434C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">National Insurance table</span>
            <span className="font-medium">A</span>
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="border border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-gray-900 text-sm">Payments</h3>
        </div>
        <div className="p-3 text-xs">
          <div className="flex justify-between mb-12">
            <span className="text-gray-700">Monthly pay</span>
            <span className="font-medium">{currency}{payslipData.grossPay.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-400 pt-1">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{currency}{payslipData.grossPay.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div className="border border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-gray-900 text-sm">Deductions</h3>
        </div>
        <div className="p-3 text-xs">
          {payslipData.deductions.length > 0 ? (
            <>
              <div className="space-y-1 mb-8">
                {payslipData.deductions.map((deduction: any, index: number) => (
                  <div key={deduction.id} className="flex justify-between">
                    <span className="text-gray-700">{deduction.name}</span>
                    <span className="font-medium">{currency}{deduction.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-400 pt-1">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{currency}{totalDeductions.toFixed(2)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic mb-12">No deductions</div>
          )}
        </div>
      </div>
    </div>
  );
};
