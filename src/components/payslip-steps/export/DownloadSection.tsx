
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface DownloadSectionProps {
  isDownloading: boolean;
  downloadStatus: 'idle' | 'success' | 'error';
  onDownload: () => void;
}

export const DownloadSection = ({
  isDownloading,
  downloadStatus,
  onDownload,
}: DownloadSectionProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Download PDF</Label>
      <div className="flex items-center gap-3">
        <Button
          onClick={onDownload}
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
  );
};
