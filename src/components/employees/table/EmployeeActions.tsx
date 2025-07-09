import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  payroll_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  default_gross_salary?: number;
  notes?: string;
  tax_code?: string;
  ni_number?: string;
  starter_declaration?: 'A' | 'B' | 'C';
  created_at: string;
  payslip_count?: number;
}

interface EmployeeActionsProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeActions = ({ employee, onEdit, onDelete }: EmployeeActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(employee)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(employee)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};