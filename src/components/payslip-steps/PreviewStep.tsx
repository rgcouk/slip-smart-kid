
import React, { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { usePayslipCalculations } from '@/hooks/usePayslipCalculations';
import { ExportOverlay } from './ExportOverlay';
import { PayslipHeader } from './preview/PayslipHeader';
import { CompanyEmployeeDetails } from './preview/CompanyEmployeeDetails';
import { PaymentsDeductionsSection } from './preview/PaymentsDeductionsSection';
import { SummarySection } from './preview/SummarySection';
import { PayslipFooter } from './preview/PayslipFooter';
import { ExportActions } from './preview/ExportActions';
import { ProfessionalPayslipTemplate } from './preview/ProfessionalPayslipTemplate';

interface PreviewStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const PreviewStep = React.memo(({ payslipData, isParentMode, selectedChild }: PreviewStepProps) => {
  const { locale, config } = useLocale();
  const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);
  
  // Use optimized calculations hook
  const { totalDeductions, netPay, ytdValues } = usePayslipCalculations(payslipData);

  // Determine which template to render
  const renderPayslipTemplate = () => {
    if (payslipData.template === 'professional') {
      return (
        <ProfessionalPayslipTemplate
          payslipData={payslipData}
          currency={config.currency}
          ytdValues={ytdValues}
          totalDeductions={totalDeductions}
          netPay={netPay}
        />
      );
    }

    // Default template (current design)
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 sm:p-6 mx-auto max-w-4xl">
        <PayslipHeader 
          period={payslipData.period}
          locale={locale}
        />

        <CompanyEmployeeDetails 
          payslipData={payslipData}
          isParentMode={isParentMode}
          selectedChild={selectedChild}
        />

        <PaymentsDeductionsSection 
          payslipData={payslipData}
          currency={config.currency}
          ytdValues={ytdValues}
        />

        <SummarySection 
          payslipData={payslipData}
          currency={config.currency}
          ytdValues={ytdValues}
        />

        <PayslipFooter />
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Payslip Preview</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Review your {payslipData.template === 'professional' ? 'professional' : 'default'} payslip before export
        </p>
      </div>

      {/* Template-based Payslip Preview */}
      {renderPayslipTemplate()}

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
});

PreviewStep.displayName = 'PreviewStep';
