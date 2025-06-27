
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { PaymentEntry } from '@/types/payslip';

interface PaymentEntriesSectionProps {
  paymentEntries: PaymentEntry[];
  onEntriesChange: (entries: PaymentEntry[]) => void;
}

export const PaymentEntriesSection = ({ paymentEntries, onEntriesChange }: PaymentEntriesSectionProps) => {
  const addPaymentEntry = () => {
    const newEntry: PaymentEntry = {
      id: Date.now().toString(),
      description: '',
      type: 'fixed',
      amount: 0
    };
    onEntriesChange([...paymentEntries, newEntry]);
  };

  const removePaymentEntry = (id: string) => {
    if (paymentEntries.length > 1) {
      onEntriesChange(paymentEntries.filter(entry => entry.id !== id));
    }
  };

  const updatePaymentEntry = (id: string, updates: Partial<PaymentEntry>) => {
    onEntriesChange(paymentEntries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, ...updates };
        
        // Calculate amount for hourly entries
        if (updatedEntry.type === 'hourly' && updatedEntry.quantity && updatedEntry.rate) {
          updatedEntry.amount = updatedEntry.quantity * updatedEntry.rate;
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Payment Entries</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addPaymentEntry}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="space-y-3">
        {paymentEntries.map((entry, index) => (
          <div key={entry.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Entry {index + 1}</span>
              {paymentEntries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePaymentEntry(entry.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`description-${entry.id}`}>Description *</Label>
                <Input
                  id={`description-${entry.id}`}
                  value={entry.description}
                  onChange={(e) => updatePaymentEntry(entry.id, { description: e.target.value })}
                  placeholder="e.g., Basic Salary, Overtime, Bonus"
                  required
                />
              </div>

              <div>
                <Label htmlFor={`type-${entry.id}`}>Type</Label>
                <Select 
                  value={entry.type} 
                  onValueChange={(value: 'hourly' | 'fixed' | 'overtime' | 'bonus') => 
                    updatePaymentEntry(entry.id, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="overtime">Overtime</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {entry.type === 'hourly' || entry.type === 'overtime' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`quantity-${entry.id}`}>Hours</Label>
                  <Input
                    id={`quantity-${entry.id}`}
                    type="number"
                    step="0.5"
                    min="0"
                    value={entry.quantity || ''}
                    onChange={(e) => updatePaymentEntry(entry.id, { quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="40"
                  />
                </div>
                <div>
                  <Label htmlFor={`rate-${entry.id}`}>Rate/Hour (£)</Label>
                  <Input
                    id={`rate-${entry.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={entry.rate || ''}
                    onChange={(e) => updatePaymentEntry(entry.id, { rate: parseFloat(e.target.value) || 0 })}
                    placeholder="15.00"
                  />
                </div>
                <div>
                  <Label htmlFor={`amount-${entry.id}`}>Total Amount (£)</Label>
                  <Input
                    id={`amount-${entry.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={entry.amount.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor={`amount-${entry.id}`}>Amount (£) *</Label>
                <Input
                  id={`amount-${entry.id}`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={entry.amount || ''}
                  onChange={(e) => updatePaymentEntry(entry.id, { amount: parseFloat(e.target.value) || 0 })}
                  placeholder="3000.00"
                  required
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Add multiple payment entries to break down salary components like basic pay, overtime, bonuses, etc.
      </div>
    </div>
  );
};
