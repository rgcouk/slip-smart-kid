
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { usePayslipHistory } from '@/hooks/usePayslipHistory';
import { format } from 'date-fns';

interface PreviousPayslipSelectorProps {
  employeeName: string;
  onYTDUpdate: (ytdValues: { grossPay: number; totalDeductions: number; netPay: number }) => void;
}

export const PreviousPayslipSelector = ({ employeeName, onYTDUpdate }: PreviousPayslipSelectorProps) => {
  const { config } = useLocale();
  const { 
    payslips, 
    ytdContributions, 
    isLoading, 
    addToYTD, 
    removeFromYTD, 
    calculateCumulativeYTD,
    clearYTD 
  } = usePayslipHistory(employeeName);

  // Update parent component when YTD contributions change
  React.useEffect(() => {
    const cumulativeYTD = calculateCumulativeYTD();
    onYTDUpdate(cumulativeYTD);
  }, [ytdContributions, onYTDUpdate]);

  if (!employeeName) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Select an employee to view their previous payslips</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Previous Payslips Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Previous Payslips for {employeeName}
          </CardTitle>
          <CardDescription>
            Select previous payslips to include in your Year-to-Date calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading previous payslips...
            </div>
          ) : payslips.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No previous payslips found for this employee
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {payslips.map((payslip) => {
                  const isAdded = ytdContributions.some(c => c.payslipId === payslip.id);
                  const totalDeductions = Array.isArray(payslip.deductions) 
                    ? payslip.deductions.reduce((sum, d) => sum + (d.amount || 0), 0)
                    : 0;
                  
                  return (
                    <div
                      key={payslip.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        isAdded ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {format(new Date(payslip.pay_period_start), 'MMM dd')} - {format(new Date(payslip.pay_period_end), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Gross: {config.currency}{payslip.gross_salary.toFixed(2)} | 
                          Deductions: {config.currency}{totalDeductions.toFixed(2)} | 
                          Net: {config.currency}{payslip.net_salary.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdded && <Badge variant="secondary" className="text-xs">Added</Badge>}
                        <Button
                          size="sm"
                          variant={isAdded ? "destructive" : "outline"}
                          onClick={() => isAdded ? removeFromYTD(payslip.id) : addToYTD(payslip)}
                        >
                          {isAdded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* YTD Contributions Summary */}
      {ytdContributions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                YTD Contributions Summary
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearYTD}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
            <CardDescription>
              {ytdContributions.length} payslip{ytdContributions.length !== 1 ? 's' : ''} contributing to YTD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ytdContributions.map((contribution) => (
                <div key={contribution.payslipId} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">
                      {format(new Date(contribution.periodStart), 'MMM dd')} - {format(new Date(contribution.periodEnd), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600">+{config.currency}{contribution.grossPay.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Total Gross Pay:</span>
                  <span className="text-green-600">{config.currency}{calculateCumulativeYTD().grossPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Deductions:</span>
                  <span className="text-red-600">{config.currency}{calculateCumulativeYTD().totalDeductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Net Pay:</span>
                  <span className="text-primary">{config.currency}{calculateCumulativeYTD().netPay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
