import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfoFieldsProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  onFieldChange: (field: string, value: string) => void;
}

export const PersonalInfoFields = ({
  name,
  email,
  phone,
  address,
  onFieldChange
}: PersonalInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="Employee full name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="employee@company.com"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          placeholder="+44 7123 456789"
        />
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          placeholder="Full address"
          rows={2}
        />
      </div>
    </>
  );
};