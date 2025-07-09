
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Employee full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="payroll_number">Payroll Number</Label>
              <Input
                id="payroll_number"
                value={formData.payroll_number}
                onChange={(e) => setFormData(prev => ({ ...prev, payroll_number: e.target.value }))}
                placeholder="EMP001234"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="employee@company.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+44 7123 456789"
              />
            </div>
            
            <div>
              <Label htmlFor="default_gross_salary">Default Gross Salary</Label>
              <Input
                id="default_gross_salary"
                type="number"
                step="0.01"
                min="0"
                value={formData.default_gross_salary || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  default_gross_salary: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="3000.00"
              />
            </div>
            
            <div>
              <Label htmlFor="tax_code">Tax Code</Label>
              <Input
                id="tax_code"
                value={formData.tax_code}
                onChange={(e) => setFormData(prev => ({ ...prev, tax_code: e.target.value }))}
                placeholder="1257L"
              />
            </div>
            
            <div>
              <Label htmlFor="ni_number">National Insurance Number</Label>
              <Input
                id="ni_number"
                value={formData.ni_number}
                onChange={(e) => setFormData(prev => ({ ...prev, ni_number: e.target.value }))}
                placeholder="AB123456C"
              />
            </div>
            
            <div>
              <Label htmlFor="starter_declaration">Starter Declaration</Label>
              <Select 
                value={formData.starter_declaration} 
                onValueChange={(value: 'A' | 'B' | 'C') => setFormData(prev => ({ ...prev, starter_declaration: value }))}
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
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Full address"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this employee"
              rows={3}
            />
          </div>

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
