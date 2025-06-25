
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Percent } from 'lucide-react';
import { DeductionFormData } from './types';

interface CustomDeductionFormProps {
  newDeduction: DeductionFormData;
  setNewDeduction: (deduction: DeductionFormData) => void;
  onAddDeduction: () => void;
  locale: string;
  currencySymbol: string;
}

export const CustomDeductionForm = ({ 
  newDeduction, 
  setNewDeduction, 
  onAddDeduction, 
  locale, 
  currencySymbol 
}: CustomDeductionFormProps) => {
  return (
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
            <span className="text-sm">{currencySymbol}</span>
          </div>
        </div>

        <div>
          <Label htmlFor="deductionValue">
            {newDeduction.type === 'percentage' ? 'Percentage (%)' : `Fixed Amount (${currencySymbol})`}
          </Label>
          <Input
            id="deductionValue"
            type="number"
            value={newDeduction.value || ''}
            onChange={(e) => setNewDeduction({ ...newDeduction, value: parseFloat(e.target.value) || 0 })}
            placeholder={newDeduction.type === 'percentage' ? '10' : '250'}
          />
        </div>

        <Button onClick={onAddDeduction} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Deduction
        </Button>
      </div>
    </div>
  );
};
