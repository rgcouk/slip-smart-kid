import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const EmployeeSearch = ({ searchTerm, onSearchChange }: EmployeeSearchProps) => {
  return (
    <div className="relative mb-4">
      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
      <Input
        placeholder="Search by name, email, or payroll number..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};