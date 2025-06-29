
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface DownloadSectionProps {
  isDownloading: boolean;
  downloadStatus: 'idle' | 'success' | 'error';
  onDownload: () => void;
  progress?: number;
}

export const DownloadSection = ({
  isDownloading,
  downloadStatus,
  onDownload,
  progress = 0,
}: DownloadSectionProps) => {
  
  const handleDownloadClick = () => {
    console.log('🔘 Download button clicked');
    console.log('Current download status:', downloadStatus);
    console.log('Is downloading:', isDownloading);
    onDownload();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Download PDF</Label>
      
      {isDownloading && progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 text-center">
            Creating PDF... {progress}%
          </p>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <Button
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className="flex-1 touch-target-48"
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
      
      <p className="text-xs text-gray-500">
        ⚡ Instant generation - no server required!
      </p>
    </div>
  );
};
