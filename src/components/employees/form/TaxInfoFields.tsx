import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaxInfoFieldsProps {
  taxCode: string;
  niNumber: string;
  starterDeclaration?: 'A' | 'B' | 'C';
  onFieldChange: (field: string, value: string | 'A' | 'B' | 'C' | undefined) => void;
}

export const TaxInfoFields = ({
  taxCode,
  niNumber,
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