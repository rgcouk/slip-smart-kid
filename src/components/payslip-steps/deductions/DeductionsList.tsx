
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Deduction } from './types';

interface DeductionsListProps {
  deductions: Deduction[];
  currencySymbol: string;
  onRemoveDeduction: (id: string) => void;
}

export const DeductionsList = ({ deductions, currencySymbol, onRemoveDeduction }: DeductionsListProps) => {
  if (deductions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Current Deductions</h3>
      {deductions.map((deduction) => (
        <div key={deduction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium text-gray-900">{deduction.name}</span>
            <div className="text-sm text-gray-500">
              {deduction.type === 'percentage' ? `${deduction.value}%` : `${currencySymbol}${deduction.value}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-red-600">-{currencySymbol}{deduction.amount.toFixed(2)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveDeduction(deduction.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
