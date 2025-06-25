
import React, { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { ExportOverlay } from './ExportOverlay';
import { PayslipHeader } from './preview/PayslipHeader';
import { CompactPaymentsDeductions } from './preview/CompactPaymentsDeductions';
import { CompactSummary } from './preview/CompactSummary';
import { CompactPayslipFooter } from './preview/CompactPayslipFooter';
import { ExportActions } from './preview/ExportActions';

interface PreviewStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const PreviewStep = ({ payslipData, isParentMode, selectedChild }: PreviewStepProps) => {
  const { locale, config } = useLocale();
  const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);
  
  const totalDeductions = payslipData.deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const netPay = payslipData.grossPay - totalDeductions;

  // Calculate YTD values
  const getCurrentPeriodNumber = () => {
    if (!payslipData.period) return 1;
    const [year, month] = payslipData.period.split('-');
    return parseInt(month);
  };

  const periodNumber = getCurrentPeriodNumber();
  
  // Use override values if available, otherwise calculate automatically
  const ytdValues = payslipData.ytdOverride || {
    grossPay: payslipData.grossPay * periodNumber,
    totalDeductions: totalDeductions * periodNumber,
    netPay: netPay * periodNumber
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payslip Preview</h2>
        <p className="text-gray-600">Review your payslip before saving</p>
      </div>

      {/* Compact Payslip Preview - Optimized for PDF */}
      <div 
        className="bg-white border border-gray-300 p-4 shadow-sm max-w-4xl mx-auto"
        data-payslip-preview
        style={{ fontSize: '12px', lineHeight: '1.3' }}
      >
        <PayslipHeader 
          companyLogo={payslipData.companyLogo}
          period={payslipData.period}
          locale={locale}
        />

        <CompactPaymentsDeductions 
          payslipData={payslipData}
          currency={config.currency}
        />

        <CompactSummary 
          payslipData={payslipData}
          currency={config.currency}
          ytdValues={ytdValues}
        />

        <CompactPayslipFooter payslipData={payslipData} />
      </div>

      <ExportActions 
        onExportClick={() => setIsExportOverlayOpen(true)}
        isParentMode={isParentMode}
      />

      {/* Export Overlay */}
      <ExportOverlay
        isOpen={isExportOverlayOpen}
        onClose={() => setIsExportOverlayOpen(false)}
        payslipData={payslipData}
      />
    </div>
  );
};
