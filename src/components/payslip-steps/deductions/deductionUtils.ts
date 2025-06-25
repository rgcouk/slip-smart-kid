
import { Deduction, DeductionFormData } from './types';

export const calculateDeductionAmount = (deduction: DeductionFormData, grossPay: number): number => {
  if (deduction.type === 'percentage') {
    return (grossPay * deduction.value) / 100;
  }
  return deduction.value;
};

export const createDeduction = (formData: DeductionFormData, grossPay: number): Deduction => {
  return {
    id: Date.now().toString(),
    ...formData,
    amount: calculateDeductionAmount(formData, grossPay)
  };
};

export const calculateTotalDeductions = (deductions: Deduction[]): number => {
  return deductions.reduce((sum, d) => sum + d.amount, 0);
};
