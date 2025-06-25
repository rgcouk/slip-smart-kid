
import React, { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { QuickAddDeductions } from './deductions/QuickAddDeductions';
import { CustomDeductionForm } from './deductions/CustomDeductionForm';
import { DeductionsList } from './deductions/DeductionsList';
import { CalculationPreview } from './deductions/CalculationPreview';
import { LearningMoment } from './deductions/LearningMoment';
import { ukDeductions, usDeductions } from './deductions/deductionData';
import { createDeduction, calculateTotalDeductions } from './deductions/deductionUtils';
import { DeductionFormData } from './deductions/types';

interface DeductionsStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
}

export const DeductionsStep = ({ payslipData, setPayslipData, isParentMode }: DeductionsStepProps) => {
  const { locale, config } = useLocale();
  const [newDeduction, setNewDeduction] = useState<DeductionFormData>({
    name: '',
    type: 'percentage',
    value: 0
  });

  const addDeduction = () => {
    if (newDeduction.name && newDeduction.value > 0) {
      const deduction = createDeduction(newDeduction, payslipData.grossPay);

      setPayslipData({
        ...payslipData,
        deductions: [...payslipData.deductions, deduction]
      });

      setNewDeduction({ name: '', type: 'percentage', value: 0 });
    }
  };

  const removeDeduction = (id: string) => {
    setPayslipData({
      ...payslipData,
      deductions: payslipData.deductions.filter((d: any) => d.id !== id)
    });
  };

  const addCommonDeduction = (name: string, type: 'percentage' | 'fixed', value: number) => {
    const deduction = createDeduction({ name, type, value }, payslipData.grossPay);

    setPayslipData({
      ...payslipData,
      deductions: [...payslipData.deductions, deduction]
    });
  };

  const commonDeductions = locale === 'UK' ? ukDeductions : usDeductions;
  const totalDeductions = calculateTotalDeductions(payslipData.deductions);
  const netPay = payslipData.grossPay - totalDeductions;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Deductions</h2>
        <p className="text-gray-600">Add taxes, insurance, and other deductions</p>
      </div>

      <QuickAddDeductions
        commonDeductions={commonDeductions}
        locale={locale}
        onAddDeduction={addCommonDeduction}
      />

      <CustomDeductionForm
        newDeduction={newDeduction}
        setNewDeduction={setNewDeduction}
        onAddDeduction={addDeduction}
        locale={locale}
        currencySymbol={config.currency}
      />

      <DeductionsList
        deductions={payslipData.deductions}
        currencySymbol={config.currency}
        onRemoveDeduction={removeDeduction}
      />

      <CalculationPreview
        grossPay={payslipData.grossPay}
        totalDeductions={totalDeductions}
        netPay={netPay}
        currencySymbol={config.currency}
      />

      {isParentMode && <LearningMoment locale={locale} />}
    </div>
  );
};
