import { useState } from 'react';
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

export const usePayslipCreator = (isParentMode: boolean, selectedChild: any) => {
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

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(payslipData.name && payslipData.period && payslipData.grossPay > 0);
      case 2:
        return Boolean(payslipData.companyName);
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

  return {
    currentStep,
    isLoading,
    payslipData,
    setPayslipData,
    nextStep,
    prevStep,
    canProceed,
    savePayslip
  };
};
