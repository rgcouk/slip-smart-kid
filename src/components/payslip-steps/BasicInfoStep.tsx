
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmployeeSelector } from '@/components/employees/EmployeeSelector';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

interface BasicInfoStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild?: any;
}

interface Employee {
  id: string;
  name: string;
  payroll_number?: string;
  email?: string;
  default_gross_salary?: number;
}

export const BasicInfoStep = ({ payslipData, setPayslipData, isParentMode }: BasicInfoStepProps) => {
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const handleEmployeeSelect = (employee: Employee) => {
    setPayslipData({
      ...payslipData,
      employeeName: employee.name,
      payrollNumber: employee.payroll_number || '',
      grossPay: employee.default_gross_salary || payslipData.grossPay || 0,
      selectedEmployeeId: employee.id
    });
  };

  const handleCreateNewEmployee = () => {
    setShowEmployeeForm(true);
  };

  const handleEmployeeFormSave = () => {
    setShowEmployeeForm(false);
    // The employee form will handle the save, we just close the dialog
  };

  const handleEmployeeFormCancel = () => {
    setShowEmployeeForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Information</h2>
        <p className="text-gray-600">Enter employee details for this payslip</p>
      </div>

      <div className="space-y-4">
        {/* Employee Selection */}
        <div className="space-y-2">
          <Label>Select Employee</Label>
          <EmployeeSelector
            onSelect={handleEmployeeSelect}
            onCreateNew={handleCreateNewEmployee}
          />
          <p className="text-sm text-gray-500">
            Select from saved employees or add details manually below
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeName">Employee Name *</Label>
            <Input
              id="employeeName"
              value={payslipData.employeeName || ''}
              onChange={(e) => setPayslipData({ ...payslipData, employeeName: e.target.value })}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div>
            <Label htmlFor="payrollNumber">Payroll Number</Label>
            <Input
              id="payrollNumber"
              value={payslipData.payrollNumber || ''}
              onChange={(e) => setPayslipData({ ...payslipData, payrollNumber: e.target.value })}
              placeholder="EMP001234"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payPeriodStart">Pay Period Start *</Label>
            <Input
              id="payPeriodStart"
              type="date"
              value={payslipData.payPeriodStart || ''}
              onChange={(e) => setPayslipData({ ...payslipData, payPeriodStart: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="payPeriodEnd">Pay Period End *</Label>
            <Input
              id="payPeriodEnd"
              type="date"
              value={payslipData.payPeriodEnd || ''}
              onChange={(e) => setPayslipData({ ...payslipData, payPeriodEnd: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="grossPay">Gross Pay *</Label>
          <Input
            id="grossPay"
            type="number"
            step="0.01"
            min="0"
            value={payslipData.grossPay || ''}
            onChange={(e) => setPayslipData({ ...payslipData, grossPay: parseFloat(e.target.value) || 0 })}
            placeholder="3000.00"
            required
          />
        </div>

        {isParentMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium mb-2">💡 Learning Moment</h3>
            <p className="text-blue-700 text-sm">
              A payslip shows how much money someone earned during a specific time period. 
              The "pay period" is the time when the work was done, and "gross pay" is the total amount 
              before any deductions (like taxes) are taken out.
            </p>
          </div>
        )}
      </div>

      {/* Employee Form Dialog */}
      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSave={handleEmployeeFormSave}
            onCancel={handleEmployeeFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
