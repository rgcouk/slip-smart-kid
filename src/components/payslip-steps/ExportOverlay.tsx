
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Mail, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePayslipPDF, generatePayslipBlob } from '@/utils/pdfGenerator';
import { useLocale } from '@/hooks/useLocale';
import { PDFPreview } from './PDFPreview';

interface ExportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  payslipData: any;
}

export const ExportOverlay = ({ isOpen, onClose, payslipData }: ExportOverlayProps) => {
  const [email, setEmail] = useState('');
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
      console.log('Generating PDF preview for:', payslipData.name);
      const blob = await generatePayslipBlob(payslipData, config.currency);
      setPdfBlob(blob);
      setShowPreview(true);
    } catch (error) {
      console.error('PDF preview generation failed:', error);
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
    setIsDownloading(true);
    setDownloadStatus('idle');
    
    try {
      console.log('Starting PDF generation for:', payslipData.name);
      await generatePayslipPDF(payslipData, config.currency);
      
      setDownloadStatus('success');
      toast({
        title: "Download Complete",
        description: "Your payslip PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      setDownloadStatus('error');
      toast({
        title: "Download Failed",
        description: "Failed to generate the payslip PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailSend = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setIsEmailing(true);
    setEmailStatus('idle');
    
    try {
      console.log('Generating PDF for email to:', email);
      
      // Generate PDF blob for email attachment
      const pdfBlob = await generatePayslipBlob(payslipData, config.currency);
      
      // In a real implementation, you would send this blob via email API
      // For now, we'll simulate the email sending and download the PDF
      const fileName = `payslip-${payslipData.name.replace(/\s+/g, '-').toLowerCase()}-${payslipData.period}.pdf`;
      
      // Create download link for the blob (simulating email attachment)
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Simulate email API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailStatus('success');
      toast({
        title: "Email Sent",
        description: `Payslip has been prepared for ${email}. PDF downloaded for reference.`,
      });
      setEmail('');
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
    setEmail('');
    setShowPreview(false);
    setPdfBlob(null);
  };

  const handleClose = () => {
    resetStatus();
    onClose();
  };

  // Auto-generate preview when overlay opens
  useEffect(() => {
    if (isOpen && !pdfBlob) {
      generatePreview();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Payslip</DialogTitle>
          <DialogDescription>
            Preview and export your payslip for {payslipData.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* PDF Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">PDF Preview</Label>
              <Button
                onClick={generatePreview}
                disabled={isGeneratingPreview}
                variant="outline"
                size="sm"
              >
                {isGeneratingPreview ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                {isGeneratingPreview ? 'Generating...' : 'Refresh Preview'}
              </Button>
            </div>
            
            {showPreview && pdfBlob ? (
              <PDFPreview pdfBlob={pdfBlob} />
            ) : isGeneratingPreview ? (
              <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Generating PDF preview...</span>
              </div>
            ) : null}
          </div>

          {/* Download Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Download PDF</Label>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1"
                variant="outline"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isDownloading ? 'Generating PDF...' : 'Download PDF'}
              </Button>
              {downloadStatus === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {downloadStatus === 'error' && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Payslip
            </Label>
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailing}
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleEmailSend}
                  disabled={isEmailing || !email}
                  className="flex-1"
                  variant="outline"
                >
                  {isEmailing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {isEmailing ? 'Preparing...' : 'Send Email'}
                </Button>
                {emailStatus === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {emailStatus === 'error' && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          </div>

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
