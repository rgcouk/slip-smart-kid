
import React from 'react';

interface LearningMomentProps {
  locale: string;
}

export const LearningMoment = ({ locale }: LearningMomentProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="font-medium text-green-800 mb-2">💡 Learning Moment</h3>
      <p className="text-sm text-green-700">
        {locale === 'UK' 
          ? "Deductions are amounts taken from your gross pay. In the UK, this includes Income Tax (for public services), National Insurance (for NHS and pensions), and optional things like pension contributions. What's left is your take-home pay!"
          : "Deductions are amounts taken out of your gross pay. Think of it like sharing your allowance - some goes to savings (like taxes for roads and schools), some for insurance (protection), and what's left is yours to keep!"
        }
      </p>
    </div>
  );
};
