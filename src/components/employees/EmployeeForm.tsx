
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
      };

      if (employee?.id) {
        // Update existing employee
        const { error } = await supabase
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
        const { error } = await supabase
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
