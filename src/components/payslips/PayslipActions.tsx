
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Edit, Download, Copy, Trash, MoreHorizontal, Eye } from 'lucide-react';
import { generatePayslipPDF } from '@/utils/pdfGenerator';
import { useLocale } from '@/hooks/useLocale';

interface PayslipActionsProps {
  payslip: {
    id: string;
    employee_name: string;
    company_name: string;
    pay_period_start: string;
    pay_period_end: string;
    gross_salary: number;
    net_salary: number;
    deductions: Array<{ id: string; name: string; amount: number }>;
  };
  onRefresh: () => void;
}

export const PayslipActions = ({ payslip, onRefresh }: PayslipActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { config } = useLocale();

  const handleEdit = () => {
    // Store payslip data in localStorage for editing
    localStorage.setItem('editPayslipData', JSON.stringify({
      ...payslip,
      period: `${payslip.pay_period_start.substring(0, 7)}`, // Convert to YYYY-MM format
      grossPay: payslip.gross_salary,
      companyName: payslip.company_name,
      name: payslip.employee_name,
      deductions: payslip.deductions || []
    }));
    
    // Navigate to the app with edit mode
    window.location.href = `/app?edit=${payslip.id}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Convert payslip data to the format expected by PDF generator
      const payslipData = {
        name: payslip.employee_name,
        period: `${payslip.pay_period_start.substring(0, 7)}`,
        grossPay: payslip.gross_salary,
        companyName: payslip.company_name,
        deductions: payslip.deductions || [],
        // Add mock company details for PDF generation
        companyAddress: "123 Business Street, Business City, BC1 2BC",
        companyPhone: "+44 123 456 7890",
        companyEmail: "info@company.com"
      };

      await generatePayslipPDF(payslipData, config.currency);
      
      toast({
        title: "Success",
        description: "Payslip downloaded successfully",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Error",
        description: "Failed to download payslip",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDuplicate = () => {
    // Store payslip data for duplication
    localStorage.setItem('duplicatePayslipData', JSON.stringify({
      ...payslip,
      period: `${payslip.pay_period_start.substring(0, 7)}`,
      grossPay: payslip.gross_salary,
      companyName: payslip.company_name,
      name: payslip.employee_name,
      deductions: payslip.deductions || []
    }));
    
    window.location.href = `/app?duplicate=${payslip.id}`;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('payslips')
        .delete()
        .eq('id', payslip.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payslip deleted successfully",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete payslip",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payslip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the payslip for {payslip.employee_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
