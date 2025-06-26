
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  isValidFinancialAmount, 
  isValidEmployeeName, 
  isValidCompanyName,
  isValidPayrollNumber,
  validateDeductionsArray,
  isValidDateRange,
  sanitizeTextInput
} from '@/utils/validation';

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

  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (!payslipData.name.trim()) {
          errors.push('Employee name is required');
        } else if (!isValidEmployeeName(payslipData.name)) {
          errors.push('Employee name contains invalid characters');
        }
        
        if (!payslipData.period) {
          errors.push('Pay period is required');
        }
        
        if (payslipData.grossPay <= 0) {
          errors.push('Gross pay must be greater than 0');
        } else if (!isValidFinancialAmount(payslipData.grossPay)) {
          errors.push('Invalid gross pay amount');
        }
        
        if (payslipData.payrollNumber && !isValidPayrollNumber(payslipData.payrollNumber)) {
          errors.push('Payroll number contains invalid characters');
        }
        break;
        
      case 2:
        if (!payslipData.companyName.trim()) {
          errors.push('Company name is required');
        } else if (!isValidCompanyName(payslipData.companyName)) {
          errors.push('Company name contains invalid characters');
        }
        break;
        
      case 3:
        if (!validateDeductionsArray(payslipData.deductions)) {
          errors.push('Invalid deductions data');
        }
        break;
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const canProceed = (): boolean => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      console.log('Validation errors:', validation.errors);
    }
    return validation.isValid;
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

    // Final validation before saving
    const finalValidation = validateStep(1);
    if (!finalValidation.isValid) {
      toast({
        title: "Validation Error",
        description: finalValidation.errors.join(', '),
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

      // Validate date range
      if (!isValidDateRange(payPeriodStart, payPeriodEnd)) {
        toast({
          title: "Error",
          description: "Invalid pay period dates",
          variant: "destructive",
        });
        return;
      }

      const netSalary = calculateNetSalary();

      // Sanitize and validate all text inputs
      const sanitizedName = sanitizeTextInput(payslipData.name, 100);
      const sanitizedCompanyName = sanitizeTextInput(payslipData.companyName, 100);
      const sanitizedPayrollNumber = sanitizeTextInput(payslipData.payrollNumber || '', 20);

      // Ensure deductions data is properly formatted and validated
      const formattedDeductions = payslipData.deductions.map(deduction => ({
        id: sanitizeTextInput(deduction.id, 50),
        name: sanitizeTextInput(deduction.name, 50),
        amount: Number(deduction.amount) || 0
      }));

      // Final validation of formatted deductions
      if (!validateDeductionsArray(formattedDeductions)) {
        toast({
          title: "Error",
          description: "Invalid deductions data format",
          variant: "destructive",
        });
        return;
      }

      const payslipRecord = {
        user_id: user.id,
        child_id: isParentMode && selectedChild ? selectedChild.id : null,
        employee_name: sanitizedName,
        payroll_number: sanitizedPayrollNumber,
        company_name: sanitizedCompanyName,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        gross_salary: Number(payslipData.grossPay) || 0,
        deductions: formattedDeductions,
        net_salary: Number(netSalary) || 0
      };

      console.log('Saving validated payslip record:', payslipRecord);

      const { error } = await supabase
        .from('payslips')
        .insert([payslipRecord]);

      if (error) {
        console.error('Error saving payslip:', error);
        toast({
          title: "Error",
          description: `Failed to save payslip: ${error.message}`,
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
    savePayslip,
    validateStep
  };
};
