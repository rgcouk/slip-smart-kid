
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
    // Use employee's default salary for basic salary if available
    const defaultSalary = payslipData.paymentEntries.find(entry => entry.description === 'Basic Salary')?.amount || 
                         payslipData.grossPay || 0;
    
    const newEntry = {
      id: Date.now().toString(),
      description: template === 'basic' ? 'Basic Salary' : 
                  template === 'hourly' ? 'Hourly Pay' :
                  template === 'overtime' ? 'Overtime Pay' : 'Performance Bonus',
      type: template === 'hourly' || template === 'overtime' ? 'hourly' as const : 'fixed' as const,
      quantity: template === 'hourly' ? (payslipData.contractualHours || 40) : 
                template === 'overtime' ? 8 : undefined,
      rate: template === 'hourly' ? (payslipData.hourlyRate || 15) : 
            template === 'overtime' ? ((payslipData.hourlyRate || 15) * 1.5) : undefined,
      amount: template === 'basic' ? defaultSalary : 
              template === 'hourly' ? ((payslipData.hourlyRate || 15) * (payslipData.contractualHours || 40)) :
              template === 'overtime' ? (((payslipData.hourlyRate || 15) * 1.5) * 8) : 500
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Earnings</h2>
        <p className="text-gray-600">Configure payment entries and earnings</p>
      </div>

      <div className="space-y-4">
        {/* Quick Template Buttons */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('basic')}
              className="h-12 text-sm border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Basic Salary
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('hourly')}
              className="h-12 text-sm border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Hourly Pay
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('overtime')}
              className="h-12 text-sm border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Overtime
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addTemplateEntry('bonus')}
              className="h-12 text-sm border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Bonus
            </Button>
          </div>
        </div>

        {/* Payment Entries with Collapsible Design */}
        <Collapsible open={entriesExpanded} onOpenChange={setEntriesExpanded}>
          <CollapsibleTrigger className="w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Payment Entries</h3>
                  <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full font-medium">
                    {payslipData.paymentEntries.length} entries
                  </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${entriesExpanded ? 'rotate-180' : ''}`} />
              </div>
              {!entriesExpanded && (
                <div className="mt-2 text-sm text-gray-600">
                  Total: £{totalEarnings.toFixed(2)}
                </div>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-2 shadow-sm">
              <PaymentEntriesSection 
                paymentEntries={payslipData.paymentEntries}
                onEntriesChange={(entries) => setPayslipData(prev => ({ ...prev, paymentEntries: entries }))}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Total Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-purple-800 text-lg">Total Gross Earnings:</span>
            <span className="text-2xl font-bold text-purple-900">
              £{totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Learning Moment */}
        {isParentMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-blue-800 font-medium mb-2">💡 Learning Moment</h3>
            <p className="text-blue-700 text-sm">
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
