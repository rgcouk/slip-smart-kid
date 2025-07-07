import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
export const MobileUsageCTA = () => {
  return <div className="mb-4">
      <div className="bg-gradient-to-r from-lime-50 to-green-50 p-4 rounded-lg border border-lime-200 bg-[#388aa7]">
        <div className="text-sm font-medium text-gray-700 mb-2">Free Trial Usage</div>
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>3 of 3 payslips used</span>
          <span>7 days left</span>
        </div>
        <Progress value={100} className="h-2 mb-3" />
        <Button size="sm" className="w-full bg-lime-800 hover:bg-lime-700 rounded">
          Upgrade Plan
        </Button>
      </div>
    </div>;
};