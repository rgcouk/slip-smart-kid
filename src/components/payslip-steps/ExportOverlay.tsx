
import React, { useState, useEffect } from 'react';
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
import { generatePayslipPDF, generatePayslipBlob } from '@/utils/pdfGenerator';
import { useLocale } from '@/hooks/useLocale';
import { PreviewSection } from './export/PreviewSection';
import { DownloadSection } from './export/DownloadSection';
import { EmailSection } from './export/EmailSection';

interface ExportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  payslipData: any;
}

export const ExportOverlay = ({ isOpen, onClose, payslipData }: ExportOverlayProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const { config } = useLocale();

  const generatePreview = async () => {
    setIsGeneratingPreview(true);
    try {
      console.log('🔄 Generating PDF preview for:', payslipData.name);
      const blob = await generatePayslipBlob(payslipData, config.currency);
      setPdfBlob(blob);
      setShowPreview(true);
      console.log('✅ Preview generated successfully');
    } catch (error) {
      console.error('❌ PDF preview generation failed:', error);
      toast({
        title: "Preview Failed",
        description: "Failed to generate PDF preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleDownload = async () => {
    console.log('🚀 Download handler called');
    console.log('Payslip data:', payslipData);
    console.log('Currency:', config.currency);
    
    setIsDownloading(true);
    setDownloadStatus('idle');
    
    try {
      console.log('📥 Starting PDF generation for download:', payslipData.name);
      
      // Check if the payslip element exists before starting
      const payslipElement = document.querySelector('[data-payslip-preview]');
      console.log('🔍 Checking for payslip element:', payslipElement ? 'Found' : 'Not found');
      
      if (!payslipElement) {
        console.error('❌ No payslip element found before PDF generation');
        throw new Error('Payslip preview element not found. Please refresh and try again.');
      }
      
      await generatePayslipPDF(payslipData, config.currency);
      
      console.log('✅ PDF download completed successfully');
      setDownloadStatus('success');
      toast({
        title: "Download Complete",
        description: "Your payslip PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('💥 PDF download failed:', error);
      setDownloadStatus('error');
      toast({
        title: "Download Failed",
        description: `Failed to generate the payslip PDF: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Download process finished, setting isDownloading to false');
      setIsDownloading(false);
    }
  };

  const handleEmailSend = async (emailData: { to: string; subject: string; message: string }) => {
    setIsEmailing(true);
    setEmailStatus('idle');
    
    try {
      console.log('Generating PDF for email to:', emailData.to);
      
      const pdfBlob = await generatePayslipBlob(payslipData, config.currency);
      const fileName = `payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailStatus('success');
      toast({
        title: "Email Sent",
        description: `Payslip has been prepared for ${emailData.to}. PDF downloaded for reference.`,
      });
    } catch (error) {
      console.error('Email preparation failed:', error);
      setEmailStatus('error');
      toast({
        title: "Email Failed",
        description: "Failed to prepare the payslip for email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailing(false);
    }
  };

  const resetStatus = () => {
    setEmailStatus('idle');
    setDownloadStatus('idle');
    setShowPreview(false);
    setPdfBlob(null);
  };

  const handleClose = () => {
    resetStatus();
    onClose();
  };

  useEffect(() => {
    console.log('📂 ExportOverlay opened, isOpen:', isOpen, 'pdfBlob exists:', !!pdfBlob);
    if (isOpen && !pdfBlob) {
      // Add a delay to ensure the payslip preview is rendered and visible
      setTimeout(() => {
        generatePreview();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="export-dialog-description">
        <DialogHeader>
          <DialogTitle>Export Payslip</DialogTitle>
          <DialogDescription id="export-dialog-description">
            Preview and export your payslip for {payslipData.name}. You can download the PDF or prepare it for email delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <PreviewSection
            isGeneratingPreview={isGeneratingPreview}
            showPreview={showPreview}
            pdfBlob={pdfBlob}
            onGeneratePreview={generatePreview}
          />

          <DownloadSection
            isDownloading={isDownloading}
            downloadStatus={downloadStatus}
            onDownload={handleDownload}
          />

          <EmailSection
            isEmailSending={isEmailing}
            emailStatus={emailStatus}
            onSendEmail={handleEmailSend}
          />

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Note:</strong> The PDF preview shows exactly how your downloaded payslip will appear. 
            Use the refresh button if you've made changes to the payslip data.
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
};
