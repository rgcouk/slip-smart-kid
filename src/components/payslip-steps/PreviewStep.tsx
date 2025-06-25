
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Edit, Save } from 'lucide-react';

interface PreviewStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const PreviewStep = ({ payslipData, isParentMode, selectedChild }: PreviewStepProps) => {
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const netPay = payslipData.grossPay - totalDeductions;

  const formatPeriod = (period: string) => {
    if (!period) return '';
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payslip Preview</h2>
        <p className="text-gray-600">Review your payslip before saving</p>
      </div>

      {/* Payslip Preview */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">PAYSLIP</h1>
          <p className="text-gray-600 mt-1">Pay Period: {formatPeriod(payslipData.period)}</p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{payslipData.companyName}</span>
              </div>
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

          {/* Payments */}
          <div className="border border-gray-200 rounded">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Payments</h3>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Pay</span>
                <span className="font-medium">£{payslipData.grossPay.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>£{payslipData.grossPay.toFixed(2)}</span>
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
                      <span className="font-medium">£{deduction.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>£{totalDeductions.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">No deductions</div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* This Month */}
          <div className="border border-gray-200 rounded">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">This Month</h3>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Pay</span>
                <span className="font-medium">£{payslipData.grossPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deductions</span>
                <span className="font-medium">£{totalDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Net Payment */}
          <div className="border border-gray-200 rounded">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Payment</h3>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">£{netPay.toFixed(2)}</div>
              <div className="text-sm text-gray-500 mt-1">Net Pay</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
          Generated by SlipSim • {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Future Action Buttons (for later implementation) */}
      <div className="space-y-3 opacity-50">
        <Button disabled className="w-full bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Download PDF (Coming Soon)
        </Button>
        
        <Button disabled variant="outline" className="w-full">
          <Mail className="h-4 w-4 mr-2" />
          Email Payslip (Coming Soon)
        </Button>
      </div>

      {isParentMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">🎉 Great Job!</h3>
          <p className="text-sm text-green-700">
            You've created a professional payslip! This shows how money flows from what you earn 
            to what you actually take home. Understanding this helps with budgeting and financial planning.
          </p>
        </div>
      )}
    </div>
  );
};
