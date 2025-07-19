
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { usePayslipCalculations } from '@/hooks/usePayslipCalculations';
import { useToast } from '@/hooks/use-toast';
import { generateClientPDF, generateClientPDFBlob, fallbackToPrint } from '@/utils/clientPdfGenerator';
import { PayslipHeader } from './preview/PayslipHeader';
import { CompanyEmployeeDetails } from './preview/CompanyEmployeeDetails';
import { PaymentsDeductionsSection } from './preview/PaymentsDeductionsSection';
import { SummarySection } from './preview/SummarySection';
import { PayslipFooter } from './preview/PayslipFooter';
import { ProfessionalPayslipTemplate } from './preview/ProfessionalPayslipTemplate';
import { getTemplateComponent } from './templates';
import { PreviewSection } from './export/PreviewSection';
import { DownloadSection } from './export/DownloadSection';
import { EmailSection } from './export/EmailSection';
import { Button } from '@/components/ui/button';

interface PreviewStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const PreviewStep = React.memo(({ payslipData, isParentMode, selectedChild }: PreviewStepProps) => {
  const { locale, config } = useLocale();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Use optimized calculations hook
  const { totalDeductions, netPay, ytdValues } = usePayslipCalculations(payslipData);

  // Memoize employee name for filename generation
  const employeeName = useMemo(() => payslipData?.name || 'Unknown', [payslipData?.name]);

  const generatePreview = useCallback(async () => {
    if (!payslipData) return;
    
    setIsGeneratingPreview(true);
    try {
      console.log('🔄 Generating client-side PDF preview for:', employeeName);
      const blob = await generateClientPDFBlob({ 
        payslipData, 
        currency: config.currency,
        onProgress: (progress) => setDownloadProgress(progress)
      });
      setPdfBlob(blob);
      setShowPreview(true);
      console.log('✅ Client-side preview generated successfully');
    } catch (error) {
      console.error('❌ Client-side PDF preview generation failed:', error);
      toast({
        title: "Preview Failed",
        description: "Failed to generate PDF preview. The payslip template may not be ready yet.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPreview(false);
      setDownloadProgress(0);
    }
  }, [payslipData, config.currency, employeeName, toast]);

  const handleDownload = useCallback(async () => {
    if (!payslipData) return;
    
    console.log('🚀 Client-side download handler called');
    console.log('Payslip data:', payslipData);
    console.log('Currency:', config.currency);
    
    setIsDownloading(true);
    setDownloadStatus('idle');
    setDownloadProgress(0);
    
    try {
      console.log('📥 Starting client-side PDF generation for download:', employeeName);
      
      await generateClientPDF({ 
        payslipData, 
        currency: config.currency,
        onProgress: (progress) => setDownloadProgress(progress)
      });
      
      console.log('✅ Client-side PDF download completed successfully');
      setDownloadStatus('success');
      toast({
        title: "Download Complete",
        description: "Your payslip PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('💥 Client-side PDF download failed:', error);
      setDownloadStatus('error');
      
      // Offer fallback to print
      toast({
        title: "Download Failed",
        description: "PDF generation failed. Would you like to print instead?",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              try {
                fallbackToPrint();
                toast({
                  title: "Print Dialog Opened",
                  description: "Use your browser's print dialog to save as PDF.",
                });
              } catch (printError) {
                console.error('Print fallback failed:', printError);
              }
            }}
          >
            Print Instead
          </Button>
        ),
      });
    } finally {
      console.log('🏁 Client-side download process finished');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [payslipData, config.currency, employeeName, toast]);

  const handleEmailSend = useCallback(async (emailData: { to: string; subject: string; message: string }) => {
    if (!payslipData) return;
    
    setIsEmailing(true);
    setEmailStatus('idle');
    
    try {
      console.log('Generating PDF for email to:', emailData.to);
      
      const pdfBlob = await generateClientPDFBlob({ 
        payslipData, 
        currency: config.currency 
      });
      const fileName = `payslip-${employeeName.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailStatus('success');
      toast({
        title: "PDF Ready",
        description: `Payslip PDF downloaded and ready to attach to your email to ${emailData.to}.`,
      });
    } catch (error) {
      console.error('Email preparation failed:', error);
      setEmailStatus('error');
      toast({
        title: "Email Preparation Failed",
        description: "Failed to prepare the payslip for email. Please try downloading instead.",
        variant: "destructive",
      });
    } finally {
      setIsEmailing(false);
    }
  }, [payslipData, config.currency, employeeName, toast]);

  // Auto-generate preview when component mounts
  useEffect(() => {
    console.log('📂 PreviewStep mounted, pdfBlob exists:', !!pdfBlob);
    if (!pdfBlob && payslipData) {
      // Add a small delay to ensure the payslip template is rendered
      const timeoutId = setTimeout(() => {
        generatePreview();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pdfBlob, payslipData, generatePreview]);

  // Determine which template to render using the new template system
  const renderPayslipTemplate = () => {
    const templateId = payslipData.template || 'default';
    const TemplateComponent = getTemplateComponent(templateId);
    
    return (
      <TemplateComponent
        payslipData={payslipData}
        currency={config.currency}
        ytdValues={ytdValues}
        totalDeductions={totalDeductions}
        netPay={netPay}
        isParentMode={isParentMode}
        selectedChild={selectedChild}
        locale={locale}
      />
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Preview & Export</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Review your {payslipData.template === 'professional' ? 'professional' : 'default'} payslip and download or share it
        </p>
      </div>

      {/* Template-based Payslip Preview */}
      {renderPayslipTemplate()}

      {/* Export Actions */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PreviewSection
            isGeneratingPreview={isGeneratingPreview}
            showPreview={showPreview}
            pdfBlob={pdfBlob}
            onGeneratePreview={generatePreview}
            progress={downloadProgress}
          />

          <DownloadSection
            isDownloading={isDownloading}
            downloadStatus={downloadStatus}
            onDownload={handleDownload}
            progress={downloadProgress}
          />

          <EmailSection
            isEmailSending={isEmailing}
            emailStatus={emailStatus}
            onSendEmail={handleEmailSend}
          />
        </div>

        <div className="mt-6 text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
          <strong>✨ Improved PDF Generation:</strong> Now powered by client-side technology for instant, reliable PDF creation that works offline and on mobile devices.
        </div>

        {isParentMode && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">🎉 Great Job!</h3>
            <p className="text-sm text-green-700">
              You've created a professional payslip with company information and year-to-date tracking! 
              This shows how money flows and helps with financial planning and record keeping.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

PreviewStep.displayName = 'PreviewStep';
