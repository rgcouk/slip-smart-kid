
import React from 'react';
import { BasicInfoStep } from './payslip-steps/BasicInfoStep';
import { CompanyInfoStep } from './payslip-steps/CompanyInfoStep';
import { DeductionsStep } from './payslip-steps/DeductionsStep';
import { YTDStep } from './payslip-steps/YTDStep';
import { PreviewStep } from './payslip-steps/PreviewStep';
import { ProgressIndicator } from './payslip-steps/ProgressIndicator';
import { StepNavigation } from './payslip-steps/StepNavigation';
import { usePayslipCreator } from '@/hooks/usePayslipCreator';

interface PayslipCreatorProps {
  isParentMode: boolean;
  selectedChild: any;
}

export const PayslipCreator = ({ isParentMode, selectedChild }: PayslipCreatorProps) => {
  const {
    currentStep,
    isLoading,
    payslipData,
    setPayslipData,
    nextStep,
    prevStep,
    canProceed,
    savePayslip
  } = usePayslipCreator(isParentMode, selectedChild);

  const steps = [
    { number: 1, title: 'Employee Info', component: BasicInfoStep },
    { number: 2, title: 'Company', component: CompanyInfoStep },
    { number: 3, title: 'Deductions', component: DeductionsStep },
    { number: 4, title: 'Year to Date', component: YTDStep },
    { number: 5, title: 'Preview', component: PreviewStep }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const canProceedToNext = canProceed();

  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <ProgressIndicator steps={steps} currentStep={currentStep} />

      <div className="p-4 sm:p-6 lg:p-8 min-h-[600px] lg:min-h-[700px]">
        {CurrentStepComponent && (
          <div className="max-w-4xl mx-auto">
            <CurrentStepComponent
              payslipData={payslipData}
              setPayslipData={setPayslipData}
              isParentMode={isParentMode}
              selectedChild={selectedChild}
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={5}
          canProceed={canProceedToNext}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSave={savePayslip}
        />
      </div>
    </div>
  );
};
