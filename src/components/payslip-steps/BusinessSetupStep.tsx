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
  tax_code?: string;
  ni_number?: string;
  tax_allowance?: number;
  ni_category?: string;
  student_loan_plan?: string;
  pension_scheme_reference?: string;
  starter_declaration?: 'A' | 'B' | 'C';
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
      taxCode: employee.tax_code || '',
      niNumber: employee.ni_number || '',
      taxAllowance: employee.tax_allowance || 12570,
      niCategory: employee.ni_category || 'A',
      studentLoanPlan: employee.student_loan_plan || undefined,
      pensionSchemeReference: employee.pension_scheme_reference || undefined,
      starterDeclaration: employee.starter_declaration || undefined,
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

      <Accordion type="multiple" defaultValue={["company", "employee"]} className="space-y-4">
        
        {/* Company Details Section */}
        <AccordionItem value="company" className="border-0">
          <Card className="border border-border shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-card-foreground">Company Details</h3>
                  {payslipData.companyName && (
                    <Badge variant="outline" className="mt-1 bg-primary/10 text-primary">
                      {payslipData.companyName}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-sm">The official name of your company as it appears on legal documents.</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input 
                    id="companyName" 
                    value={payslipData.companyName || ''} 
                    onChange={e => setPayslipData(prev => ({
                      ...prev,
                      companyName: e.target.value
                    }))} 
                    placeholder="Enter company name" 
                    required 
                    className="h-11 rounded-2xl border-border" 
                  />
                </div>

                <div>
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input 
                    id="companyAddress" 
                    value={payslipData.companyAddress || ''} 
                    onChange={e => setPayslipData(prev => ({
                      ...prev,
                      companyAddress: e.target.value
                    }))} 
                    placeholder="123 Business Street, City, State" 
                    className="h-11 rounded-2xl border-border" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyPhone">Phone Number</Label>
                    <Input 
                      id="companyPhone" 
                      value={payslipData.companyPhone || ''} 
                      onChange={e => setPayslipData(prev => ({
                        ...prev,
                        companyPhone: e.target.value
                      }))} 
                      placeholder="+1 (555) 123-4567" 
                      className="h-11 rounded-2xl border-border" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input 
                      id="companyEmail" 
                      type="email" 
                      value={payslipData.companyEmail || ''} 
                      onChange={e => setPayslipData(prev => ({
                        ...prev,
                        companyEmail: e.target.value
                      }))} 
                      placeholder="hr@company.com" 
                      className="h-11 rounded-2xl border-border" 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyRegistration">Registration Number</Label>
                  <Input 
                    id="companyRegistration" 
                    value={payslipData.companyRegistration || ''} 
                    onChange={e => setPayslipData(prev => ({
                      ...prev,
                      companyRegistration: e.target.value
                    }))} 
                    placeholder="REG123456789" 
                    className="h-11 rounded-2xl border-border" 
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Payslip Template</Label>
                  <RadioGroup 
                    value={payslipData.template || 'default'} 
                    onValueChange={(value: 'default' | 'professional') => setPayslipData(prev => ({
                      ...prev,
                      template: value
                    }))}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Card className="border border-border p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="default" id="default" />
                        <Label htmlFor="default" className="cursor-pointer font-medium">Default Template</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Clean and professional design</p>
                    </Card>
                    <Card className="border border-border p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="cursor-pointer font-medium">Professional Template</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Enhanced layout with company branding</p>
                    </Card>
                  </RadioGroup>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Employee Details Section */}
        <AccordionItem value="employee" className="border-0">
          <Card className="border border-border shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-card-foreground">Employee Details</h3>
                  {payslipData.name && (
                    <Badge variant="outline" className="mt-1 bg-secondary/10 text-secondary-foreground">
                      {payslipData.name} {payslipData.payrollNumber && `(${payslipData.payrollNumber})`}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Employee</Label>
                  <EmployeeSelector onSelect={handleEmployeeSelect} onCreateNew={handleCreateNewEmployee} />
                  <p className="text-sm text-muted-foreground">
                    Select from saved employees or add details manually below
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeName">Employee Name *</Label>
                    <Input 
                      id="employeeName" 
                      value={payslipData.name || ''} 
                      onChange={e => setPayslipData(prev => ({
                        ...prev,
                        name: e.target.value,
                        employeeName: e.target.value
                      }))} 
                      placeholder="Enter employee name" 
                      className="h-11 rounded-2xl border-border" 
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="payrollNumber">Payroll Number</Label>
                    <Input 
                      id="payrollNumber" 
                      value={payslipData.payrollNumber || ''} 
                      onChange={e => setPayslipData(prev => ({
                        ...prev,
                        payrollNumber: e.target.value
                      }))} 
                      placeholder="EMP001234" 
                      className="h-11 rounded-2xl border-border" 
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
                      onChange={e => setPayslipData(prev => ({
                        ...prev,
                        contractualHours: parseFloat(e.target.value) || 0
                      }))} 
                      placeholder="40" 
                      className="h-11 rounded-2xl border-border" 
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
                      onChange={e => setPayslipData(prev => ({
                        ...prev,
                        hourlyRate: parseFloat(e.target.value) || 0
                      }))} 
                      placeholder="15.00" 
                      className="h-11 rounded-2xl border-border" 
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

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