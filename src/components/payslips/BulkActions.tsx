
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash, Download, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  selectedPayslips: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export const BulkActions = ({ 
  selectedCount, 
  selectedPayslips, 
  onClearSelection, 
  onRefresh 
}: BulkActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('payslips')
        .delete()
        .in('id', selectedPayslips);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedCount} payslip${selectedCount > 1 ? 's' : ''} deleted successfully`,
      });
      
      onClearSelection();
      onRefresh();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete payslips",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkExport = async () => {
    setIsExporting(true);
    try {
      // Fetch the selected payslips data
      const { data, error } = await supabase
        .from('payslips')
        .select('*')
        .in('id', selectedPayslips);

      if (error) throw error;

      // Create CSV content
      const headers = [
        'Employee Name',
        'Company Name', 
        'Pay Period Start',
        'Pay Period End',
        'Gross Salary',
        'Net Salary',
        'Created Date'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(payslip => [
          `"${payslip.employee_name}"`,
          `"${payslip.company_name}"`,
          payslip.pay_period_start,
          payslip.pay_period_end,
          payslip.gross_salary,
          payslip.net_salary,
          new Date(payslip.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslips-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${selectedCount} payslip${selectedCount > 1 ? 's' : ''} exported successfully`,
      });
      
      onClearSelection();
    } catch (error) {
      console.error('Bulk export failed:', error);
      toast({
        title: "Error",
        description: "Failed to export payslips",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedCount} payslip{selectedCount > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Payslips</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} payslip{selectedCount > 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedCount} Payslip${selectedCount > 1 ? 's' : ''}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
