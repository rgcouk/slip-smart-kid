
import React from 'react';

interface CompactEmployeeDetailsProps {
  payslipData: any;
  isParentMode: boolean;
  selectedChild: any;
}

export const CompactEmployeeDetails = ({ payslipData, isParentMode, selectedChild }: CompactEmployeeDetailsProps) => {
  // Helper function to render a field only if it has data
  const renderField = (label: string, value: string | undefined, fallback?: string) => {
    const displayValue = value || fallback;
    if (!displayValue) return null;
    
    return (
      <div className="flex justify-between">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium text-right">{displayValue}</span>
      </div>
    );
  };

  // Get employee details from payslipData
  const employeeDetails = [
    { label: "Works number", value: payslipData.payrollNumber },
    { label: "Tax code", value: payslipData.taxCode },
    { label: "National Insurance number", value: payslipData.niNumber },
    { label: "National Insurance table", value: payslipData.niCategory },
    { label: "Department", value: payslipData.department }
  ].filter(detail => detail.value); // Only include fields that have values

  // Don't render the component if no employee details exist
  if (employeeDetails.length === 0) return null;

  // Split details into two columns for grid layout
  const leftColumn = employeeDetails.slice(0, Math.ceil(employeeDetails.length / 2));
  const rightColumn = employeeDetails.slice(Math.ceil(employeeDetails.length / 2));

  return (
    <div className="border border-gray-400 mb-4">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-gray-900 text-sm">Employee Details</h3>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            {leftColumn.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">{detail.label}</span>
                <span className="font-medium text-right">{detail.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {rightColumn.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">{detail.label}</span>
                <span className="font-medium text-right">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
