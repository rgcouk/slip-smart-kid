import React from 'react';
import { TemplateProps } from './index';
import { CompactEmployeeDetails } from '../preview/CompactEmployeeDetails';
import { CompactPaymentsDeductions } from '../preview/CompactPaymentsDeductions';
import { CompactSummary } from '../preview/CompactSummary';
import { CompactPayslipFooter } from '../preview/CompactPayslipFooter';

export const CompactTemplate: React.FC<TemplateProps> = ({ 
  payslipData, 
  currency, 
  ytdValues,
  totalDeductions,
  netPay,
  isParentMode = false,
  selectedChild,
  locale = 'en-GB'
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatPeriod = (start: string, end: string) => {
    if (!start || !end) return payslipData.period || '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `Month Ending ${endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mx-auto max-w-4xl">
      {/* Hidden PDF Template */}
      <div 
        className="fixed top-0 left-[-9999px]"
        data-payslip-preview
        style={{ 
          width: '794px',
          padding: '20px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          lineHeight: '1.3',
          color: '#000'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
              {payslipData.name || 'Employee Name'} {formatPeriod(payslipData.payPeriodStart, payslipData.payPeriodEnd)}
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{payslipData.companyName || 'Company Name'}</div>
          </div>
        </div>

        {/* Top Section - 3 Columns */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          {/* Employee Details */}
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f5f5f5', padding: '5px' }}>Employee Details</h3>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              <div>Employee ID: {payslipData.payrollNumber || 'N/A'}</div>
              <div>Tax Code: {payslipData.taxCode || 'N/A'}</div>
              <div>NI Number: {payslipData.niNumber || 'N/A'}</div>
              <div>NI Category: {payslipData.niCategory || 'A'}</div>
            </div>
          </div>

          {/* Payments */}
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f5f5f5', padding: '5px' }}>Payments</h3>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              {payslipData.paymentEntries?.map((entry: any, index: number) => (
                <div key={entry.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>{entry.description}</span>
                  <span>{currency}{entry.amount?.toFixed(2) || '0.00'}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f5f5f5', padding: '5px' }}>Deductions</h3>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              {payslipData.deductions?.map((deduction: any, index: number) => (
                <div key={deduction.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>{deduction.name}</span>
                  <span>{currency}{deduction.amount?.toFixed(2) || '0.00'}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{currency}{totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          {/* This Month */}
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f5f5f5', padding: '5px' }}>This Month</h3>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gross Pay:</span>
                <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Deductions:</span>
                <span>{currency}{totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px', fontWeight: 'bold' }}>
                <span>Net Pay:</span>
                <span>{currency}{netPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f5f5f5', padding: '5px' }}>Year to Date</h3>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gross Pay:</span>
                <span>{currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Deductions:</span>
                <span>{currency}{ytdValues.totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px', fontWeight: 'bold' }}>
                <span>Net Pay:</span>
                <span>{currency}{ytdValues.netPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f5f5f5', padding: '5px' }}>Payment</h3>
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {currency}{netPay?.toFixed(2) || '0.00'}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Paid {formatDate(payslipData.payPeriodEnd) || new Date().toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px', fontSize: '11px' }}>
          Employer PAYE Reference: {payslipData.companyRegistration || '123/AB123'}
        </div>
      </div>

      {/* Visible Display Version */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {payslipData.name || 'Employee Name'} {formatPeriod(payslipData.payPeriodStart, payslipData.payPeriodEnd)}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">{payslipData.companyName || 'Company Name'}</div>
          </div>
        </div>

        {/* Top Section - 3 Columns */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Employee Details */}
          <div className="border border-border p-3">
            <h3 className="text-sm font-semibold mb-2 bg-muted p-2 -mx-3 -mt-3 mb-3">Employee Details</h3>
            <div className="text-xs space-y-1">
              <div>Employee ID: {payslipData.payrollNumber || 'N/A'}</div>
              <div>Tax Code: {payslipData.taxCode || 'N/A'}</div>
              <div>NI Number: {payslipData.niNumber || 'N/A'}</div>
              <div>NI Category: {payslipData.niCategory || 'A'}</div>
            </div>
          </div>

          {/* Payments */}
          <div className="border border-border p-3">
            <h3 className="text-sm font-semibold mb-2 bg-muted p-2 -mx-3 -mt-3 mb-3">Payments</h3>
            <div className="text-xs space-y-1">
              {payslipData.paymentEntries?.map((entry: any, index: number) => (
                <div key={entry.id || index} className="flex justify-between">
                  <span>{entry.description}</span>
                  <span>{currency}{entry.amount?.toFixed(2) || '0.00'}</span>
                </div>
              ))}
              <div className="border-t border-border pt-1 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-border p-3">
            <h3 className="text-sm font-semibold mb-2 bg-muted p-2 -mx-3 -mt-3 mb-3">Deductions</h3>
            <div className="text-xs space-y-1">
              {payslipData.deductions?.map((deduction: any, index: number) => (
                <div key={deduction.id || index} className="flex justify-between">
                  <span>{deduction.name}</span>
                  <span>{currency}{deduction.amount?.toFixed(2) || '0.00'}</span>
                </div>
              ))}
              <div className="border-t border-border pt-1 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{currency}{totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* This Month */}
          <div className="border border-border p-3">
            <h3 className="text-sm font-semibold mb-2 bg-muted p-2 -mx-3 -mt-3 mb-3">This Month</h3>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Gross Pay:</span>
                <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions:</span>
                <span>{currency}{totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1 mt-2 font-semibold">
                <span>Net Pay:</span>
                <span>{currency}{netPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div className="border border-border p-3">
            <h3 className="text-sm font-semibold mb-2 bg-muted p-2 -mx-3 -mt-3 mb-3">Year to Date</h3>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Gross Pay:</span>
                <span>{currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions:</span>
                <span>{currency}{ytdValues.totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1 mt-2 font-semibold">
                <span>Net Pay:</span>
                <span>{currency}{ytdValues.netPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="border border-border p-3">
            <h3 className="text-sm font-semibold mb-2 bg-muted p-2 -mx-3 -mt-3 mb-3">Payment</h3>
            <div className="text-center pt-4">
              <div className="text-2xl font-bold mb-2">
                {currency}{netPay?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-muted-foreground">
                Paid {formatDate(payslipData.payPeriodEnd) || new Date().toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-3 text-xs text-muted-foreground">
          Employer PAYE Reference: {payslipData.companyRegistration || '123/AB123'}
        </div>
      </div>
    </div>
  );
};