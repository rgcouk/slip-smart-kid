
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PayslipData } from '@/types/payslip';

interface PeriodSelectionStepProps {
  payslipData: PayslipData;
  setPayslipData: (data: PayslipData | ((prev: PayslipData) => PayslipData)) => void;
  isParentMode: boolean;
}

type FrequencyType = 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'custom';

export const PeriodSelectionStep = ({ payslipData, setPayslipData, isParentMode }: PeriodSelectionStepProps) => {
  const [frequency, setFrequency] = useState<FrequencyType>('monthly');

  const calculateDatesForFrequency = (freq: FrequencyType) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (freq) {
      case 'weekly':
        // Monday to Sunday of current week
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate = new Date(now);
        startDate.setDate(now.getDate() + mondayOffset);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;

      case 'bi-weekly':
        // Current 14-day period starting from Monday
        const currentMonday = new Date(now);
        const mondayOffset2 = now.getDay() === 0 ? -6 : 1 - now.getDay();
        currentMonday.setDate(now.getDate() + mondayOffset2);
        startDate = currentMonday;
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 13);
        break;

      case 'monthly':
        // First to last day of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;

      case 'quarterly':
        // Current quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;

      default:
        return;
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    setPayslipData(prev => ({
      ...prev,
      payPeriodStart: formatDate(startDate),
      payPeriodEnd: formatDate(endDate),
      period: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`
    }));
  };

  const setPresetDates = (preset: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (preset) {
      case 'lastWeek':
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - 7 - (now.getDay() === 0 ? 6 : now.getDay() - 1));
        startDate = lastWeekStart;
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;

      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;

      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;

      case 'customQuarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;

      default:
        return;
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    setPayslipData(prev => ({
      ...prev,
      payPeriodStart: formatDate(startDate),
      payPeriodEnd: formatDate(endDate),
      period: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`
    }));
  };

  useEffect(() => {
    if (frequency !== 'custom') {
      calculateDatesForFrequency(frequency);
    }
  }, [frequency]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pay Period</h2>
        <p className="text-gray-600">Select your pay frequency and period dates</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Pay Frequency</Label>
          <RadioGroup value={frequency} onValueChange={(value: FrequencyType) => setFrequency(value)}>
            <div className="flex items-center space-x-2 min-h-[48px]">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="cursor-pointer">Weekly (Monday - Sunday)</Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[48px]">
              <RadioGroupItem value="bi-weekly" id="bi-weekly" />
              <Label htmlFor="bi-weekly" className="cursor-pointer">Bi-weekly (14 days)</Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[48px]">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="cursor-pointer">Monthly (Full month)</Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[48px]">
              <RadioGroupItem value="quarterly" id="quarterly" />
              <Label htmlFor="quarterly" className="cursor-pointer">Quarterly (3 months)</Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[48px]">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">Custom dates</Label>
            </div>
          </RadioGroup>
        </div>

        {frequency === 'custom' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPresetDates('lastWeek')}
                className="min-h-[48px]"
              >
                Last Week
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPresetDates('thisMonth')}
                className="min-h-[48px]"
              >
                This Month
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPresetDates('lastMonth')}
                className="min-h-[48px]"
              >
                Last Month
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPresetDates('customQuarter')}
                className="min-h-[48px]"
              >
                Custom Quarter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payPeriodStart">Start Date *</Label>
                <Input
                  id="payPeriodStart"
                  type="date"
                  value={payslipData.payPeriodStart || ''}
                  onChange={(e) => setPayslipData(prev => ({ ...prev, payPeriodStart: e.target.value }))}
                  className="h-10 rounded-lg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="payPeriodEnd">End Date *</Label>
                <Input
                  id="payPeriodEnd"
                  type="date"
                  value={payslipData.payPeriodEnd || ''}
                  onChange={(e) => setPayslipData(prev => ({ ...prev, payPeriodEnd: e.target.value }))}
                  className="h-10 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {payslipData.payPeriodStart && payslipData.payPeriodEnd && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800">Selected Period:</span>
              <span className="text-blue-900">
                {new Date(payslipData.payPeriodStart).toLocaleDateString()} - {new Date(payslipData.payPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {isParentMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium mb-2">💡 Learning Moment</h3>
            <p className="text-blue-700 text-sm">
              Different businesses pay their employees at different frequencies. Weekly means every week, 
              bi-weekly is every two weeks, monthly is once per month, and quarterly is every three months. 
              The pay period shows exactly which days the employee worked to earn this payslip.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
