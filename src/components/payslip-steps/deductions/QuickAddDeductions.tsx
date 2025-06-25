
import React from 'react';
import { Button } from '@/components/ui/button';
import { CommonDeduction } from './types';

interface QuickAddDeductionsProps {
  commonDeductions: CommonDeduction[];
  locale: string;
  onAddDeduction: (name: string, type: 'percentage' | 'fixed', value: number) => void;
}

export const QuickAddDeductions = ({ commonDeductions, locale, onAddDeduction }: QuickAddDeductionsProps) => {
  return (
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
            onClick={() => onAddDeduction(deduction.name, deduction.type, deduction.value)}
            className="text-xs"
          >
            {deduction.name} ({deduction.value}%)
          </Button>
        ))}
      </div>
    </div>
  );
};
