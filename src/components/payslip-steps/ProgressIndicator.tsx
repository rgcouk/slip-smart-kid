
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressIndicator = ({ steps, currentStep }: ProgressIndicatorProps) => {
  return (
    <>
      {/* Mobile Progress Indicator (Horizontal) */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`flex items-center gap-2 ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.number 
                    ? 'bg-green-600 text-white' 
                    : currentStep === step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Desktop Progress Indicator (Vertical Sidebar) */}
      <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isPending = currentStep < step.number;

              return (
                <div key={step.number} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 border-2 border-green-600'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-600 ring-2 ring-blue-200'
                      : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      isCompleted
                        ? 'text-green-700'
                        : isCurrent
                        ? 'text-blue-700'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    {isCompleted && (
                      <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                    )}
                    {isCurrent && (
                      <div className="text-xs text-blue-600 mt-1">In Progress</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
