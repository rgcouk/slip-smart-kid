
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, Plus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  payroll_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  default_gross_salary?: number;
  tax_code?: string;
  ni_number?: string;
  tax_allowance?: number;
  ni_category?: string;
  student_loan_plan?: string;
  pension_scheme_reference?: string;
  starter_declaration?: 'A' | 'B' | 'C';
  notes?: string;
}

interface EmployeeSelectorProps {
  onSelect: (employee: Employee) => void;
  onCreateNew: () => void;
}

export const EmployeeSelector = ({ onSelect, onCreateNew }: EmployeeSelectorProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
      setFilteredEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.payroll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const handleSelectEmployee = (employee: Employee) => {
    onSelect(employee);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCreateNew = () => {
    onCreateNew();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Users className="h-4 w-4 mr-2" />
        Select from Employees
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Employee</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading employees...
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectEmployee(employee)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{employee.name}</h3>
                          {employee.payroll_number && (
                            <p className="text-sm text-gray-600">
                              Payroll: {employee.payroll_number}
                            </p>
                          )}
                          {employee.email && (
                            <p className="text-sm text-gray-600">{employee.email}</p>
                          )}
                        </div>
                        {employee.default_gross_salary && (
                          <div className="text-sm text-gray-600">
                            Default: £{employee.default_gross_salary.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="border-t pt-4">
              <Button
                onClick={handleCreateNew}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Employee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
