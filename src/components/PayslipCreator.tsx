import React, { useState } from 'react';
import { BasicInfoStep } from './payslip-steps/BasicInfoStep';
import { CompanyInfoStep } from './payslip-steps/CompanyInfoStep';
import { DeductionsStep } from './payslip-steps/DeductionsStep';
import { YTDStep } from './payslip-steps/YTDStep';
import { PreviewStep } from './payslip-steps/PreviewStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PayslipData {
  name: string;
  payrollNumber: string;
  period: string;
  grossPay: number;
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyRegistration?: string;
  companyLogo?: string;
  ytdOverride?: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
  deductions: Array<{
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  }>;
}

interface PayslipCreatorProps {
  isParentMode: boolean;
  selectedChild: any;
}

export const PayslipCreator = ({ isParentMode, selectedChild }: PayslipCreatorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [payslipData, setPayslipData] = useState<PayslipData>({
    name: '',
    payrollNumber: '',
    period: '',
    grossPay: 0,
    companyName: 'SlipSim Company',
    deductions: []
  });

  const steps = [
    { number: 1, title: 'Basic Info', component: BasicInfoStep },
    { number: 2, title: 'Company', component: CompanyInfoStep },
    { number: 3, title: 'Deductions', component: DeductionsStep },
    { number: 4, title: 'Year to Date', component: YTDStep },
    { number: 5, title: 'Preview', component: PreviewStep }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return payslipData.name && payslipData.period && payslipData.grossPay > 0;
      case 2:
        return payslipData.companyName;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const calculateNetSalary = () => {
    const totalDeductions = payslipData.deductions.reduce((sum, d) => sum + d.amount, 0);
    return payslipData.grossPay - totalDeductions;
  };

  const savePayslip = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save payslips",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse period to get start and end dates
      const [year, month] = payslipData.period.split('-');
      const payPeriodStart = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const payPeriodEnd = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

      const netSalary = calculateNetSalary();

      const payslipRecord = {
        user_id: user.id,
        child_id: isParentMode && selectedChild ? selectedChild.id : null,
        employee_name: payslipData.name,
        payroll_number: payslipData.payrollNumber,
        company_name: payslipData.companyName,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        gross_salary: payslipData.grossPay,
        deductions: payslipData.deductions,
        net_salary: netSalary
      };

      const { error } = await supabase
        .from('payslips')
        .insert([payslipRecord]);

      if (error) {
        console.error('Error saving payslip:', error);
        toast({
          title: "Error",
          description: "Failed to save payslip. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Payslip saved successfully!",
        });
        
        // Reset form for new payslip
        setPayslipData({
          name: '',
          payrollNumber: '',
          period: '',
          grossPay: 0,
          companyName: 'SlipSim Company',
          deductions: []
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100">
      {/* Progress Indicator */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`flex items-center gap-2 ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        {CurrentStepComponent && (
          <CurrentStepComponent
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
            selectedChild={selectedChild}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-100 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={savePayslip}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Saving...' : 'Save Payslip'}
          </Button>
        )}
      </div>
    </div>
  );
};
