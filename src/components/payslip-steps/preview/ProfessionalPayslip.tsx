
import React from 'react';

interface ProfessionalPayslipProps {
  payslipData: any;
  currency: string;
  ytdValues: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

export const ProfessionalPayslip = ({ payslipData, currency, ytdValues }: ProfessionalPayslipProps) => {
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const netPay = payslipData.grossPay - totalDeductions;

  return (
    <div className="bg-white">
      {/* Employee and Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1">Employee Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{payslipData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Employee ID:</span>
              <span className="text-gray-900">{payslipData.payrollNumber || '001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Tax Code:</span>
              <span className="text-gray-900">1257L</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">NI Number:</span>
              <span className="text-gray-900">JZ23434C</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">NI Category:</span>
              <span className="text-gray-900">A</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1">Company Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-gray-900">{payslipData.companyName}</span>
            </div>
            {payslipData.companyAddress && (
              <div className="text-gray-700">{payslipData.companyAddress}</div>
            )}
            <div className="text-gray-700">PAYE Ref: 120/GE26732</div>
            <div className="text-gray-700">Accounts Office Ref: 120PG00000</div>
          </div>
        </div>
      </div>

      {/* Payments and Deductions Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-4 py-3 text-left font-bold text-gray-800">Description</th>
              <th className="border border-gray-400 px-4 py-3 text-right font-bold text-gray-800">This Period</th>
              <th className="border border-gray-400 px-4 py-3 text-right font-bold text-gray-800">Year to Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Payments Section */}
            <tr className="bg-blue-50">
              <td colSpan={3} className="border border-gray-400 px-4 py-2 font-bold text-blue-800">PAYMENTS</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2 text-gray-700">Basic Salary</td>
              <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{payslipData.grossPay.toFixed(2)}</td>
              <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{ytdValues.grossPay.toFixed(2)}</td>
            </tr>
            <tr className="bg-gray-50 font-semibold">
              <td className="border border-gray-400 px-4 py-2 text-gray-800">Total Gross Pay</td>
              <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{payslipData.grossPay.toFixed(2)}</td>
              <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{ytdValues.grossPay.toFixed(2)}</td>
            </tr>

            {/* Deductions Section */}
            <tr className="bg-red-50">
              <td colSpan={3} className="border border-gray-400 px-4 py-2 font-bold text-red-800">DEDUCTIONS</td>
            </tr>
            {payslipData.deductions.map((deduction: any) => (
              <tr key={deduction.id}>
                <td className="border border-gray-400 px-4 py-2 text-gray-700">{deduction.name}</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{deduction.amount.toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{(deduction.amount * (ytdValues.grossPay / payslipData.grossPay)).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="border border-gray-400 px-4 py-2 text-gray-800">Total Deductions</td>
              <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{totalDeductions.toFixed(2)}</td>
              <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{ytdValues.totalDeductions.toFixed(2)}</td>
            </tr>

            {/* Net Pay */}
            <tr className="bg-green-50 border-t-2 border-green-600">
              <td className="border border-gray-400 px-4 py-3 font-bold text-green-800 text-lg">NET PAY</td>
              <td className="border border-gray-400 px-4 py-3 text-right font-bold text-green-900 text-lg">{currency}{netPay.toFixed(2)}</td>
              <td className="border border-gray-400 px-4 py-3 text-right font-bold text-green-900 text-lg">{currency}{ytdValues.netPay.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Method and Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <h4 className="font-bold text-gray-800 border-b border-gray-300 pb-1">Payment Method</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">Method:</span>
              <span className="text-gray-900">Bank Transfer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Date Paid:</span>
              <span className="text-gray-900">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800 border-b border-gray-300 pb-1">Additional Information</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">Employer Pension:</span>
              <span className="text-gray-900">{currency}{(payslipData.grossPay * 0.03).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
