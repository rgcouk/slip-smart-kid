
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Percent, DollarSign } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

interface DeductionsStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
}

export const DeductionsStep = ({ payslipData, setPayslipData, isParentMode }: DeductionsStepProps) => {
  const { locale, config } = useLocale();
  const [newDeduction, setNewDeduction] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0
  });

  const calculateDeductionAmount = (deduction: any) => {
    if (deduction.type === 'percentage') {
      return (payslipData.grossPay * deduction.value) / 100;
    }
    return deduction.value;
  };

  const addDeduction = () => {
    if (newDeduction.name && newDeduction.value > 0) {
      const deduction = {
        id: Date.now().toString(),
        ...newDeduction,
        amount: calculateDeductionAmount(newDeduction)
      };

      setPayslipData({
        ...payslipData,
        deductions: [...payslipData.deductions, deduction]
      });

      setNewDeduction({ name: '', type: 'percentage', value: 0 });
    }
  };

  const removeDeduction = (id: string) => {
    setPayslipData({
      ...payslipData,
      deductions: payslipData.deductions.filter((d: any) => d.id !== id)
    });
  };

  const addCommonDeduction = (name: string, type: 'percentage' | 'fixed', value: number) => {
    const deduction = {
      id: Date.now().toString(),
      name,
      type,
      value,
      amount: type === 'percentage' ? (payslipData.grossPay * value) / 100 : value
    };

    setPayslipData({
      ...payslipData,
      deductions: [...payslipData.deductions, deduction]
    });
  };

  // UK-specific common deductions
  const ukDeductions = [
    { name: 'Income Tax', value: 20, type: 'percentage' as const },
    { name: 'National Insurance', value: 12, type: 'percentage' as const },
    { name: 'Pension', value: 5, type: 'percentage' as const },
    { name: 'Student Loan', value: 9, type: 'percentage' as const }
  ];

  // US-specific common deductions
  const usDeductions = [
    { name: 'Federal Tax', value: 22, type: 'percentage' as const },
    { name: 'State Tax', value: 5, type: 'percentage' as const },
    { name: 'Social Security', value: 6.2, type: 'percentage' as const },
    { name: 'Medicare', value: 1.45, type: 'percentage' as const }
  ];

  const commonDeductions = locale === 'UK' ? ukDeductions : usDeductions;

  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const netPay = payslipData.grossPay - totalDeductions;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Deductions</h2>
        <p className="text-gray-600">Add taxes, insurance, and other deductions</p>
      </div>

      {/* Quick Add Common Deductions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-3">
          Quick Add Common {locale === 'UK' ? 'UK' : 'US'} Deductions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {commonDeductions.map((deduction, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => addCommonDeduction(deduction.name, deduction.type, deduction.value)}
              className="text-xs"
            >
              {deduction.name} ({deduction.value}%)
            </Button>
          ))}
        </div>
      </div>

      {/* Add Custom Deduction */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Add Custom Deduction</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="deductionName">Deduction Name</Label>
            <Input
              id="deductionName"
              value={newDeduction.name}
              onChange={(e) => setNewDeduction({ ...newDeduction, name: e.target.value })}
              placeholder={locale === 'UK' ? 'e.g., Private Health Insurance' : 'e.g., Health Insurance'}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Type</Label>
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-gray-500" />
              <Switch
                checked={newDeduction.type === 'fixed'}
                onCheckedChange={(checked) => 
                  setNewDeduction({ ...newDeduction, type: checked ? 'fixed' : 'percentage' })
                }
              />
              <span className="text-sm">{config.currency}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="deductionValue">
              {newDeduction.type === 'percentage' ? 'Percentage (%)' : `Fixed Amount (${config.currency})`}
            </Label>
            <Input
              id="deductionValue"
              type="number"
              value={newDeduction.value || ''}
              onChange={(e) => setNewDeduction({ ...newDeduction, value: parseFloat(e.target.value) || 0 })}
              placeholder={newDeduction.type === 'percentage' ? '10' : '250'}
            />
          </div>

          <Button onClick={addDeduction} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Deduction
          </Button>
        </div>
      </div>

      {/* Current Deductions */}
      {payslipData.deductions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Current Deductions</h3>
          {payslipData.deductions.map((deduction: any) => (
            <div key={deduction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">{deduction.name}</span>
                <div className="text-sm text-gray-500">
                  {deduction.type === 'percentage' ? `${deduction.value}%` : `${config.currency}${deduction.value}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">-{config.currency}{deduction.amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDeduction(deduction.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calculation Preview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Gross Pay:</span>
            <span className="font-medium">{config.currency}{payslipData.grossPay.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total Deductions:</span>
            <span className="font-medium text-red-600">-{config.currency}{totalDeductions.toFixed(2)}</span>
          </div>
          <div className="border-t border-green-300 pt-2 flex justify-between">
            <span className="font-semibold text-green-800">Net Pay:</span>
            <span className="font-semibold text-green-800">{config.currency}{netPay.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {isParentMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">💡 Learning Moment</h3>
          <p className="text-sm text-green-700">
            {locale === 'UK' 
              ? "Deductions are amounts taken from your gross pay. In the UK, this includes Income Tax (for public services), National Insurance (for NHS and pensions), and optional things like pension contributions. What's left is your take-home pay!"
              : "Deductions are amounts taken out of your gross pay. Think of it like sharing your allowance - some goes to savings (like taxes for roads and schools), some for insurance (protection), and what's left is yours to keep!"
            }
          </p>
        </div>
      )}
    </div>
  );
};
