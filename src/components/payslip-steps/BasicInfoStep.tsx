
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface BasicInfoStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const BasicInfoStep = ({ payslipData, setPayslipData, isParentMode, selectedChild }: BasicInfoStepProps) => {
  const fillExampleData = () => {
    setPayslipData({
      ...payslipData,
      name: selectedChild?.name || 'John Smith',
      period: '2025-01',
      grossPay: 5000
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with the basics for your payslip</p>
      </div>

      <Button
        variant="outline"
        onClick={fillExampleData}
        className="w-full mb-6 border-green-200 text-green-700 hover:bg-green-50"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Fill Example Data
      </Button>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Employee Name
          </Label>
          <Input
            id="name"
            value={payslipData.name}
            onChange={(e) => setPayslipData({ ...payslipData, name: e.target.value })}
            placeholder="Enter full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="period" className="text-sm font-medium text-gray-700">
            Pay Period
          </Label>
          <Input
            id="period"
            type="month"
            value={payslipData.period}
            onChange={(e) => setPayslipData({ ...payslipData, period: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="grossPay" className="text-sm font-medium text-gray-700">
            Gross Pay ($)
          </Label>
          <Input
            id="grossPay"
            type="number"
            value={payslipData.grossPay || ''}
            onChange={(e) => setPayslipData({ ...payslipData, grossPay: parseFloat(e.target.value) || 0 })}
            placeholder="5000"
            className="mt-1"
          />
        </div>
      </div>

      {isParentMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-green-800 mb-2">💡 Learning Moment</h3>
          <p className="text-sm text-green-700">
            Gross pay is the total amount earned before any deductions. It's like getting your full allowance before buying anything!
          </p>
        </div>
      )}
    </div>
  );
};
