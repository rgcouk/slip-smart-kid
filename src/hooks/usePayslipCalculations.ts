
import { useMemo } from 'react';
import { PayslipData } from '@/types/payslip';

interface YTDValues {
  grossPay: number;
  totalDeductions: number;
  netPay: number;
}

export const usePayslipCalculations = (payslipData: PayslipData) => {
  // Memoize total deductions calculation
  const totalDeductions = useMemo(() => {
    return payslipData.deductions.reduce((sum, d) => sum + d.amount, 0);
  }, [payslipData.deductions]);

  // Memoize net pay calculation
  const netPay = useMemo(() => {
    return payslipData.grossPay - totalDeductions;
  }, [payslipData.grossPay, totalDeductions]);

  // Memoize current period calculation
  const currentPeriodNumber = useMemo(() => {
    if (!payslipData.period) return 1;
    const [, month] = payslipData.period.split('-');
    return parseInt(month) || 1;
  }, [payslipData.period]);

  // Memoize YTD values calculation
  const ytdValues: YTDValues = useMemo(() => {
    // Use override values if available, otherwise calculate automatically
    if (payslipData.ytdOverride) {
      return payslipData.ytdOverride;
    }

    return {
      grossPay: payslipData.grossPay * currentPeriodNumber,
      totalDeductions: totalDeductions * currentPeriodNumber,
      netPay: netPay * currentPeriodNumber
    };
  }, [
    payslipData.grossPay,
    payslipData.ytdOverride,
    totalDeductions,
    netPay,
    currentPeriodNumber
  ]);

  return {
    totalDeductions,
    netPay,
    ytdValues,
    currentPeriodNumber
  };
};
