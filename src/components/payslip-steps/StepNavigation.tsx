
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSave: () => void;
}

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  isLoading, 
  onPrevStep, 
  onNextStep, 
  onSave 
}: StepNavigationProps) => {
  return (
    <div className="p-4 border-t border-gray-100 flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {currentStep < totalSteps ? (
        <Button
          onClick={onNextStep}
          disabled={!canProceed}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onSave}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Saving...' : 'Save Payslip'}
        </Button>
      )}
    </div>
  );
};
