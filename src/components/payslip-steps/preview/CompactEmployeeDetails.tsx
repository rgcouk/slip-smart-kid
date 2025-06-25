
import React from 'react';

interface CompactEmployeeDetailsProps {
  payslipData: any;
  isParentMode: boolean;
  selectedChild: any;
}

export const CompactEmployeeDetails = ({ payslipData, isParentMode, selectedChild }: CompactEmployeeDetailsProps) => {
  const formatPeriod = (period: string) => {
    if (!period) return '';
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="border border-gray-400 mb-4">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-gray-900 text-sm">Employee Details</h3>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">Works number</span>
              <span className="font-medium text-right">{payslipData.payrollNumber || '6'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax code</span>
              <span className="font-medium text-right">1257L</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">National Insurance number</span>
              <span className="font-medium text-right">JZ23434C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">National Insurance table</span>
              <span className="font-medium text-right">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
