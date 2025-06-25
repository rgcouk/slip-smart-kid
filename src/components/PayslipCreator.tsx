
import React, { useState } from 'react';
import { BasicInfoStep } from './payslip-steps/BasicInfoStep';
import { DeductionsStep } from './payslip-steps/DeductionsStep';
import { PreviewStep } from './payslip-steps/PreviewStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PayslipData {
  name: string;
  period: string;
  grossPay: number;
  deductions: Array<{
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  }>;
}

interface PayslipCreatorProps {
  isParentMode: boolean;
  selectedChild: any;
}

export const PayslipCreator = ({ isParentMode, selectedChild }: PayslipCreatorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [payslipData, setPayslipData] = useState<PayslipData>({
    name: '',
    period: '',
    grossPay: 0,
    deductions: []
  });

  const steps = [
    { number: 1, title: 'Basic Info', component: BasicInfoStep },
    { number: 2, title: 'Deductions', component: DeductionsStep },
    { number: 3, title: 'Preview', component: PreviewStep }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return payslipData.name && payslipData.period && payslipData.grossPay > 0;
      case 2:
        return true; // Can always proceed from deductions
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100">
      {/* Progress Indicator */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`flex items-center gap-2 ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        {CurrentStepComponent && (
          <CurrentStepComponent
            payslipData={payslipData}
            setPayslipData={setPayslipData}
            isParentMode={isParentMode}
            selectedChild={selectedChild}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-100 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-green-600 hover:bg-green-700">
            Generate Payslip
          </Button>
        )}
      </div>
    </div>
  );
};
