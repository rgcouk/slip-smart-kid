
import React from 'react';

interface CompactPayslipFooterProps {
  payslipData: any;
}

export const CompactPayslipFooter = ({ payslipData }: CompactPayslipFooterProps) => {
  return (
    <div className="flex justify-between items-center text-xs text-gray-600 mt-4 pt-2 border-t border-gray-300">
      <div>
        Employer PAYE Reference: 120/GE26732
      </div>
      <div className="flex items-center">
        <span className="mr-2">Created with</span>
        <span className="font-bold text-orange-600">SlipSim</span>
      </div>
    </div>
  );
};
