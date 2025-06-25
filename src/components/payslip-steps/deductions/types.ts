
export interface Deduction {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface CommonDeduction {
  name: string;
  value: number;
  type: 'percentage' | 'fixed';
}

export interface DeductionFormData {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}
