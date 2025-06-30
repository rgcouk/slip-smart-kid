
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BusinessSetupStep } from './payslip-steps/BusinessSetupStep';
import { PeriodSelectionStep } from './payslip-steps/PeriodSelectionStep';
import { BasicInfoStep } from './payslip-steps/BasicInfoStep';
import { DeductionsStep } from './payslip-steps/DeductionsStep';
import { PreviewStep } from './payslip-steps/PreviewStep';
import { ProgressIndicator } from './payslip-steps/ProgressIndicator';
import { StepNavigation } from './payslip-steps/StepNavigation';
import { usePayslipCreator } from '@/hooks/usePayslipCreator';
import { PayslipData } from '@/types/payslip';

interface PayslipCreatorProps {
  isParentMode: boolean;
  selectedChild: any;
  onStepChange?: (step: number) => void;
}

export const PayslipCreator = ({ isParentMode, selectedChild, onStepChange }: PayslipCreatorProps) => {
  const { payslipData, setPayslipData, canProceed, currentStep, nextStep, prevStep, savePayslip, isLoading } = usePayslipCreator(isParentMode, selectedChild);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const steps = [
    { number: 1, title: 'Business Setup' },
    { number: 2, title: 'Pay Period' },
    { number: 3, title: 'Earnings' },
    { number: 4, title: 'Deductions' },
    { number: 5, title: 'Review & Export' }
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessSetupStep
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
          />
        );
      case 2:
        return (
          <PeriodSelectionStep
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
          />
        );
      case 3:
        return (
          <BasicInfoStep
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
            selectedChild={selectedChild}
          />
        );
      case 4:
        return (
          <DeductionsStep
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
          />
        );
      case 5:
        return (
          <PreviewStep
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
            selectedChild={selectedChild}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
      {/* Mobile Progress Indicator */}
      <div className="lg:hidden border-b border-gray-200">
        <ProgressIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 p-4 sm:p-6">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={5}
          canProceed={canProceed()}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSave={savePayslip}
        />
      </div>
    </div>
  );
};
