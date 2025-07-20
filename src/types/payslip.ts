
export interface PayslipData {
  // Employee Information
  name: string;
  employeeName?: string; // Keep for backward compatibility
  payrollNumber?: string;
  selectedEmployeeId?: string;
  
  // Employee Personal Information
  employeeEmail?: string;
  employeePhone?: string;
  employeeAddress?: string;
  
  // Employee Tax Information
  taxCode?: string;
  niNumber?: string;
  taxAllowance?: number;
  niCategory?: string;
  studentLoanPlan?: string;
  pensionSchemeReference?: string;
  starterDeclaration?: 'A' | 'B' | 'C';
  department?: string;
  
  // Additional Employee Information
  notes?: string;
  
  // Pay Period Information
  period: string; // YYYY-MM format for backward compatibility
  payPeriodStart: string; // YYYY-MM-DD format
  payPeriodEnd: string; // YYYY-MM-DD format
  
  // Basic Pay Information
  grossPay: number;
  contractualHours?: number;
  hourlyRate?: number;
  
  // Additional Payment Entries
  paymentEntries: PaymentEntry[];
  
  // Company Information
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyRegistration?: string;
  companyLogo?: string;
  
  // Template Selection
  template?: 'default' | 'professional' | 'compact' | string;
  
  // Deductions
  deductions: DeductionEntry[];
  
  // Year to Date Override
  ytdOverride?: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}

export interface PaymentEntry {
  id: string;
  description: string;
  type: 'hourly' | 'fixed' | 'overtime' | 'bonus';
  quantity?: number; // hours, days, etc.
  rate?: number; // rate per unit
  amount: number; // calculated or fixed amount
}

export interface DeductionEntry {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}
