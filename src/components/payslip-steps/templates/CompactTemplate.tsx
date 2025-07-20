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

  // Calculate missing YTD values from deductions
  const calculateYTDValues = () => {
    const taxDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('tax')) || {};
    const niDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('national insurance')) || {};
    
    return {
      tax: taxDeduction.amount || 0,
      employeeNI: niDeduction.amount || 0,
      employerNI: (payslipData.grossPay || 0) * 0.138
    };
  };

  const calculatedYTD = calculateYTDValues();

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
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Employee Details</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', height: '120px' }}>
              <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
                <div>Works number: {payslipData.payrollNumber || 'N/A'}</div>
                <div>Department: {payslipData.department || payslipData.position || 'N/A'}</div>
                <div>Tax code: {payslipData.taxCode || 'N/A'}</div>
                <div>National Insurance number: {payslipData.niNumber || 'N/A'}</div>
                <div>National Insurance table: {payslipData.niCategory || 'A'}</div>
                <div>Annual leave remaining: {payslipData.annualLeave || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Payments</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', height: '120px', position: 'relative' }}>
              <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
                {payslipData.paymentEntries?.map((entry: any, index: number) => (
                  <div key={entry.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>{entry.description}</span>
                    <span>{currency}{entry.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', borderTop: '1px solid #ccc', paddingTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Deductions</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', height: '120px', position: 'relative' }}>
              <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
                {payslipData.deductions?.map((deduction: any, index: number) => (
                  <div key={deduction.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>{deduction.name}</span>
                    <span>{currency}{deduction.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', borderTop: '1px solid #ccc', paddingTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{currency}{totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          {/* This Month */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>This Month</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', height: '100px' }}>
              <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxable gross pay</span>
                  <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Employer National Insurance</span>
                  <span>{currency}{(payslipData.grossPay * 0.138)?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px', fontWeight: 'bold' }}>
                  <span>Net pay</span>
                  <span>{currency}{netPay?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Year to Date</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', height: '100px' }}>
              <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxable gross pay</span>
                  <span>{currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax</span>
                  <span>{currency}{calculatedYTD.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Employee National Insurance</span>
                  <span>{currency}{calculatedYTD.employeeNI?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Employer National Insurance</span>
                  <span>{currency}{calculatedYTD.employerNI?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Payment</h3>
            <div style={{ border: '1px solid #ccc', padding: '20px', backgroundColor: '#f9f9f9', textAlign: 'center', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
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
          <div>
            <h3 className="text-sm font-semibold mb-1">Employee Details</h3>
            <div className="border border-border p-3 bg-muted/30 h-32">
              <div className="text-xs space-y-1">
                <div>Works number: {payslipData.payrollNumber || 'N/A'}</div>
                <div>Department: {payslipData.department || payslipData.position || 'N/A'}</div>
                <div>Tax code: {payslipData.taxCode || 'N/A'}</div>
                <div>National Insurance number: {payslipData.niNumber || 'N/A'}</div>
                <div>National Insurance table: {payslipData.niCategory || 'A'}</div>
                <div>Annual leave remaining: {payslipData.annualLeave || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div>
            <h3 className="text-sm font-semibold mb-1">Payments</h3>
            <div className="border border-border p-3 bg-muted/30 h-32 relative">
              <div className="text-xs space-y-1">
                {payslipData.paymentEntries?.map((entry: any, index: number) => (
                  <div key={entry.id || index} className="flex justify-between">
                    <span>{entry.description}</span>
                    <span>{currency}{entry.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 left-3 right-3 border-t border-border pt-1 flex justify-between font-semibold">
                <span>Total</span>
                <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-sm font-semibold mb-1">Deductions</h3>
            <div className="border border-border p-3 bg-muted/30 h-32 relative">
              <div className="text-xs space-y-1">
                {payslipData.deductions?.map((deduction: any, index: number) => (
                  <div key={deduction.id || index} className="flex justify-between">
                    <span>{deduction.name}</span>
                    <span>{currency}{deduction.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 left-3 right-3 border-t border-border pt-1 flex justify-between font-semibold">
                <span>Total</span>
                <span>{currency}{totalDeductions?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* This Month */}
          <div>
            <h3 className="text-sm font-semibold mb-1">This Month</h3>
            <div className="border border-border p-3 bg-muted/30 h-26">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Taxable gross pay</span>
                  <span>{currency}{payslipData.grossPay?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employer National Insurance</span>
                  <span>{currency}{(payslipData.grossPay * 0.138)?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 mt-2 font-semibold">
                  <span>Net pay</span>
                  <span>{currency}{netPay?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div>
            <h3 className="text-sm font-semibold mb-1">Year to Date</h3>
            <div className="border border-border p-3 bg-muted/30 h-26">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Taxable gross pay</span>
                  <span>{currency}{ytdValues.grossPay?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currency}{calculatedYTD.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employee National Insurance</span>
                  <span>{currency}{calculatedYTD.employeeNI?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employer National Insurance</span>
                  <span>{currency}{calculatedYTD.employerNI?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-sm font-semibold mb-1">Payment</h3>
            <div className="border border-border p-5 bg-muted/30 h-26 flex flex-col justify-center text-center">
              <div className="text-3xl font-bold mb-2">
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