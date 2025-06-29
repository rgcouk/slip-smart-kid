
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, GripVertical, Trash2 } from 'lucide-react';
import { PaymentEntriesSection } from './PaymentEntriesSection';
import { PayslipData } from '@/types/payslip';

interface BasicInfoStepProps {
  payslipData: PayslipData;
  setPayslipData: (data: PayslipData | ((prev: PayslipData) => PayslipData)) => void;
  isParentMode: boolean;
  selectedChild?: any;
}

export const BasicInfoStep = ({ payslipData, setPayslipData, isParentMode }: BasicInfoStepProps) => {
  const [entriesExpanded, setEntriesExpanded] = useState(true);

  const addTemplateEntry = (template: 'basic' | 'hourly' | 'overtime' | 'bonus') => {
    const newEntry = {
      id: Date.now().toString(),
      description: template === 'basic' ? 'Basic Salary' : 
                  template === 'hourly' ? 'Hourly Pay' :
                  template === 'overtime' ? 'Overtime Pay' : 'Performance Bonus',
      type: template === 'hourly' || template === 'overtime' ? 'hourly' as const : 'fixed' as const,
      quantity: template === 'hourly' ? 40 : template === 'overtime' ? 8 : undefined,
      rate: template === 'hourly' ? 15 : template === 'overtime' ? 22.5 : undefined,
      amount: template === 'basic' ? 3000 : 
              template === 'hourly' ? 600 :
              template === 'overtime' ? 180 : 500
    };

    setPayslipData(prev => ({
      ...prev,
      paymentEntries: [...prev.paymentEntries, newEntry]
    }));
  };

  const totalEarnings = payslipData.paymentEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Earnings</h2>
        <p className="text-slate-300">Configure payment entries and earnings</p>
      </div>

      <div className="space-y-4">
        {/* Quick Template Buttons */}
        <div className="metric-card">
          <h3 className="text-lg font-medium text-white mb-3">Quick Add Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('basic')}
              className="min-h-[48px] text-sm bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Basic Salary
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('hourly')}
              className="min-h-[48px] text-sm bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Hourly Pay
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('overtime')}
              className="min-h-[48px] text-sm bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Overtime
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('bonus')}
              className="min-h-[48px] text-sm bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Bonus
            </Button>
          </div>
        </div>

        {/* Payment Entries with Collapsible Design */}
        <Collapsible open={entriesExpanded} onOpenChange={setEntriesExpanded}>
          <CollapsibleTrigger className="w-full">
            <div className="metric-card hover:bg-card/90 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-slate-400" />
                  <h3 className="text-lg font-medium text-white">Payment Entries</h3>
                  <span className="bg-purple-500/20 text-purple-300 text-sm px-2 py-1 rounded-full">
                    {payslipData.paymentEntries.length} entries
                  </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${entriesExpanded ? 'rotate-180' : ''}`} />
              </div>
              {!entriesExpanded && (
                <div className="mt-2 text-sm text-slate-300">
                  Total: £{totalEarnings.toFixed(2)}
                </div>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="metric-card mt-2">
              <PaymentEntriesSection 
                paymentEntries={payslipData.paymentEntries}
                onEntriesChange={(entries) => setPayslipData(prev => ({ ...prev, paymentEntries: entries }))}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Total Summary */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-purple-200">Total Gross Earnings:</span>
            <span className="text-xl font-bold text-white">
              £{totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        {isParentMode && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-blue-200 font-medium mb-2">💡 Learning Moment</h3>
            <p className="text-blue-100 text-sm">
              Earnings are all the different ways someone gets paid at work. This includes their regular salary, 
              extra pay for working overtime, bonuses for good performance, and any other money they earn. 
              All these different types of payment are added together to get the "gross earnings" - 
              that's the total amount before any deductions are taken out.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
