
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmployeeSelector } from '@/components/employees/EmployeeSelector';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { PaymentEntriesSection } from './PaymentEntriesSection';
import { PayslipData } from '@/types/payslip';

interface BasicInfoStepProps {
  payslipData: PayslipData;
  setPayslipData: (data: PayslipData | ((prev: PayslipData) => PayslipData)) => void;
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
    setPayslipData(prev => ({
      ...prev,
      name: employee.name,
      employeeName: employee.name,
      payrollNumber: employee.payroll_number || '',
      selectedEmployeeId: employee.id,
      paymentEntries: [{
        id: '1',
        description: 'Basic Salary',
        type: 'fixed',
        amount: employee.default_gross_salary || 0
      }]
    }));
  };

  const handleCreateNewEmployee = () => {
    setShowEmployeeForm(true);
  };

  const handleEmployeeFormSave = () => {
    setShowEmployeeForm(false);
  };

  const handleEmployeeFormCancel = () => {
    setShowEmployeeForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Information</h2>
        <p className="text-gray-600">Enter employee details and payment information</p>
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
              value={payslipData.name || ''}
              onChange={(e) => setPayslipData(prev => ({ 
                ...prev, 
                name: e.target.value,
                employeeName: e.target.value 
              }))}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div>
            <Label htmlFor="payrollNumber">Payroll Number</Label>
            <Input
              id="payrollNumber"
              value={payslipData.payrollNumber || ''}
              onChange={(e) => setPayslipData(prev => ({ ...prev, payrollNumber: e.target.value }))}
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
              onChange={(e) => setPayslipData(prev => ({ ...prev, payPeriodStart: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="payPeriodEnd">Pay Period End *</Label>
            <Input
              id="payPeriodEnd"
              type="date"
              value={payslipData.payPeriodEnd || ''}
              onChange={(e) => setPayslipData(prev => ({ ...prev, payPeriodEnd: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contractualHours">Contractual Hours/Week</Label>
            <Input
              id="contractualHours"
              type="number"
              step="0.5"
              min="0"
              value={payslipData.contractualHours || ''}
              onChange={(e) => setPayslipData(prev => ({ ...prev, contractualHours: parseFloat(e.target.value) || 0 }))}
              placeholder="40"
            />
          </div>

          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (£)</Label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              value={payslipData.hourlyRate || ''}
              onChange={(e) => setPayslipData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
              placeholder="15.00"
            />
          </div>
        </div>

        {/* Payment Entries Section */}
        <PaymentEntriesSection 
          paymentEntries={payslipData.paymentEntries}
          onEntriesChange={(entries) => setPayslipData(prev => ({ ...prev, paymentEntries: entries }))}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">Total Gross Pay:</span>
            <span className="text-lg font-bold text-blue-900">
              £{payslipData.grossPay.toFixed(2)}
            </span>
          </div>
        </div>

        {isParentMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium mb-2">💡 Learning Moment</h3>
            <p className="text-blue-700 text-sm">
              A payslip shows different types of payments like basic salary, overtime, and bonuses. 
              The "gross pay" is the total amount before any deductions (like taxes) are taken out.
              Payment entries help break down exactly what someone earned during the pay period.
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
