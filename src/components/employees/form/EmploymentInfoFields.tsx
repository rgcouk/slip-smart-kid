import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmploymentInfoFieldsProps {
  payrollNumber: string;
  defaultGrossSalary?: number;
  onFieldChange: (field: string, value: string | number | undefined) => void;
}

export const EmploymentInfoFields = ({
  payrollNumber,
  defaultGrossSalary,
  onFieldChange
}: EmploymentInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="payroll_number">Payroll Number</Label>
        <Input
          id="payroll_number"
          value={payrollNumber}
          onChange={(e) => onFieldChange('payroll_number', e.target.value)}
          placeholder="EMP001234"
        />
      </div>
      
      <div>
        <Label htmlFor="default_gross_salary">Default Gross Salary</Label>
        <Input
          id="default_gross_salary"
          type="number"
          step="0.01"
          min="0"
          value={defaultGrossSalary || ''}
          onChange={(e) => onFieldChange('default_gross_salary', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="3000.00"
        />
      </div>
    </>
  );
};