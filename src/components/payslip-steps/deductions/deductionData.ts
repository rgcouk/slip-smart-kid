
import { CommonDeduction } from './types';

export const ukDeductions: CommonDeduction[] = [
  { name: 'Income Tax', value: 20, type: 'percentage' },
  { name: 'National Insurance', value: 12, type: 'percentage' },
  { name: 'Pension', value: 5, type: 'percentage' },
  { name: 'Student Loan', value: 9, type: 'percentage' }
];

export const usDeductions: CommonDeduction[] = [
  { name: 'Federal Tax', value: 22, type: 'percentage' },
  { name: 'State Tax', value: 5, type: 'percentage' },
  { name: 'Social Security', value: 6.2, type: 'percentage' },
  { name: 'Medicare', value: 1.45, type: 'percentage' }
];
