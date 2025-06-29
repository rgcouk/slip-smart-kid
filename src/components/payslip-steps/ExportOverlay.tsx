
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateClientPDF, generateClientPDFBlob, fallbackToPrint } from '@/utils/clientPdfGenerator';
import { useLocale } from '@/hooks/useLocale';
import { PreviewSection } from './export/PreviewSection';
import { DownloadSection } from './export/DownloadSection';
import { EmailSection } from './export/EmailSection';

interface ExportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  payslipData: any;
}

export const ExportOverlay = React.memo(({ isOpen, onClose, payslipData }: ExportOverlayProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();
  const { config } = useLocale();

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

  const resetStatus = useCallback(() => {
    setEmailStatus('idle');
    setDownloadStatus('idle');
    setShowPreview(false);
    setPdfBlob(null);
    setDownloadProgress(0);
  }, []);

  const handleClose = useCallback(() => {
    resetStatus();
    onClose();
  }, [resetStatus, onClose]);

  // Auto-generate preview when overlay opens
  useEffect(() => {
    console.log('📂 ExportOverlay opened, isOpen:', isOpen, 'pdfBlob exists:', !!pdfBlob);
    if (isOpen && !pdfBlob && payslipData) {
      // Add a small delay to ensure the payslip template is rendered
      const timeoutId = setTimeout(() => {
        generatePreview();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, pdfBlob, payslipData, generatePreview]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="export-dialog-description">
        <DialogHeader>
          <DialogTitle>Export Payslip</DialogTitle>
          <DialogDescription id="export-dialog-description">
            Preview and export your payslip for {employeeName}. Generate and download your PDF instantly with our improved client-side generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
            <strong>✨ Improved PDF Generation:</strong> Now powered by client-side technology for instant, reliable PDF creation that works offline and on mobile devices.
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ExportOverlay.displayName = 'ExportOverlay';
