
import React from 'react';

interface CompactPayslipFooterProps {
  payslipData: any;
}

export const CompactPayslipFooter = ({ payslipData }: CompactPayslipFooterProps) => {
  return (
    <div className="mt-8 pt-4 border-t-2 border-gray-300">
      <div className="flex justify-between items-center text-sm">
        <div className="text-gray-600">
          <p>This payslip is computer generated and does not require a signature.</p>
          <p className="text-xs mt-1">For queries, please contact the HR department.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <span className="text-gray-500 mr-2">Powered by</span>
            <span className="font-bold text-orange-600 text-lg">SlipSim</span>
          </div>
          <p className="text-xs text-gray-500">Professional Payroll Solutions</p>
        </div>
      </div>
    </div>
  );
};
