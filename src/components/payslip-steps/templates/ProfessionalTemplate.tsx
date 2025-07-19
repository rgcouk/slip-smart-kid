import React from 'react';
import { TemplateProps } from './index';

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ 
  payslipData, 
  currency, 
  ytdValues, 
  totalDeductions, 
  netPay 
}) => {
  const getCurrentPeriodNumber = () => {
    if (!payslipData.period) return 1;
    const [, month] = payslipData.period.split('-');
    return parseInt(month) || 1;
  };

  const periodNumber = getCurrentPeriodNumber();

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden mx-auto max-w-4xl">
      {/* Hidden PDF Template */}
      <div 
        className="fixed top-0 left-[-9999px]"
        data-payslip-preview
        style={{ 
          width: '794px',
          padding: '40px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          lineHeight: '1.4'
        }}
      >
        {/* PDF Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', borderBottom: '2px solid #333', paddingBottom: '15px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#333' }}>
              {payslipData.companyName || 'Company Name'}
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              {payslipData.companyAddress || 'Company Address'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>Employee No: {payslipData.payrollNumber || '001'}</p>
            <p style={{ margin: '0' }}>Pay Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Employee and Company Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              Employee Details
            </h3>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Name:</span>
                <span style={{ fontWeight: 'bold' }}>{payslipData.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Employee ID:</span>
                <span>{payslipData.payrollNumber || '001'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Tax Code:</span>
                <span>{payslipData.taxCode || '1257L'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>NI Number:</span>
                <span>{payslipData.niNumber || 'JZ23434C'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>NI Category:</span>
                <span>{payslipData.niCategory || 'A'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              Pay Period Information
            </h3>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Pay Period:</span>
                <span>{payslipData.period}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Period Number:</span>
                <span>{periodNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Pay Method:</span>
                <span>Bank Transfer</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Pay Date:</span>
                <span>{new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments and Deductions Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>This Period</th>
              <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Year to Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Payments Section */}
            <tr style={{ backgroundColor: '#e8f4fd' }}>
              <td colSpan={3} style={{ border: '1px solid #333', padding: '6px', fontWeight: 'bold', color: '#0066cc' }}>
                PAYMENTS
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #333', padding: '6px' }}>Basic Salary</td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{payslipData.grossPay.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{ytdValues.grossPay.toFixed(2)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
              <td style={{ border: '1px solid #333', padding: '6px' }}>Total Gross Pay</td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{payslipData.grossPay.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{ytdValues.grossPay.toFixed(2)}
              </td>
            </tr>

            {/* Deductions Section */}
            <tr style={{ backgroundColor: '#fde8e8' }}>
              <td colSpan={3} style={{ border: '1px solid #333', padding: '6px', fontWeight: 'bold', color: '#cc0000' }}>
                DEDUCTIONS
              </td>
            </tr>
            {payslipData.deductions.map((deduction: any, index: number) => (
              <tr key={deduction.id || index}>
                <td style={{ border: '1px solid #333', padding: '6px' }}>{deduction.name}</td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                  {currency}{deduction.amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                  {currency}{(deduction.amount * (ytdValues.grossPay / payslipData.grossPay)).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
              <td style={{ border: '1px solid #333', padding: '6px' }}>Total Deductions</td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{totalDeductions.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>
                {currency}{ytdValues.totalDeductions.toFixed(2)}
              </td>
            </tr>

            {/* Net Pay */}
            <tr style={{ backgroundColor: '#e8f5e8', borderTop: '2px solid #009900' }}>
              <td style={{ border: '1px solid #333', padding: '10px', fontWeight: 'bold', fontSize: '13px', color: '#009900' }}>
                NET PAY
              </td>
              <td style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px', color: '#009900' }}>
                {currency}{netPay.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px', color: '#009900' }}>
                {currency}{ytdValues.netPay.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer Information */}
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', fontSize: '10px', color: '#666' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Employer Information:</p>
              <p style={{ margin: '0 0 3px 0' }}>PAYE Ref: 120/GE26732</p>
              <p style={{ margin: '0 0 3px 0' }}>Accounts Office Ref: 120PG00000</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Generated by:</p>
              <p style={{ margin: '0' }}>Professional Payroll Solutions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visible Display Version */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b-2 border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {payslipData.companyName || 'Company Name'}
            </h1>
            <p className="text-sm text-gray-600">
              {payslipData.companyAddress || 'Company Address'}
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="font-medium">Employee No: {payslipData.payrollNumber || '001'}</div>
            <div>Pay Date: {new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        {/* Employee and Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1">Employee Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{payslipData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Employee ID:</span>
                <span className="text-gray-900">{payslipData.payrollNumber || '001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tax Code:</span>
                <span className="text-gray-900">{payslipData.taxCode || '1257L'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">NI Number:</span>
                <span className="text-gray-900">{payslipData.niNumber || 'JZ23434C'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">NI Category:</span>
                <span className="text-gray-900">{payslipData.niCategory || 'A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1">Pay Period Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Pay Period:</span>
                <span className="text-gray-900">{payslipData.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Period Number:</span>
                <span className="text-gray-900">{periodNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Pay Method:</span>
                <span className="text-gray-900">Bank Transfer</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Pay Date:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments and Deductions Table */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-4 py-3 text-left font-bold text-gray-800">Description</th>
                <th className="border border-gray-400 px-4 py-3 text-right font-bold text-gray-800">This Period</th>
                <th className="border border-gray-400 px-4 py-3 text-right font-bold text-gray-800">Year to Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Payments Section */}
              <tr className="bg-blue-50">
                <td colSpan={3} className="border border-gray-400 px-4 py-2 font-bold text-blue-800">PAYMENTS</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2 text-gray-700">Basic Salary</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{payslipData.grossPay.toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{ytdValues.grossPay.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="border border-gray-400 px-4 py-2 text-gray-800">Total Gross Pay</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{payslipData.grossPay.toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{ytdValues.grossPay.toFixed(2)}</td>
              </tr>

              {/* Deductions Section */}
              <tr className="bg-red-50">
                <td colSpan={3} className="border border-gray-400 px-4 py-2 font-bold text-red-800">DEDUCTIONS</td>
              </tr>
              {payslipData.deductions.map((deduction: any) => (
                <tr key={deduction.id}>
                  <td className="border border-gray-400 px-4 py-2 text-gray-700">{deduction.name}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{deduction.amount.toFixed(2)}</td>
                  <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{(deduction.amount * (ytdValues.grossPay / payslipData.grossPay)).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="border border-gray-400 px-4 py-2 text-gray-800">Total Deductions</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{totalDeductions.toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-2 text-right text-gray-900">{currency}{ytdValues.totalDeductions.toFixed(2)}</td>
              </tr>

              {/* Net Pay */}
              <tr className="bg-green-50 border-t-2 border-green-600">
                <td className="border border-gray-400 px-4 py-3 font-bold text-green-800 text-lg">NET PAY</td>
                <td className="border border-gray-400 px-4 py-3 text-right font-bold text-green-900 text-lg">{currency}{netPay.toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-3 text-right font-bold text-green-900 text-lg">{currency}{ytdValues.netPay.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Information */}
        <div className="border-t border-gray-300 pt-4 text-xs text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-1">Employer Information:</div>
              <div>PAYE Ref: 120/GE26732</div>
              <div>Accounts Office Ref: 120PG00000</div>
            </div>
            <div className="md:text-right">
              <div className="font-semibold mb-1">Generated by:</div>
              <div>Professional Payroll Solutions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};