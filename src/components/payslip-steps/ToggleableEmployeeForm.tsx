
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, User, Briefcase, Calculator, Info, Settings, RotateCcw } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PayslipData } from '@/types/payslip';
import { useEmployeeFormSettings } from '@/hooks/useEmployeeFormSettings';

interface ToggleableEmployeeFormProps {
  payslipData: PayslipData;
  setPayslipData: (data: PayslipData | ((prev: PayslipData) => PayslipData)) => void;
}

export const ToggleableEmployeeForm = ({ payslipData, setPayslipData }: ToggleableEmployeeFormProps) => {
  const { 
    sections, 
    presets, 
    toggleSection, 
    applyPreset, 
    resetToDefault, 
    getActivePreset, 
    getEnabledSectionsCount,
    getTotalSectionsCount 
  } = useEmployeeFormSettings();

  const [openSections, setOpenSections] = useState<string[]>(() => {
    // Auto-open enabled sections on mount
    return Object.entries(sections)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key);
  });

  // Auto-open section when it gets enabled
  React.useEffect(() => {
    Object.entries(sections).forEach(([key, enabled]) => {
      if (enabled && !openSections.includes(key)) {
        setOpenSections(current => [...current, key]);
      }
    });
  }, [sections, openSections]);

  const handleSectionToggle = (section: string) => {
    setOpenSections(current => 
      current.includes(section) 
        ? current.filter(s => s !== section)
        : [...current, section]
    );
  };

  const updateField = (field: string, value: any) => {
    setPayslipData(prev => ({ ...prev, [field]: value }));
  };

  const getCompletionStatus = (section: string) => {
    switch (section) {
      case 'personal':
        return payslipData.name ? 'complete' : 'incomplete';
      case 'employment':
        return payslipData.payrollNumber ? 'complete' : 'partial';
      case 'tax':
        return payslipData.taxCode && payslipData.niNumber ? 'complete' : 'incomplete';
      case 'additional':
        return payslipData.department ? 'partial' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Complete</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">Partial</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">Empty</Badge>;
    }
  };

  const activePreset = getActivePreset();

  return (
    <div className="space-y-4">
      {/* Quick Setup Presets */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Form Configuration
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {getEnabledSectionsCount()} of {getTotalSectionsCount()} sections enabled
              {activePreset && (
                <Badge variant="secondary" className="text-xs">
                  {activePreset.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset?.id === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => applyPreset(preset.id)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          
          {/* Individual Section Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(sections).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="capitalize text-sm font-medium">{key} Info</span>
                  {getStatusBadge(getCompletionStatus(key))}
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleSection(key as keyof typeof sections)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      {sections.personal && (
        <Collapsible 
          open={openSections.includes('personal')}
          onOpenChange={() => handleSectionToggle('personal')}
        >
          <Card className="border border-border">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-sm">Personal Information</CardTitle>
                      <p className="text-xs text-muted-foreground">Basic employee details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(getCompletionStatus('personal'))}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee-name">Employee Name *</Label>
                    <Input
                      id="employee-name"
                      value={payslipData.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="John Doe"
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee-email">Email Address</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      value={payslipData.employeeEmail || ''}
                      onChange={(e) => updateField('employeeEmail', e.target.value)}
                      placeholder="john.doe@company.com"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee-phone">Phone Number</Label>
                    <Input
                      id="employee-phone"
                      value={payslipData.employeePhone || ''}
                      onChange={(e) => updateField('employeePhone', e.target.value)}
                      placeholder="+44 7123 456789"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee-address">Address</Label>
                    <Textarea
                      id="employee-address"
                      value={payslipData.employeeAddress || ''}
                      onChange={(e) => updateField('employeeAddress', e.target.value)}
                      placeholder="123 Main Street, City, Postcode"
                      className="rounded-xl"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Employment Information Section */}
      {sections.employment && (
        <Collapsible 
          open={openSections.includes('employment')}
          onOpenChange={() => handleSectionToggle('employment')}
        >
          <Card className="border border-border">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-sm">Employment Information</CardTitle>
                      <p className="text-xs text-muted-foreground">Job details and work arrangements</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(getCompletionStatus('employment'))}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payroll-number">Payroll Number</Label>
                    <Input
                      id="payroll-number"
                      value={payslipData.payrollNumber || ''}
                      onChange={(e) => updateField('payrollNumber', e.target.value)}
                      placeholder="EMP001234"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={payslipData.department || ''}
                      onChange={(e) => updateField('department', e.target.value)}
                      placeholder="Sales"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractual-hours">Contractual Hours/Week</Label>
                    <Input
                      id="contractual-hours"
                      type="number"
                      step="0.5"
                      min="0"
                      value={payslipData.contractualHours || ''}
                      onChange={(e) => updateField('contractualHours', parseFloat(e.target.value) || 0)}
                      placeholder="40"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly-rate">Hourly Rate (£)</Label>
                    <Input
                      id="hourly-rate"
                      type="number"
                      step="0.01"
                      min="0"
                      value={payslipData.hourlyRate || ''}
                      onChange={(e) => updateField('hourlyRate', parseFloat(e.target.value) || 0)}
                      placeholder="15.00"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Tax Information Section */}
      {sections.tax && (
        <Collapsible 
          open={openSections.includes('tax')}
          onOpenChange={() => handleSectionToggle('tax')}
        >
          <Card className="border border-border">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-sm">Tax Information</CardTitle>
                      <p className="text-xs text-muted-foreground">HMRC and tax details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(getCompletionStatus('tax'))}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="tax-code">Tax Code</Label>
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Your tax code tells your employer how much tax to deduct from your pay. Common codes include 1257L for most employees.</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <Input
                      id="tax-code"
                      value={payslipData.taxCode || ''}
                      onChange={(e) => updateField('taxCode', e.target.value)}
                      placeholder="1257L"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ni-number">National Insurance Number</Label>
                    <Input
                      id="ni-number"
                      value={payslipData.niNumber || ''}
                      onChange={(e) => updateField('niNumber', e.target.value)}
                      placeholder="AB123456C"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tax-allowance">Tax Allowance (£)</Label>
                    <Input
                      id="tax-allowance"
                      type="number"
                      step="0.01"
                      min="0"
                      value={payslipData.taxAllowance || ''}
                      onChange={(e) => updateField('taxAllowance', parseFloat(e.target.value) || 0)}
                      placeholder="12570"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ni-category">NI Category</Label>
                    <Select
                      value={payslipData.niCategory || 'A'}
                      onValueChange={(value) => updateField('niCategory', value)}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select NI category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A - Standard rate</SelectItem>
                        <SelectItem value="B">B - Married women/widows (reduced rate)</SelectItem>
                        <SelectItem value="C">C - Over state pension age</SelectItem>
                        <SelectItem value="H">H - Apprentice under 25</SelectItem>
                        <SelectItem value="J">J - No liability to pay</SelectItem>
                        <SelectItem value="L">L - Deferred payment</SelectItem>
                        <SelectItem value="M">M - Under 21</SelectItem>
                        <SelectItem value="S">S - Contracted-out salary related</SelectItem>
                        <SelectItem value="X">X - No National Insurance</SelectItem>
                        <SelectItem value="Z">Z - No liability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student-loan-plan">Student Loan Plan</Label>
                    <Select
                      value={payslipData.studentLoanPlan || 'none'}
                      onValueChange={(value) => updateField('studentLoanPlan', value === 'none' ? undefined : value)}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select plan (if applicable)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="Plan1">Plan 1 (Before Sept 2012)</SelectItem>
                        <SelectItem value="Plan2">Plan 2 (Sept 2012 onwards)</SelectItem>
                        <SelectItem value="Plan4">Plan 4 (Scotland)</SelectItem>
                        <SelectItem value="Postgraduate">Postgraduate Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="starter-declaration">Starter Declaration</Label>
                    <Select
                      value={payslipData.starterDeclaration || ''}
                      onValueChange={(value: 'A' | 'B' | 'C') => updateField('starterDeclaration', value)}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
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
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Additional Information Section */}
      {sections.additional && (
        <Collapsible 
          open={openSections.includes('additional')}
          onOpenChange={() => handleSectionToggle('additional')}
        >
          <Card className="border border-border">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Info className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-sm">Additional Information</CardTitle>
                      <p className="text-xs text-muted-foreground">Optional details and notes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(getCompletionStatus('additional'))}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="pension-scheme">Pension Scheme Reference</Label>
                  <Input
                    id="pension-scheme"
                    value={payslipData.pensionSchemeReference || ''}
                    onChange={(e) => updateField('pensionSchemeReference', e.target.value)}
                    placeholder="Enter pension scheme reference"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={payslipData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Additional notes or comments"
                    className="rounded-xl"
                    rows={3}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
};
