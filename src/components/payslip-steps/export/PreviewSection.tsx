
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, Eye } from 'lucide-react';
import { PDFPreview } from '../PDFPreview';

interface PreviewSectionProps {
  isGeneratingPreview: boolean;
  showPreview: boolean;
  pdfBlob: Blob | null;
  onGeneratePreview: () => void;
  progress?: number;
}

export const PreviewSection = ({
  isGeneratingPreview,
  showPreview,
  pdfBlob,
  onGeneratePreview,
  progress = 0,
}: PreviewSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">PDF Preview</Label>
        <Button
          onClick={onGeneratePreview}
          disabled={isGeneratingPreview}
          variant="outline"
          size="sm"
          className="touch-target-48"
        >
          {isGeneratingPreview ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Eye className="h-3 w-3 mr-1" />
          )}
          {isGeneratingPreview ? 'Generating...' : 'Refresh Preview'}
        </Button>
      </div>
      
      {isGeneratingPreview && progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 text-center">
            Generating PDF... {progress}%
          </p>
        </div>
      )}
      
      {showPreview && pdfBlob ? (
        <PDFPreview pdfBlob={pdfBlob} />
      ) : isGeneratingPreview ? (
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Generating PDF preview...</span>
        </div>
      ) : null}
    </div>
  );
};
