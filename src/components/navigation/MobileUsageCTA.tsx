
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const MobileUsageCTA = () => {
  return (
    <div className="border-t pt-4 mb-4">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Free Trial Usage</div>
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>3 of 3 payslips used</span>
          <span>7 days left</span>
        </div>
        <Progress value={100} className="h-2 mb-3" />
        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
          Upgrade Plan
        </Button>
      </div>
    </div>
  );
};
