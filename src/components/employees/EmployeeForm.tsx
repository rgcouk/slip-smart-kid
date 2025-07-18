
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PersonalInfoFields } from './form/PersonalInfoFields';
import { EmploymentInfoFields } from './form/EmploymentInfoFields';
import { TaxInfoFields } from './form/TaxInfoFields';
import { NotesField } from './form/NotesField';

interface Employee {
  id?: string;
  name: string;
  payroll_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  default_gross_salary?: number;
  notes?: string;
  tax_code?: string;
  ni_number?: string;
  tax_allowance?: number;
  ni_category?: string;
  student_loan_plan?: string;
  pension_scheme_reference?: string;
  starter_declaration?: 'A' | 'B' | 'C';
}

interface EmployeeFormProps {
  employee?: Employee;
  onSave: () => void;
  onCancel: () => void;
}

export const EmployeeForm = ({ employee, onSave, onCancel }: EmployeeFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Employee>({
    name: employee?.name || '',
    payroll_number: employee?.payroll_number || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    default_gross_salary: employee?.default_gross_salary || undefined,
    notes: employee?.notes || '',
    tax_code: employee?.tax_code || '',
    ni_number: employee?.ni_number || '',
    tax_allowance: employee?.tax_allowance || 12570,
    ni_category: employee?.ni_category || 'A',
    student_loan_plan: employee?.student_loan_plan || undefined,
    pension_scheme_reference: employee?.pension_scheme_reference || undefined,
    starter_declaration: employee?.starter_declaration || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save employees",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Employee name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const employeeData = {
        user_id: user.id,
        name: formData.name.trim(),
        payroll_number: formData.payroll_number?.trim() || null,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null,
        default_gross_salary: formData.default_gross_salary || null,
        notes: formData.notes?.trim() || null,
        tax_code: formData.tax_code?.trim() || null,
        ni_number: formData.ni_number?.trim() || null,
        tax_allowance: formData.tax_allowance || null,
        ni_category: formData.ni_category || 'A',
        student_loan_plan: formData.student_loan_plan?.trim() || null,
        pension_scheme_reference: formData.pension_scheme_reference?.trim() || null,
        starter_declaration: formData.starter_declaration || null,
      };

      if (employee?.id) {
        // Update existing employee
        const { error } = await (supabase as any)
          .from('employees')
          .update(employeeData)
          .eq('id', employee.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        // Create new employee
        const { error } = await (supabase as any)
          .from('employees')
          .insert([employeeData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee created successfully",
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string | number | undefined | 'A' | 'B' | 'C') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PersonalInfoFields
              name={formData.name}
              email={formData.email || ''}
              phone={formData.phone || ''}
              address={formData.address || ''}
              onFieldChange={handleFieldChange}
            />
            
            <EmploymentInfoFields
              payrollNumber={formData.payroll_number || ''}
              defaultGrossSalary={formData.default_gross_salary}
              onFieldChange={handleFieldChange}
            />
            
            <TaxInfoFields
              taxCode={formData.tax_code || ''}
              niNumber={formData.ni_number || ''}
              taxAllowance={formData.tax_allowance}
              niCategory={formData.ni_category || 'A'}
              studentLoanPlan={formData.student_loan_plan}
              pensionSchemeReference={formData.pension_scheme_reference}
              starterDeclaration={formData.starter_declaration}
              onFieldChange={handleFieldChange}
            />
          </div>
          
          <NotesField
            notes={formData.notes || ''}
            onFieldChange={handleFieldChange}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
