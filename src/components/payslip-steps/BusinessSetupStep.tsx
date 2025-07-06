import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, Building2, User, Info } from 'lucide-react';
import { EmployeeSelector } from '@/components/employees/EmployeeSelector';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { PayslipData } from '@/types/payslip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
interface BusinessSetupStepProps {
  payslipData: PayslipData;
  setPayslipData: (data: PayslipData | ((prev: PayslipData) => PayslipData)) => void;
  isParentMode: boolean;
}
interface Employee {
  id: string;
  name: string;
  payroll_number?: string;
  email?: string;
  default_gross_salary?: number;
}
export const BusinessSetupStep = ({
  payslipData,
  setPayslipData,
  isParentMode
}: BusinessSetupStepProps) => {
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
  return <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Setup</h2>
        <p className="text-gray-600">Configure your company and employee information</p>
      </div>

      <div className="space-y-4">
        {/* Company Details Section */}
        <Collapsible open={companyExpanded} onOpenChange={setCompanyExpanded}>
          <CollapsibleTrigger className="w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${companyExpanded ? 'rotate-180' : ''}`} />
              </div>
              {!companyExpanded && payslipData.companyName && <div className="mt-2 text-sm text-gray-600">
                  {payslipData.companyName}
                </div>}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-2 shadow-sm space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" value={payslipData.companyName || ''} onChange={e => setPayslipData(prev => ({
                ...prev,
                companyName: e.target.value
              }))} placeholder="Enter company name" required className="h-10 rounded-br-sm " />
              </div>

              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input id="companyAddress" value={payslipData.companyAddress || ''} onChange={e => setPayslipData(prev => ({
                ...prev,
                companyAddress: e.target.value
              }))} placeholder="123 Business Street, City, State" className="h-10 rounded-lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input id="companyPhone" value={payslipData.companyPhone || ''} onChange={e => setPayslipData(prev => ({
                  ...prev,
                  companyPhone: e.target.value
                }))} placeholder="+1 (555) 123-4567" className="h-10 rounded-lg" />
                </div>

                <div>
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input id="companyEmail" type="email" value={payslipData.companyEmail || ''} onChange={e => setPayslipData(prev => ({
                  ...prev,
                  companyEmail: e.target.value
                }))} placeholder="hr@company.com" className="h-10 rounded-lg" />
                </div>
              </div>

              <div>
                <Label htmlFor="companyRegistration">Registration Number</Label>
                <Input id="companyRegistration" value={payslipData.companyRegistration || ''} onChange={e => setPayslipData(prev => ({
                ...prev,
                companyRegistration: e.target.value
              }))} placeholder="REG123456789" className="h-10 rounded-lg" />
              </div>

              {/* Template Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Payslip Template</Label>
                <RadioGroup value={payslipData.template || 'default'} onValueChange={(value: 'default' | 'professional') => setPayslipData(prev => ({
                ...prev,
                template: value
              }))}>
                  <div className="flex items-center space-x-2 min-h-[48px]">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default" className="cursor-pointer">Default Template</Label>
                  </div>
                  <div className="flex items-center space-x-2 min-h-[48px]">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional" className="cursor-pointer">Professional Template</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Employee Details Section */}
        <Collapsible open={employeeExpanded} onOpenChange={setEmployeeExpanded}>
          <CollapsibleTrigger className="w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${employeeExpanded ? 'rotate-180' : ''}`} />
              </div>
              {!employeeExpanded && payslipData.name && <div className="mt-2 text-sm text-gray-600">
                  {payslipData.name} {payslipData.payrollNumber && `(${payslipData.payrollNumber})`}
                </div>}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-2 shadow-sm space-y-4">
              <div className="space-y-2">
                <Label>Select Employee</Label>
                <EmployeeSelector onSelect={handleEmployeeSelect} onCreateNew={handleCreateNewEmployee} />
                <p className="text-sm text-gray-500">
                  Select from saved employees or add details manually below
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeName">Employee Name *</Label>
                  <Input id="employeeName" value={payslipData.name || ''} onChange={e => setPayslipData(prev => ({
                  ...prev,
                  name: e.target.value,
                  employeeName: e.target.value
                }))} placeholder="Enter employee name" className="h-10 rounded-lg" required />
                </div>

                <div>
                  <Label htmlFor="payrollNumber">Payroll Number</Label>
                  <Input id="payrollNumber" value={payslipData.payrollNumber || ''} onChange={e => setPayslipData(prev => ({
                  ...prev,
                  payrollNumber: e.target.value
                }))} placeholder="EMP001234" className="h-10 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractualHours">Contractual Hours/Week</Label>
                  <Input id="contractualHours" type="number" step="0.5" min="0" value={payslipData.contractualHours || ''} onChange={e => setPayslipData(prev => ({
                  ...prev,
                  contractualHours: parseFloat(e.target.value) || 0
                }))} placeholder="40" className="h-10 rounded-lg" />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (£)</Label>
                  <Input id="hourlyRate" type="number" step="0.01" min="0" value={payslipData.hourlyRate || ''} onChange={e => setPayslipData(prev => ({
                  ...prev,
                  hourlyRate: parseFloat(e.target.value) || 0
                }))} placeholder="15.00" className="h-10 rounded-lg" />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Learning Moment */}
        {isParentMode && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-blue-800 font-medium mb-2">💡 Learning Moment</h3>
            <p className="text-blue-700 text-sm">
              Every payslip needs both company and employee information. The company details show who is paying, 
              and the employee details show who is being paid. The payroll number helps companies keep track of 
              different employees, and contractual hours show how many hours someone is expected to work each week.
            </p>
          </div>}
      </div>

      {/* Employee Form Dialog */}
      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm onSave={handleEmployeeFormSave} onCancel={handleEmployeeFormCancel} />
        </DialogContent>
      </Dialog>
    </div>;
};