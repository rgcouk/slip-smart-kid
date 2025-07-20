import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PayslipData, PaymentEntry } from '@/types/payslip';
import { 
  isValidFinancialAmount, 
  isValidEmployeeName, 
  isValidCompanyName,
  isValidPayrollNumber,
  validateDeductionsArray,
  isValidDateRange,
  sanitizeTextInput
} from '@/utils/validation';

export const usePayslipCreator = (isParentMode: boolean, selectedChild: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [payslipData, setPayslipData] = useState<PayslipData>({
    name: '',
    payrollNumber: '',
    period: '',
    payPeriodStart: '',
    payPeriodEnd: '',
    grossPay: 0,
    contractualHours: 40,
    hourlyRate: 0,
    paymentEntries: [{
      id: '1',
      description: 'Basic Salary',
      type: 'fixed',
      amount: 0
    }],
    companyName: 'SlipSim Company',
    template: 'default',
    deductions: []
  });

  // Auto-save to localStorage
  useEffect(() => {
    const autoSaveData = {
      ...payslipData,
      currentStep,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('payslipAutoSave', JSON.stringify(autoSaveData));
  }, [payslipData, currentStep]);

  // Load auto-saved data on mount
  useEffect(() => {
    const autoSavedData = localStorage.getItem('payslipAutoSave');
    if (autoSavedData) {
      try {
        const parsed = JSON.parse(autoSavedData);
        const { currentStep: savedStep, lastSaved, ...savedPayslipData } = parsed;
        
        // Only restore if saved within last 24 hours
        const lastSavedDate = new Date(lastSaved);
        const hoursSinceSave = (Date.now() - lastSavedDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceSave < 24) {
          setPayslipData(syncPeriodFormats(savedPayslipData));
          setCurrentStep(savedStep || 1);
          toast({
            title: "Data Restored",
            description: "Your previous work has been restored.",
          });
        }
      } catch (error) {
        console.error('Error loading auto-saved data:', error);
      }
    }
  }, []);

  // Helper function to sync period formats
  const syncPeriodFormats = (data: PayslipData) => {
    if (data.payPeriodStart && data.payPeriodEnd && !data.period) {
      const startDate = new Date(data.payPeriodStart);
      data.period = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (data.period && (!data.payPeriodStart || !data.payPeriodEnd)) {
      const [year, month] = data.period.split('-');
      data.payPeriodStart = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      data.payPeriodEnd = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;
    }
    
    // Ensure name field is consistent
    if (data.employeeName && !data.name) {
      data.name = data.employeeName;
    } else if (data.name && !data.employeeName) {
      data.employeeName = data.name;
    }
    
    return data;
  };

  // Calculate gross pay from payment entries
  const calculateGrossPay = (entries: PaymentEntry[]) => {
    return entries.reduce((total, entry) => total + entry.amount, 0);
  };

  // Update gross pay when payment entries change
  useEffect(() => {
    const totalGross = calculateGrossPay(payslipData.paymentEntries);
    if (totalGross !== payslipData.grossPay) {
      setPayslipData(prev => ({ ...prev, grossPay: totalGross }));
    }
  }, [payslipData.paymentEntries]);

  // Check for edit or duplicate mode on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const duplicateId = urlParams.get('duplicate');
    
    if (editId) {
      const editData = localStorage.getItem('editPayslipData');
      if (editData) {
        try {
          const parsedData = JSON.parse(editData);
          setPayslipData(syncPeriodFormats(parsedData));
          localStorage.removeItem('editPayslipData');
          toast({
            title: "Editing Payslip",
            description: "Payslip data loaded for editing",
          });
        } catch (error) {
          console.error('Error parsing edit data:', error);
        }
      }
    }
    
    if (duplicateId) {
      const duplicateData = localStorage.getItem('duplicatePayslipData');
      if (duplicateData) {
        try {
          const parsedData = JSON.parse(duplicateData);
          setPayslipData(syncPeriodFormats({
            ...parsedData,
            name: `${parsedData.name} (Copy)`
          }));
          localStorage.removeItem('duplicatePayslipData');
          toast({
            title: "Duplicating Payslip",
            description: "Payslip data loaded for duplication",
          });
        } catch (error) {
          console.error('Error parsing duplicate data:', error);
        }
      }
    }
  }, [toast]);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 1: // Business Setup
        if (!payslipData.companyName?.trim()) {
          errors.push('Company name is required');
        } else if (!isValidCompanyName(payslipData.companyName)) {
          errors.push('Company name contains invalid characters');
        }
        
        if (!payslipData.name?.trim()) {
          errors.push('Employee name is required');
        } else if (!isValidEmployeeName(payslipData.name)) {
          errors.push('Employee name contains invalid characters');
        }
        break;
        
      case 2: // Pay Period
        if (!payslipData.payPeriodStart || !payslipData.payPeriodEnd) {
          errors.push('Pay period dates are required');
        } else if (!isValidDateRange(payslipData.payPeriodStart, payslipData.payPeriodEnd)) {
          errors.push('Invalid pay period date range');
        }
        break;
        
      case 3: // Earnings
        if (!payslipData.paymentEntries || payslipData.paymentEntries.length === 0) {
          errors.push('At least one payment entry is required');
        } else {
          payslipData.paymentEntries.forEach((entry, index) => {
            if (!entry.description?.trim()) {
              errors.push(`Payment entry ${index + 1} requires a description`);
            }
            if (entry.amount <= 0) {
              errors.push(`Payment entry ${index + 1} must have an amount greater than 0`);
            }
          });
        }
        
        if (payslipData.grossPay <= 0) {
          errors.push('Total gross pay must be greater than 0');
        }
        break;
        
      case 4: // Deductions
        if (!validateDeductionsArray(payslipData.deductions)) {
          errors.push('Invalid deductions data');
        }
        break;
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const canProceed = (): boolean => {
    const validation = validateStep(currentStep);
    if (!validation.isValid && process.env.NODE_ENV === 'development') {
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
      const syncedData = syncPeriodFormats({ ...payslipData });
      const netSalary = calculateNetSalary();

      // Sanitize and validate all text inputs
      const sanitizedName = sanitizeTextInput(syncedData.name, 100);
      const sanitizedCompanyName = sanitizeTextInput(syncedData.companyName, 100);

      // Ensure deductions data is properly formatted and validated
      const formattedDeductions = syncedData.deductions.map(deduction => ({
        id: sanitizeTextInput(deduction.id, 50),
        name: sanitizeTextInput(deduction.name, 50),
        amount: Number(deduction.amount) || 0
      }));

      const payslipRecord = {
        user_id: user.id,
        child_id: isParentMode && selectedChild ? selectedChild.id : null,
        employee_name: sanitizedName,
        company_name: sanitizedCompanyName,
        pay_period_start: syncedData.payPeriodStart,
        pay_period_end: syncedData.payPeriodEnd,
        gross_salary: Number(syncedData.grossPay) || 0,
        deductions: formattedDeductions,
        net_salary: Number(netSalary) || 0
      };

      // Store additional employee data in payslip data for templates
      const enrichedPayslipData = {
        ...syncedData,
        payrollNumber: syncedData.payrollNumber,
        taxCode: syncedData.taxCode,
        niNumber: syncedData.niNumber,
        niCategory: syncedData.niCategory,
        department: syncedData.department,
        companyName: sanitizedCompanyName,
        employeeName: sanitizedName
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
          payPeriodStart: '',
          payPeriodEnd: '',
          grossPay: 0,
          contractualHours: 40,
          hourlyRate: 0,
          paymentEntries: [{
            id: '1',
            description: 'Basic Salary',
            type: 'fixed',
            amount: 0
          }],
          companyName: 'SlipSim Company',
          template: 'default',
          deductions: []
        });
        setCurrentStep(1);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
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
    setPayslipData: (data: PayslipData | ((prev: PayslipData) => PayslipData)) => {
      if (typeof data === 'function') {
        setPayslipData(prev => syncPeriodFormats(data(prev)));
      } else {
        setPayslipData(syncPeriodFormats(data));
      }
    },
    nextStep,
    prevStep,
    canProceed,
    savePayslip,
    validateStep,
    calculateGrossPay
  };
};
