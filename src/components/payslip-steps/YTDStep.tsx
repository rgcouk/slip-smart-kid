
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Info } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

interface YTDStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const YTDStep = ({ payslipData, setPayslipData, isParentMode }: YTDStepProps) => {
  const { config } = useLocale();
  const [enableYTDOverride, setEnableYTDOverride] = useState(!!payslipData.ytdOverride);

  // Calculate automatic YTD values
  const getCurrentPeriodNumber = () => {
    if (!payslipData.period) return 1;
    const [year, month] = payslipData.period.split('-');
    return parseInt(month);
  };

  const periodNumber = getCurrentPeriodNumber();
  const totalDeductions = payslipData.deductions?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;
  const netPay = (payslipData.grossPay || 0) - totalDeductions;

  const autoYTD = {
    grossPay: (payslipData.grossPay || 0) * periodNumber,
    totalDeductions: totalDeductions * periodNumber,
    netPay: netPay * periodNumber
  };

  const currentYTD = payslipData.ytdOverride || autoYTD;

  const updateYTDValue = (field: string, value: number) => {
    setPayslipData({
      ...payslipData,
      ytdOverride: {
        ...currentYTD,
        [field]: value
      }
    });
  };

  const resetToAutomatic = () => {
    setPayslipData({
      ...payslipData,
      ytdOverride: null
    });
    setEnableYTDOverride(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Year to Date Values</h2>
        <p className="text-gray-600">Configure your year-to-date figures</p>
      </div>

      {/* YTD Override Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Year to Date Calculation
          </CardTitle>
          <CardDescription>
            By default, YTD values are calculated automatically. Enable manual override if you have previous payslip data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="ytd-override"
              checked={enableYTDOverride}
              onCheckedChange={(checked) => {
                setEnableYTDOverride(checked);
                if (!checked) {
                  resetToAutomatic();
                }
              }}
            />
            <Label htmlFor="ytd-override">Enable manual YTD values</Label>
          </div>
        </CardContent>
      </Card>

      {/* YTD Values Display/Edit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Gross Pay YTD</CardTitle>
          </CardHeader>
          <CardContent>
            {enableYTDOverride ? (
              <Input
                type="number"
                value={currentYTD.grossPay || ''}
                onChange={(e) => updateYTDValue('grossPay', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {config.currency}{autoYTD.grossPay.toFixed(2)}
              </div>
            )}
             {!enableYTDOverride && (
               <p className="text-xs text-gray-500 mt-1">
                 Calculated: {config.currency}{(payslipData.grossPay || 0).toFixed(2)} × {periodNumber} months
               </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Deductions YTD</CardTitle>
          </CardHeader>
          <CardContent>
            {enableYTDOverride ? (
              <Input
                type="number"
                value={currentYTD.totalDeductions || ''}
                onChange={(e) => updateYTDValue('totalDeductions', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {config.currency}{autoYTD.totalDeductions.toFixed(2)}
              </div>
            )}
            {!enableYTDOverride && (
              <p className="text-xs text-gray-500 mt-1">
                Calculated: {config.currency}{totalDeductions.toFixed(2)} × {periodNumber} months
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Net Pay YTD</CardTitle>
          </CardHeader>
          <CardContent>
            {enableYTDOverride ? (
              <Input
                type="number"
                value={currentYTD.netPay || ''}
                onChange={(e) => updateYTDValue('netPay', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {config.currency}{autoYTD.netPay.toFixed(2)}
              </div>
            )}
            {!enableYTDOverride && (
              <p className="text-xs text-gray-500 mt-1">
                Calculated: {config.currency}{netPay.toFixed(2)} × {periodNumber} months
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {enableYTDOverride && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Manual YTD Values</h3>
              <p className="text-sm text-blue-700 mt-1">
                Enter your year-to-date values from your previous payslip. These will be used instead of automatic calculations.
              </p>
            </div>
          </div>
        </div>
      )}

      {isParentMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">💡 Learning Moment</h3>
          <p className="text-sm text-green-700">
            Year-to-Date (YTD) shows how much you've earned and paid in taxes from the beginning of the tax year. 
            It helps you track your total earnings and plan for the rest of the year!
          </p>
        </div>
      )}
    </div>
  );
};
