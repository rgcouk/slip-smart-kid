
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Info, History, Settings } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { PreviousPayslipSelector } from './PreviousPayslipSelector';

interface YTDStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const YTDStep = ({ payslipData, setPayslipData, isParentMode }: YTDStepProps) => {
  const { config } = useLocale();
  const [enableYTDOverride, setEnableYTDOverride] = useState(!!payslipData.ytdOverride);
  const [previousPayslipYTD, setPreviousPayslipYTD] = useState({ grossPay: 0, totalDeductions: 0, netPay: 0 });

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

  // Initialize YTD override with current payslip values when first enabled
  const initializeYTDOverride = () => {
    const initialValues = {
      grossPay: payslipData.grossPay || 0,
      totalDeductions: totalDeductions,
      netPay: netPay
    };
    
    setPayslipData({
      ...payslipData,
      ytdOverride: initialValues
    });
  };

  // Handle YTD toggle
  const handleYTDToggle = (checked: boolean) => {
    setEnableYTDOverride(checked);
    if (checked) {
      initializeYTDOverride();
    } else {
      setPayslipData({
        ...payslipData,
        ytdOverride: null
      });
    }
  };

  // Get current YTD values (either override or auto)
  const getCurrentYTD = () => {
    if (payslipData.ytdOverride) {
      return {
        grossPay: (payslipData.ytdOverride.grossPay || 0) + previousPayslipYTD.grossPay,
        totalDeductions: (payslipData.ytdOverride.totalDeductions || 0) + previousPayslipYTD.totalDeductions,
        netPay: (payslipData.ytdOverride.netPay || 0) + previousPayslipYTD.netPay
      };
    }
    return {
      grossPay: autoYTD.grossPay + previousPayslipYTD.grossPay,
      totalDeductions: autoYTD.totalDeductions + previousPayslipYTD.totalDeductions,
      netPay: autoYTD.netPay + previousPayslipYTD.netPay
    };
  };

  const currentYTD = getCurrentYTD();

  const updateYTDValue = (field: string, value: number) => {
    setPayslipData({
      ...payslipData,
      ytdOverride: {
        ...payslipData.ytdOverride,
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

  // Handle updates from previous payslip selector
  const handlePreviousPayslipYTDUpdate = (ytdValues: { grossPay: number; totalDeductions: number; netPay: number }) => {
    setPreviousPayslipYTD(ytdValues);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Year to Date Values</h2>
        <p className="text-gray-600">Configure your year-to-date figures and include previous payslips</p>
      </div>

      <Tabs defaultValue="ytd-settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ytd-settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            YTD Settings
          </TabsTrigger>
          <TabsTrigger value="previous-payslips" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Previous Payslips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ytd-settings" className="space-y-6">
          {/* YTD Override Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Year to Date Calculation
              </CardTitle>
              <CardDescription>
                By default, YTD values are calculated automatically. Enable manual override for custom values starting with current payslip figures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ytd-override"
                  checked={enableYTDOverride}
                  onCheckedChange={handleYTDToggle}
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
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={payslipData.ytdOverride?.grossPay || ''}
                      onChange={(e) => updateYTDValue('grossPay', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                    {previousPayslipYTD.grossPay > 0 && (
                      <div className="text-xs text-green-600">
                        + {config.currency}{previousPayslipYTD.grossPay.toFixed(2)} from previous payslips
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {config.currency}{currentYTD.grossPay.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {config.currency}{autoYTD.grossPay.toFixed(2)}
                      {previousPayslipYTD.grossPay > 0 && (
                        <>
                          <br />+ Previous: {config.currency}{previousPayslipYTD.grossPay.toFixed(2)}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Deductions YTD</CardTitle>
              </CardHeader>
              <CardContent>
                {enableYTDOverride ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={payslipData.ytdOverride?.totalDeductions || ''}
                      onChange={(e) => updateYTDValue('totalDeductions', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                    {previousPayslipYTD.totalDeductions > 0 && (
                      <div className="text-xs text-red-600">
                        + {config.currency}{previousPayslipYTD.totalDeductions.toFixed(2)} from previous payslips
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {config.currency}{currentYTD.totalDeductions.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {config.currency}{autoYTD.totalDeductions.toFixed(2)}
                      {previousPayslipYTD.totalDeductions > 0 && (
                        <>
                          <br />+ Previous: {config.currency}{previousPayslipYTD.totalDeductions.toFixed(2)}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Net Pay YTD</CardTitle>
              </CardHeader>
              <CardContent>
                {enableYTDOverride ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={payslipData.ytdOverride?.netPay || ''}
                      onChange={(e) => updateYTDValue('netPay', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                    {previousPayslipYTD.netPay > 0 && (
                      <div className="text-xs text-blue-600">
                        + {config.currency}{previousPayslipYTD.netPay.toFixed(2)} from previous payslips
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {config.currency}{currentYTD.netPay.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {config.currency}{autoYTD.netPay.toFixed(2)}
                      {previousPayslipYTD.netPay > 0 && (
                        <>
                          <br />+ Previous: {config.currency}{previousPayslipYTD.netPay.toFixed(2)}
                        </>
                      )}
                    </p>
                  </div>
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
                    Enter your year-to-date values starting with the current payslip. Values from previous payslips (if selected) will be added automatically.
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
                You can include previous payslips to build accurate YTD totals throughout the year!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="previous-payslips" className="space-y-6">
          <PreviousPayslipSelector
            employeeName={payslipData.name || payslipData.employeeName || ''}
            onYTDUpdate={handlePreviousPayslipYTDUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
