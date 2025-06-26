
// Email validation utility
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Financial input validation
export const isValidFinancialAmount = (amount: number): boolean => {
  return !isNaN(amount) && 
         isFinite(amount) && 
         amount >= 0 && 
         amount <= 999999999.99; // Reasonable upper limit
};

// Payroll number validation (alphanumeric, max 20 chars)
export const isValidPayrollNumber = (payrollNumber: string): boolean => {
  const payrollRegex = /^[a-zA-Z0-9-_]{1,20}$/;
  return payrollRegex.test(payrollNumber);
};

// Company name validation (no special chars except spaces, hyphens, periods)
export const isValidCompanyName = (name: string): boolean => {
  const companyRegex = /^[a-zA-Z0-9\s\-\.]{1,100}$/;
  return companyRegex.test(name.trim());
};

// Employee name validation
export const isValidEmployeeName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-'\.]{1,50}$/;
  return nameRegex.test(name.trim());
};

// Validate deductions array structure
export const validateDeductionsArray = (deductions: any[]): boolean => {
  if (!Array.isArray(deductions)) return false;
  
  return deductions.every(deduction => 
    deduction &&
    typeof deduction.id === 'string' &&
    typeof deduction.name === 'string' &&
    deduction.name.length <= 50 &&
    typeof deduction.amount === 'number' &&
    isValidFinancialAmount(deduction.amount)
  );
};

// Validate date range for payslip periods
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  
  // Start date should be before end date
  if (start >= end) return false;
  
  // Dates shouldn't be too far in the future (1 year)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  return start <= oneYearFromNow && end <= oneYearFromNow;
};

// Sanitize text input to prevent potential issues
export const sanitizeTextInput = (input: string, maxLength: number = 255): string => {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML brackets
};
