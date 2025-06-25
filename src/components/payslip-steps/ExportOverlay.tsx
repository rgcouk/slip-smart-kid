
import React, { useState } from 'react';
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
import { Download, Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  payslipData: any;
}

export const ExportOverlay = ({ isOpen, onClose, payslipData }: ExportOverlayProps) => {
  const [email, setEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus('idle');
    
    try {
      // Simulate PDF generation and download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would generate and download the PDF here
      console.log('Downloading PDF for:', payslipData.name);
      
      setDownloadStatus('success');
      toast({
        title: "Download Complete",
        description: "Your payslip PDF has been downloaded successfully.",
      });
    } catch (error) {
      setDownloadStatus('error');
      toast({
        title: "Download Failed",
        description: "Failed to download the payslip. Please try again.",
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
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, you would send the email here
      console.log('Sending payslip to:', email);
      
      setEmailStatus('success');
      toast({
        title: "Email Sent",
        description: `Payslip has been sent to ${email} successfully.`,
      });
      setEmail('');
    } catch (error) {
      setEmailStatus('error');
      toast({
        title: "Email Failed",
        description: "Failed to send the payslip. Please try again.",
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
  };

  const handleClose = () => {
    resetStatus();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Payslip</DialogTitle>
          <DialogDescription>
            Download or share your payslip for {payslipData.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                {isDownloading ? 'Generating...' : 'Download PDF'}
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
                  {isEmailing ? 'Sending...' : 'Send Email'}
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
