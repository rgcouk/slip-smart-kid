
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BusinessSetupStep } from './payslip-steps/BusinessSetupStep';
import { PeriodSelectionStep } from './payslip-steps/PeriodSelectionStep';
import { BasicInfoStep } from './payslip-steps/BasicInfoStep';
import { DeductionsStep } from './payslip-steps/DeductionsStep';
import { PreviewStep } from './payslip-steps/PreviewStep';
import { StepNavigation } from './payslip-steps/StepNavigation';
import { usePayslipCreator } from '@/hooks/usePayslipCreator';
import { PayslipData } from '@/types/payslip';
import { FileText, Building2, Calculator, Minus, Eye } from 'lucide-react';

interface PayslipCreatorProps {
  isParentMode: boolean;
  selectedChild: any;
  onStepChange?: (step: number) => void;
}

export const PayslipCreator = ({ isParentMode, selectedChild, onStepChange }: PayslipCreatorProps) => {
  const { payslipData, setPayslipData, canProceed, currentStep, nextStep, prevStep, savePayslip, isLoading } = usePayslipCreator(isParentMode, selectedChild);
  
  // Map current step to tab value
  const stepToTab = ['business', 'period', 'earnings', 'deductions', 'summary'];
  const activeTab = stepToTab[currentStep - 1] || 'business';

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Calculate completion status for each tab
  const getTabStatus = (tab: string) => {
    switch (tab) {
      case 'business':
        return payslipData.companyName && payslipData.name;
      case 'period':
        return payslipData.payPeriodStart && payslipData.payPeriodEnd;
      case 'earnings':
        return payslipData.paymentEntries?.length > 0 && payslipData.grossPay > 0;
      case 'deductions':
        return true; // Optional step
      case 'summary':
        return canProceed();
      default:
        return false;
    }
  };

  const totalEarnings = payslipData.paymentEntries?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0;
  const totalDeductions = payslipData.deductions?.reduce((sum: number, deduction: any) => sum + deduction.amount, 0) || 0;

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl text-card-foreground">Create Payslip</CardTitle>
            <CardDescription>ah Generate professional payslips with ease</CardDescription>
          </div>
          {isParentMode && (
            <Badge variant="secondary" className="ml-auto">Parent Mode</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} className="w-full">
          <div className="px-6 pb-4 border-b">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
              <TabsTrigger value="business" className="flex items-center gap-2 text-xs">
                <Building2 className="h-3 w-3" />
                <span className="hidden sm:inline">Business</span>
                {getTabStatus('business') && <Badge variant="outline" className="w-2 h-2 p-0 bg-primary" />}
              </TabsTrigger>
              <TabsTrigger value="period" className="flex items-center gap-2 text-xs">
                <FileText className="h-3 w-3" />
                <span className="hidden sm:inline">Period</span>
                {getTabStatus('period') && <Badge variant="outline" className="w-2 h-2 p-0 bg-primary" />}
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2 text-xs">
                <Calculator className="h-3 w-3" />
                <span className="hidden sm:inline">Earnings</span>
                {getTabStatus('earnings') && <Badge variant="outline" className="w-2 h-2 p-0 bg-primary" />}
              </TabsTrigger>
              <TabsTrigger value="deductions" className="flex items-center gap-2 text-xs">
                <Minus className="h-3 w-3" />
                <span className="hidden sm:inline">Deductions</span>
                {getTabStatus('deductions') && <Badge variant="outline" className="w-2 h-2 p-0 bg-primary" />}
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2 text-xs">
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Summary</span>
                {getTabStatus('summary') && <Badge variant="outline" className="w-2 h-2 p-0 bg-primary" />}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="business" className="mt-0 space-y-0">
              <BusinessSetupStep
                payslipData={payslipData}
                setPayslipData={setPayslipData}
                isParentMode={isParentMode}
              />
            </TabsContent>

            <TabsContent value="period" className="mt-0 space-y-0">
              <PeriodSelectionStep
                payslipData={payslipData}
                setPayslipData={setPayslipData}
                isParentMode={isParentMode}
              />
            </TabsContent>

            <TabsContent value="earnings" className="mt-0 space-y-0">
              <BasicInfoStep
                payslipData={payslipData}
                setPayslipData={setPayslipData}
                isParentMode={isParentMode}
                selectedChild={selectedChild}
              />
            </TabsContent>

            <TabsContent value="deductions" className="mt-0 space-y-0">
              <DeductionsStep
                payslipData={payslipData}
                setPayslipData={setPayslipData}
                isParentMode={isParentMode}
              />
            </TabsContent>

            <TabsContent value="summary" className="mt-0 space-y-0">
              <PreviewStep
                payslipData={payslipData}
                setPayslipData={setPayslipData}
                isParentMode={isParentMode}
                selectedChild={selectedChild}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Step Navigation */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={5}
          canProceed={canProceed()}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSave={savePayslip}
        />

        {/* Quick Stats Footer */}
        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <div>
                <span className="text-muted-foreground">Gross Pay:</span>
                <span className="ml-2 font-medium text-foreground">£{totalEarnings.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Deductions:</span>
                <span className="ml-2 font-medium text-foreground">£{totalDeductions.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Net Pay:</span>
                <span className="ml-2 font-semibold text-primary">£{(totalEarnings - totalDeductions).toFixed(2)}</span>
              </div>
            </div>
            <Button 
              onClick={savePayslip} 
              disabled={!canProceed() || isLoading}
              className="bg-primary hover:bg-accent"
            >
              {isLoading ? 'Saving...' : 'Save Payslip'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
