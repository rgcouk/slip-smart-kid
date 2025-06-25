
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';

interface ExportActionsProps {
  onExportClick: () => void;
  isParentMode: boolean;
}

export const ExportActions = ({ onExportClick, isParentMode }: ExportActionsProps) => {
  return (
    <div className="space-y-3">
      <Button 
        onClick={onExportClick}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Share className="h-4 w-4 mr-2" />
        Export & Share
      </Button>

      {isParentMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">🎉 Great Job!</h3>
          <p className="text-sm text-green-700">
            You've created a professional payslip with company information and year-to-date tracking! 
            This shows how money flows and helps with financial planning and record keeping.
          </p>
        </div>
      )}
    </div>
  );
};
