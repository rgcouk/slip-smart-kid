
import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { BusinessSetupStep } from './payslip-steps/BusinessSetupStep';
import { PeriodSelectionStep } from './payslip-steps/PeriodSelectionStep';
import { BasicInfoStep } from './payslip-steps/BasicInfoStep';
import { DeductionsStep } from './payslip-steps/DeductionsStep';
import { PreviewStep } from './payslip-steps/PreviewStep';
import { StepNavigation } from './payslip-steps/StepNavigation';
import { usePayslipCreator } from '@/hooks/usePayslipCreator';

interface PayslipCreatorProps {
  isParentMode: boolean;
  selectedChild: any;
  onStepChange?: (step: number) => void;
}

export const PayslipCreator = ({ isParentMode, selectedChild, onStepChange }: PayslipCreatorProps) => {
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

  // Notify parent component when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const steps = [
    { number: 1, title: 'Business Setup', component: BusinessSetupStep },
    { number: 2, title: 'Pay Period', component: PeriodSelectionStep },
    { number: 3, title: 'Earnings', component: BasicInfoStep },
    { number: 4, title: 'Deductions', component: DeductionsStep },
    { number: 5, title: 'Review & Export', component: PreviewStep }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const canProceedToNext = canProceed();

  return (
    <div className="glass-card overflow-hidden">
      {/* Enhanced Progress Indicator */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-white/10">
        <div className="p-4">
          {/* Mobile Progress Bar */}
          <div className="lg:hidden mb-4">
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-lg font-semibold text-white">{currentStepData?.title}</span>
            </div>
          </div>

          {/* Desktop Progress Steps */}
          <div className="hidden lg:flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center gap-3 ${
                  currentStep >= step.number ? 'text-white' : 'text-slate-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                      : currentStep === step.number
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg ring-4 ring-purple-500/30'
                      : 'bg-slate-600 text-slate-300'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{step.title}</span>
                    {currentStep === step.number && (
                      <span className="text-xs text-purple-400">Current</span>
                    )}
                    {currentStep > step.number && (
                      <span className="text-xs text-green-400">Complete</span>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

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

      <div className="border-t border-white/10 bg-slate-800/50">
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
