
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PayslipRecord {
  id: string;
  employee_name: string;
  company_name: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_salary: number;
  net_salary: number;
  deductions: any[];
  created_at: string;
}

interface YTDContribution {
  payslipId: string;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
}

export const usePayslipHistory = (employeeName: string) => {
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [ytdContributions, setYtdContributions] = useState<YTDContribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch previous payslips for the employee
  useEffect(() => {
    if (!user || !employeeName) return;
    
    const fetchPayslips = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('payslips')
          .select('*')
          .eq('user_id', user.id)
          .eq('employee_name', employeeName)
          .order('pay_period_start', { ascending: false });

        if (error) {
          console.error('Error fetching payslips:', error);
          toast({
            title: "Error",
            description: "Failed to fetch previous payslips",
            variant: "destructive",
          });
        } else {
          setPayslips(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayslips();
  }, [user, employeeName, toast]);

  // Calculate total deductions from deductions array
  const calculateTotalDeductions = (deductions: any[]) => {
    if (!Array.isArray(deductions)) return 0;
    return deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
  };

  // Add a payslip to YTD contributions
  const addToYTD = (payslip: PayslipRecord) => {
    const totalDeductions = calculateTotalDeductions(payslip.deductions);
    
    const contribution: YTDContribution = {
      payslipId: payslip.id,
      employeeName: payslip.employee_name,
      periodStart: payslip.pay_period_start,
      periodEnd: payslip.pay_period_end,
      grossPay: payslip.gross_salary,
      totalDeductions,
      netPay: payslip.net_salary
    };

    // Check if already added
    if (ytdContributions.some(c => c.payslipId === payslip.id)) {
      toast({
        title: "Already Added",
        description: "This payslip is already included in YTD calculations",
        variant: "destructive",
      });
      return;
    }

    setYtdContributions(prev => [...prev, contribution]);
    toast({
      title: "Added to YTD",
      description: `Payslip for ${payslip.pay_period_start} to ${payslip.pay_period_end} added to YTD`,
    });
  };

  // Remove a payslip from YTD contributions
  const removeFromYTD = (payslipId: string) => {
    setYtdContributions(prev => prev.filter(c => c.payslipId !== payslipId));
    toast({
      title: "Removed from YTD",
      description: "Payslip removed from YTD calculations",
    });
  };

  // Calculate cumulative YTD values
  const calculateCumulativeYTD = () => {
    return ytdContributions.reduce(
      (totals, contribution) => ({
        grossPay: totals.grossPay + contribution.grossPay,
        totalDeductions: totals.totalDeductions + contribution.totalDeductions,
        netPay: totals.netPay + contribution.netPay
      }),
      { grossPay: 0, totalDeductions: 0, netPay: 0 }
    );
  };

  // Clear all YTD contributions
  const clearYTD = () => {
    setYtdContributions([]);
    toast({
      title: "YTD Cleared",
      description: "All payslip contributions removed from YTD",
    });
  };

  return {
    payslips,
    ytdContributions,
    isLoading,
    addToYTD,
    removeFromYTD,
    calculateCumulativeYTD,
    clearYTD
  };
};
