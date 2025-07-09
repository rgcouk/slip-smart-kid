import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmployeeActions } from './EmployeeActions';

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

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable = ({ employees, onEdit, onDelete }: EmployeeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Payroll Number</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tax Code</TableHead>
          <TableHead>Default Salary</TableHead>
          <TableHead>Payslips</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.name}</TableCell>
            <TableCell>{employee.payroll_number || '-'}</TableCell>
            <TableCell>{employee.email || '-'}</TableCell>
            <TableCell>{employee.tax_code || '-'}</TableCell>
            <TableCell>
              {employee.default_gross_salary 
                ? `£${employee.default_gross_salary.toFixed(2)}` 
                : '-'
              }
            </TableCell>
            <TableCell>{employee.payslip_count || 0}</TableCell>
            <TableCell>
              <EmployeeActions 
                employee={employee} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};