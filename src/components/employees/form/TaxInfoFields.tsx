import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaxInfoFieldsProps {
  taxCode: string;
  niNumber: string;
  taxAllowance?: number;
  niCategory: string;
  studentLoanPlan?: string;
  pensionSchemeReference?: string;
  starterDeclaration?: 'A' | 'B' | 'C';
  onFieldChange: (field: string, value: string | number | 'A' | 'B' | 'C' | undefined) => void;
}

export const TaxInfoFields = ({
  taxCode,
  niNumber,
  taxAllowance,
  niCategory,
  studentLoanPlan,
  pensionSchemeReference,
  starterDeclaration,
  onFieldChange
}: TaxInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="tax_code">Tax Code</Label>
        <Input
          id="tax_code"
          value={taxCode}
          onChange={(e) => onFieldChange('tax_code', e.target.value)}
          placeholder="1257L"
        />
      </div>
      
      <div>
        <Label htmlFor="ni_number">National Insurance Number</Label>
        <Input
          id="ni_number"
          value={niNumber}
          onChange={(e) => onFieldChange('ni_number', e.target.value)}
          placeholder="AB123456C"
        />
      </div>
      
      <div>
        <Label htmlFor="tax_allowance">Tax Allowance</Label>
        <Input
          id="tax_allowance"
          type="number"
          step="0.01"
          min="0"
          value={taxAllowance || ''}
          onChange={(e) => onFieldChange('tax_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="12570.00"
        />
      </div>
      
      <div>
        <Label htmlFor="ni_category">NI Category</Label>
        <Select 
          value={niCategory} 
          onValueChange={(value) => onFieldChange('ni_category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select NI category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A - Standard rate</SelectItem>
            <SelectItem value="B">B - Married women/widows (reduced rate)</SelectItem>
            <SelectItem value="C">C - Over state pension age</SelectItem>
            <SelectItem value="H">H - Apprentice under 25</SelectItem>
            <SelectItem value="J">J - No liability to pay</SelectItem>
            <SelectItem value="L">L - Deferred payment</SelectItem>
            <SelectItem value="M">M - Under 21</SelectItem>
            <SelectItem value="S">S - Contracted-out salary related</SelectItem>
            <SelectItem value="X">X - No National Insurance</SelectItem>
            <SelectItem value="Z">Z - No liability</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="student_loan_plan">Student Loan Plan</Label>
        <Select 
          value={studentLoanPlan || 'none'} 
          onValueChange={(value) => onFieldChange('student_loan_plan', value === 'none' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan (if applicable)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="Plan1">Plan 1 (Before Sept 2012)</SelectItem>
            <SelectItem value="Plan2">Plan 2 (Sept 2012 onwards)</SelectItem>
            <SelectItem value="Plan4">Plan 4 (Scotland)</SelectItem>
            <SelectItem value="Postgraduate">Postgraduate Loan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="pension_scheme_reference">Pension Scheme Reference</Label>
        <Input
          id="pension_scheme_reference"
          value={pensionSchemeReference || ''}
          onChange={(e) => onFieldChange('pension_scheme_reference', e.target.value)}
          placeholder="Enter pension scheme ref"
        />
      </div>
      
      <div>
        <Label htmlFor="starter_declaration">Starter Declaration</Label>
        <Select 
          value={starterDeclaration} 
          onValueChange={(value: 'A' | 'B' | 'C') => onFieldChange('starter_declaration', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select declaration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A - First job since last 6 April</SelectItem>
            <SelectItem value="B">B - Second job or pension</SelectItem>
            <SelectItem value="C">C - Receives benefits/pension from previous job</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};