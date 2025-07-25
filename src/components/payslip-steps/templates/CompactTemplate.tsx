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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getWorkingDayDate = (paidDate?: string) => {
    const baseDate = paidDate ? new Date(paidDate) : new Date(payslipData.payPeriodEnd || new Date());
    const twoDaysAgo = new Date(baseDate);
    twoDaysAgo.setDate(baseDate.getDate() - 2);
    
    // If it's Saturday (6) or Sunday (0), move to Friday
    const dayOfWeek = twoDaysAgo.getDay();
    if (dayOfWeek === 6) { // Saturday
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 1); // Move to Friday
    } else if (dayOfWeek === 0) { // Sunday
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Move to Friday
    }
    
    return twoDaysAgo.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
        employeeNI: ytdTotalDeductions > 0 ? (niDeduction.amount || 0) : 0
      };
    } else {
      // Fall back to current payslip deductions
      const taxDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('tax')) || {};
      const niDeduction = payslipData.deductions?.find((d: any) => d.name?.toLowerCase().includes('national insurance')) || {};
      
      return {
        tax: taxDeduction.amount || 0,
        employeeNI: niDeduction.amount || 0
      };
    }
  };

  const calculatedYTD = calculateYTDValues();

  return (
    <div style={{ backgroundColor: '#e9ecef', padding: '20px', margin: '0 auto', maxWidth: '900px', fontFamily: 'Arial, sans-serif' }}>
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

        {/* Top Section - 3 Columns with blue-gray background */}
        <div style={{ backgroundColor: '#e6eaee', margin: '0 -40px', padding: '15px 40px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
           {/* Employee Details */}
           <div style={{ flex: '1' }}>
             <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Employee Details</h3>
             <div style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: 'white', minHeight: '140px' }}>
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
             <div style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: 'white', minHeight: '140px', position: 'relative' }}>
               <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                 {payslipData.paymentEntries?.map((entry: any, index: number) => (
                   <div key={entry.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                     <span>{entry.description || 'Monthly pay'}</span>
                     <span style={{ fontWeight: 'bold' }}>£{formatCurrency(entry.amount || 0)}</span>
                   </div>
                 ))}
                 {(!payslipData.paymentEntries || payslipData.paymentEntries.length === 0) && (
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                     <span>Monthly pay</span>
                     <span style={{ fontWeight: 'bold' }}>£{formatCurrency(payslipData.grossPay || 0)}</span>
                   </div>
                 )}
               </div>
               <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', borderTop: '1px solid #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px' }}>
                 <span>Total</span>
                 <span>£{formatCurrency(payslipData.grossPay || 0)}</span>
               </div>
             </div>
           </div>

           {/* Deductions */}
           <div style={{ flex: '1' }}>
             <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Deductions</h3>
             <div style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: 'white', minHeight: '140px', position: 'relative' }}>
               <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                 {payslipData.deductions?.map((deduction: any, index: number) => (
                   <div key={deduction.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                     <span>{deduction.name}</span>
                     <span style={{ fontWeight: 'bold' }}>£{formatCurrency(deduction.amount || 0)}</span>
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
               <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', borderTop: '1px solid #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px' }}>
                 <span>Total</span>
                 <span>£{formatCurrency(totalDeductions || 0)}</span>
               </div>
             </div>
           </div>
         </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          {/* This Month */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>This Month</h3>
            <div style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: 'white', minHeight: '120px' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Taxable gross pay</span>
                  <span style={{ fontWeight: 'bold' }}>£{formatCurrency(payslipData.grossPay || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '8px', fontWeight: 'bold' }}>
                  <span>Net pay</span>
                  <span>£{formatCurrency(netPay || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Year to Date</h3>
            <div style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: 'white', minHeight: '120px' }}>
              <div style={{ fontSize: '10px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Taxable gross pay</span>
                  <span style={{ fontWeight: 'bold' }}>£{formatCurrency(ytdValues.grossPay || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Tax</span>
                  <span style={{ fontWeight: 'bold' }}>£{formatCurrency(calculatedYTD.tax || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>Employee National Insurance</span>
                  <span style={{ fontWeight: 'bold' }}>£{formatCurrency(calculatedYTD.employeeNI || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ flex: '1' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif' }}>Payment</h3>
            <div style={{ border: '1px solid #ccc', padding: '20px', backgroundColor: 'white', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'Arial, sans-serif' }}>
                £{formatCurrency(netPay || 0)}
              </div>
              <div style={{ fontSize: '10px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                Paid {formatDate(payslipData.payPeriodEnd || payslipData.payDate) || formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
          Payment processed on {getWorkingDayDate(payslipData.payPeriodEnd || payslipData.payDate)} via {payslipData.paymentMethod || 'BACS'}
        </div>
      </div>

        {/* Visible Display Version */}
        <div style={{ padding: '25px', backgroundColor: 'white', fontFamily: 'Arial, sans-serif' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'normal', margin: '0', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                {isParentMode && selectedChild ? selectedChild.name : payslipData.name || payslipData.employeeName || 'Employee Name'} <span style={{ color: '#666', fontWeight: 'normal' }}>{formatPeriod(payslipData.payPeriodStart, payslipData.payPeriodEnd)}</span>
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', fontFamily: 'Arial, sans-serif' }}>{payslipData.companyName || 'Sample Company'}</div>
            </div>
          </div>

          {/* Top Section - 3 Columns with blue-gray background */}
          <div style={{ backgroundColor: '#e8ecf0', margin: '0 -25px', padding: '15px 25px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
            {/* Employee Details */}
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333', fontFamily: 'Arial, sans-serif' }}>Employee Details</h3>
              <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white', minHeight: '140px' }}>
                <div style={{ fontSize: '10px', lineHeight: '1.6', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                  {payslipData.payrollNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Works number</span>
                      <span style={{ fontWeight: 'bold' }}>{payslipData.payrollNumber}</span>
                    </div>
                  )}
                  {payslipData.taxCode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Tax code</span>
                      <span style={{ fontWeight: 'bold' }}>{payslipData.taxCode}</span>
                    </div>
                  )}
                  {payslipData.niNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>National Insurance number</span>
                      <span style={{ fontWeight: 'bold' }}>{payslipData.niNumber}</span>
                    </div>
                  )}
                  {payslipData.niCategory && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>National Insurance table</span>
                      <span style={{ fontWeight: 'bold' }}>{payslipData.niCategory}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payments */}
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333', fontFamily: 'Arial, sans-serif' }}>Payments</h3>
              <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white', minHeight: '140px', position: 'relative' }}>
                <div style={{ fontSize: '10px', lineHeight: '1.6', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                  {payslipData.paymentEntries?.map((entry: any, index: number) => (
                    <div key={entry.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>{entry.description || 'Monthly pay'}</span>
                      <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(entry.amount || 0)}</span>
                    </div>
                  ))}
                  {(!payslipData.paymentEntries || payslipData.paymentEntries.length === 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Monthly pay</span>
                      <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(payslipData.grossPay || 0)}</span>
                    </div>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', borderTop: '1px solid #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px', color: '#333' }}>
                  <span>Total</span>
                  <span>{currency}{formatCurrency(payslipData.grossPay || 0)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333', fontFamily: 'Arial, sans-serif' }}>Deductions</h3>
              <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white', minHeight: '140px', position: 'relative' }}>
                <div style={{ fontSize: '10px', lineHeight: '1.6', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                  {payslipData.deductions?.map((deduction: any, index: number) => (
                    <div key={deduction.id || index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>{deduction.name}</span>
                      <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(deduction.amount || 0)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', borderTop: '1px solid #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px', color: '#333' }}>
                  <span>Total</span>
                  <span>{currency}{formatCurrency(totalDeductions || 0)}</span>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Bottom Section - 3 Columns */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            {/* This Month */}
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333', fontFamily: 'Arial, sans-serif' }}>This Month</h3>
              <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white', minHeight: '120px' }}>
                <div style={{ fontSize: '10px', lineHeight: '1.6', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Taxable gross pay</span>
                    <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(payslipData.grossPay || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '8px', fontWeight: 'bold' }}>
                    <span>Net pay</span>
                    <span>{currency}{formatCurrency(netPay || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Year to Date */}
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333', fontFamily: 'Arial, sans-serif' }}>Year to Date</h3>
              <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white', minHeight: '120px' }}>
                <div style={{ fontSize: '10px', lineHeight: '1.6', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Taxable gross pay</span>
                    <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(ytdValues.grossPay || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Tax</span>
                    <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(calculatedYTD.tax || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Employee National Insurance</span>
                    <span style={{ fontWeight: 'bold' }}>{currency}{formatCurrency(calculatedYTD.employeeNI || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333', fontFamily: 'Arial, sans-serif' }}>Payment</h3>
              <div style={{ border: '1px solid #ccc', padding: '20px', backgroundColor: 'white', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                  {currency}{formatCurrency(netPay || 0)}
                </div>
                <div style={{ fontSize: '10px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                  Paid {formatDate(payslipData.payPeriodEnd || payslipData.payDate) || formatDate(new Date().toISOString())}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', fontSize: '10px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
            Payment processed on {getWorkingDayDate(payslipData.payPeriodEnd || payslipData.payDate)} via {payslipData.paymentMethod || 'BACS'}
          </div>
      </div>
    </div>
  );
};