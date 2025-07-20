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

  // Use YTD override values if available, otherwise calculate from current deductions
  const calculateYTDValues = () => {
    if (payslipData.ytdOverride) {
      // Use the YTD override values for calculations
      const ytdTotalDeductions = payslipData.ytdOverride.totalDeductions || 0;
      const taxDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('tax')) || {};
      const niDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('national insurance')) || {};
      
      // For YTD, we need to calculate cumulative values, not just current month
      return {
        tax: ytdTotalDeductions > 0 ? (taxDeduction.amount || 0) : 0,
        employeeNI: ytdTotalDeductions > 0 ? (niDeduction.amount || 0) : 0,
        employerNI: (payslipData.ytdOverride.grossPay || 0) * 0.1325 // Correct employer NI rate
      };
    } else {
      // Fall back to current payslip deductions
      const taxDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('tax')) || {};
      const niDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('national insurance')) || {};
      
      return {
        tax: taxDeduction.amount || 0,
        employeeNI: niDeduction.amount || 0,
        employerNI: (payslipData.grossPay || 0) * 0.1325 // Correct employer NI rate
      };
    }
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
          padding: '40px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          lineHeight: '1.4',
          color: '#000'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'normal', margin: '0', fontFamily: 'Arial, sans-serif' }}>
              {payslipData.name || 'Employee Name'} <span style={{ fontWeight: 'normal', color: '#666' }}>{formatPeriod(payslipData.payPeriodStart, payslipData.payPeriodEnd)}</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>{payslipData.companyName || 'Sample Company'}</div>
          </div>
        </div>

        {/* Top Section - 3 Columns */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          {/* Employee Details */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Employee Details</h3>
            <div style={{ border: '1px solid #999', padding: '12px', backgroundColor: '#f5f5f5', minHeight: '140px' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Works number</span>
                  <span style={{ fontWeight: 'bold' }}>{payslipData.payrollNumber || '861'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Tax code</span>
                  <span style={{ fontWeight: 'bold' }}>{payslipData.taxCode || '1257L'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>National Insurance number</span>
                  <span style={{ fontWeight: 'bold' }}>{payslipData.niNumber || 'AB 12 34 56 D'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>National Insurance table</span>
                  <span style={{ fontWeight: 'bold' }}>{payslipData.niCategory || 'A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Annual leave remaining</span>
                  <span style={{ fontWeight: 'bold' }}>N/A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Payments</h3>
            <div style={{ border: '1px solid #999', padding: '12px', backgroundColor: '#f5f5f5', minHeight: '140px', position: 'relative' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                {payslipData.paymentEntries?.map((entry: any, index: number) => (
                  <div key={entry.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>{entry.description || 'Monthly pay'}</span>
                    <span style={{ fontWeight: 'bold' }}>£{entry.amount?.toFixed(2) || '2,000.00'}</span>
                  </div>
                ))}
                {(!payslipData.paymentEntries || payslipData.paymentEntries.length === 0) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Monthly pay</span>
                    <span style={{ fontWeight: 'bold' }}>£{payslipData.grossPay?.toFixed(2) || '2,000.00'}</span>
                  </div>
                )}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', borderTop: '1px solid #999', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px' }}>
                <span>Total</span>
                <span>£{payslipData.grossPay?.toFixed(2) || '2,000.00'}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Deductions</h3>
            <div style={{ border: '1px solid #999', padding: '12px', backgroundColor: '#f5f5f5', minHeight: '140px', position: 'relative' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                {payslipData.deductions?.map((deduction: any, index: number) => (
                  <div key={deduction.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>{deduction.name}</span>
                    <span style={{ fontWeight: 'bold' }}>£{deduction.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
                {(!payslipData.deductions || payslipData.deductions.length === 0) && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Tax</span>
                      <span style={{ fontWeight: 'bold' }}>£190.20</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>National Insurance</span>
                      <span style={{ fontWeight: 'bold' }}>£155.95</span>
                    </div>
                  </>
                )}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', borderTop: '1px solid #999', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px' }}>
                <span>Total</span>
                <span>£{totalDeductions?.toFixed(2) || '346.15'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          {/* This Month */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>This Month</h3>
            <div style={{ border: '1px solid #999', padding: '12px', backgroundColor: '#f5f5f5', minHeight: '120px' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Taxable gross pay</span>
                  <span style={{ fontWeight: 'bold' }}>£{payslipData.grossPay?.toFixed(2) || '2,000.00'}</span>
                </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                   <span>Employer National Insurance</span>
                   <span style={{ fontWeight: 'bold' }}>£{((payslipData.grossPay || 2000) * 0.1325)?.toFixed(2) || '186.92'}</span>
                 </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #999', paddingTop: '8px', marginTop: '8px', fontWeight: 'bold' }}>
                  <span>Net pay</span>
                  <span>£{netPay?.toFixed(2) || '1,653.85'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Year to Date</h3>
            <div style={{ border: '1px solid #999', padding: '12px', backgroundColor: '#f5f5f5', minHeight: '120px' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Taxable gross pay</span>
                  <span style={{ fontWeight: 'bold' }}>£{ytdValues.grossPay?.toFixed(2) || '2,000.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Tax</span>
                  <span style={{ fontWeight: 'bold' }}>£{calculatedYTD.tax?.toFixed(2) || '190.20'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Employee National Insurance</span>
                  <span style={{ fontWeight: 'bold' }}>£{calculatedYTD.employeeNI?.toFixed(2) || '155.95'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Employer National Insurance</span>
                  <span style={{ fontWeight: 'bold' }}>£{calculatedYTD.employerNI?.toFixed(2) || '186.92'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Payment</h3>
            <div style={{ border: '1px solid #999', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'Arial, sans-serif' }}>
                £{netPay?.toFixed(2) || '1,653.85'}
              </div>
              <div style={{ fontSize: '10px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                Paid {formatDate(payslipData.payPeriodEnd) || '30/04/2022'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #999', paddingTop: '15px', fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
          Employer PAYE Reference: {payslipData.companyRegistration || '123/AB123'}
        </div>
      </div>

        {/* Visible Display Version */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {isParentMode && selectedChild ? selectedChild.name : payslipData.name || payslipData.employeeName || 'Employee Name'} {formatPeriod(payslipData.payPeriodStart, payslipData.payPeriodEnd)}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">{payslipData.companyName || 'Company Name'}</div>
            </div>
          </div>

        {/* Top Section - 3 Columns */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Employee Details */}
          <CompactEmployeeDetails 
            payslipData={payslipData}
            isParentMode={isParentMode}
            selectedChild={selectedChild}
          />

          {/* Payments and Deductions */}
          <CompactPaymentsDeductions 
            payslipData={payslipData}
            currency={currency || '£'}
          />
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
                   <span>{currency}{(payslipData.grossPay * 0.1325)?.toFixed(2) || '0.00'}</span>
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