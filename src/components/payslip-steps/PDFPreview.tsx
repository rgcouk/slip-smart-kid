
import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFPreviewProps {
  pdfBlob: Blob | null;
  className?: string;
}

export const PDFPreview = ({ pdfBlob, className = '' }: PDFPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfBlob || !canvasRef.current) return;

    const renderPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (err) {
        console.error('PDF rendering error:', err);
        setError('Failed to render PDF preview');
      } finally {
        setIsLoading(false);
      }
    };

    renderPDF();
  }, [pdfBlob]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-100 rounded-lg ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Generating PDF preview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 bg-red-50 rounded-lg ${className}`}>
        <span className="text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
      <div className="text-center mb-2">
        <span className="text-sm text-gray-600">PDF Preview</span>
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 shadow-sm max-w-full h-auto"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </div>
  );
};
