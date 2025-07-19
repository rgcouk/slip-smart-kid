# Payslip Template System Guide

## Overview
The payslip template system has been organized to make it easy to add, edit, and manage different payslip templates. Each template is now in its own file for better maintainability.

## File Structure
```
src/components/payslip-steps/templates/
├── index.ts                    # Template registry and exports
├── DefaultTemplate.tsx         # Clean, modern default template
├── ProfessionalTemplate.tsx    # Traditional business template with detailed formatting
├── CompactTemplate.tsx         # Space-efficient template for simple payslips
└── [YourTemplate].tsx          # Add new templates here
```

## Adding a New Template

### 1. Create the Template File
Create a new file in `src/components/payslip-steps/templates/YourTemplate.tsx`:

```tsx
import React from 'react';
import { TemplateProps } from './index';

export const YourTemplate: React.FC<TemplateProps> = ({ 
  payslipData, 
  currency, 
  ytdValues,
  totalDeductions,
  netPay,
  isParentMode = false,
  selectedChild,
  locale = 'en-GB'
}) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mx-auto max-w-4xl">
      {/* Your custom template design here */}
      <h1>{payslipData.companyName}</h1>
      <p>Employee: {payslipData.name}</p>
      <p>Gross Pay: {currency}{payslipData.grossPay.toFixed(2)}</p>
      <p>Net Pay: {currency}{netPay.toFixed(2)}</p>
      
      {/* Add more sections as needed */}
    </div>
  );
};
```

### 2. Register the Template
Add your template to `src/components/payslip-steps/templates/index.ts`:

```tsx
// Import your new template
import { YourTemplate } from './YourTemplate';

// Add to the AVAILABLE_TEMPLATES array
export const AVAILABLE_TEMPLATES: PayslipTemplate[] = [
  // ... existing templates
  {
    id: 'your-template',
    name: 'Your Template Name',
    description: 'Description of what makes this template unique',
    component: YourTemplate,
    preview: '/template-previews/your-template.png' // Optional preview image
  }
];
```

### 3. Template Props Interface
All templates receive the same props defined in `TemplateProps`:

```tsx
interface TemplateProps {
  payslipData: any;           // Main payslip data
  currency: string;           // Currency symbol (£, $, €, etc.)
  ytdValues: {               // Year-to-date calculations
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
  totalDeductions: number;    // Current period total deductions
  netPay: number;            // Current period net pay
  isParentMode?: boolean;    // Whether app is in parent mode
  selectedChild?: any;       // Selected child data if in parent mode
  locale?: string;           // Locale for formatting (default: en-GB)
}
```

## Available Data Fields

### Company Information
- `payslipData.companyName` - Company name
- `payslipData.companyAddress` - Company address
- `payslipData.companyPhone` - Company phone
- `payslipData.companyEmail` - Company email

### Employee Information
- `payslipData.name` - Employee full name
- `payslipData.payrollNumber` - Employee payroll number
- `payslipData.taxCode` - Tax code (e.g., \"1257L\")
- `payslipData.niNumber` - National Insurance number
- `payslipData.niCategory` - NI category (A, B, C, etc.)
- `payslipData.taxAllowance` - Personal tax allowance
- `payslipData.studentLoanPlan` - Student loan plan
- `payslipData.pensionSchemeReference` - Pension scheme reference

### Payment Information
- `payslipData.grossPay` - Gross pay amount
- `payslipData.period` - Pay period (YYYY-MM format)
- `payslipData.deductions` - Array of deduction objects
- `netPay` - Calculated net pay
- `totalDeductions` - Sum of all deductions

### Deduction Structure
Each deduction in `payslipData.deductions` has:
```tsx
{
  id: string;
  name: string;
  amount: number;
  type: 'tax' | 'ni' | 'pension' | 'other';
}
```

## Design Guidelines

### PDF Generation Support
Templates need to support both:
1. **Visual Display** - What users see on screen
2. **PDF Generation** - Hidden element with inline styles for PDF export

For PDF support, include a hidden element:
```tsx
<div 
  className="fixed top-0 left-[-9999px]"
  data-payslip-preview
  style={{ 
    width: '794px',
    padding: '40px',
    backgroundColor: 'white',
    fontFamily: 'Arial, sans-serif',
    // Use inline styles for PDF generation
  }}
>
  {/* PDF version with inline styles */}
</div>
```

### Responsive Design
- Use Tailwind CSS classes for responsive design
- Ensure templates work on mobile devices
- Use `max-w-4xl mx-auto` for consistent centering

### Accessibility
- Use semantic HTML elements
- Ensure good color contrast
- Include proper heading hierarchy

## Template Examples

### Minimal Template
```tsx
export const MinimalTemplate: React.FC<TemplateProps> = ({ payslipData, currency, netPay }) => (
  <div className="bg-white p-6 max-w-2xl mx-auto">
    <h1 className="text-xl font-bold mb-4">{payslipData.companyName}</h1>
    <div className="space-y-2">
      <p><strong>Employee:</strong> {payslipData.name}</p>
      <p><strong>Period:</strong> {payslipData.period}</p>
      <p><strong>Net Pay:</strong> {currency}{netPay.toFixed(2)}</p>
    </div>
  </div>
);
```

### Detailed Template
```tsx
export const DetailedTemplate: React.FC<TemplateProps> = ({ 
  payslipData, currency, ytdValues, totalDeductions, netPay 
}) => (
  <div className="bg-white border shadow-lg rounded p-8 max-w-4xl mx-auto">
    {/* Header */}
    <header className="border-b-2 pb-4 mb-6">
      <h1 className="text-2xl font-bold">{payslipData.companyName}</h1>
      <p className="text-gray-600">Payslip for {payslipData.period}</p>
    </header>
    
    {/* Employee Details */}
    <section className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <h2 className="font-semibold mb-2">Employee Information</h2>
        <div className="space-y-1 text-sm">
          <p>Name: {payslipData.name}</p>
          <p>ID: {payslipData.payrollNumber}</p>
          <p>Tax Code: {payslipData.taxCode}</p>
        </div>
      </div>
    </section>
    
    {/* Payments Table */}
    <table className="w-full border-collapse border mb-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">Item</th>
          <th className="border p-2 text-right">This Period</th>
          <th className="border p-2 text-right">Year to Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Gross Pay</td>
          <td className="border p-2 text-right">{currency}{payslipData.grossPay.toFixed(2)}</td>
          <td className="border p-2 text-right">{currency}{ytdValues.grossPay.toFixed(2)}</td>
        </tr>
        <tr className="font-bold bg-green-50">
          <td className="border p-2">Net Pay</td>
          <td className="border p-2 text-right">{currency}{netPay.toFixed(2)}</td>
          <td className="border p-2 text-right">{currency}{ytdValues.netPay.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
```

## Template Selection

Templates can be selected in the Business Setup step using the `TemplateSelector` component, or programmatically by setting `payslipData.template` to the template ID.

## Best Practices

1. **Keep it Focused** - Each template file should only contain the template component
2. **Use TypeScript** - Leverage the `TemplateProps` interface for type safety
3. **Test Responsively** - Ensure templates work on all screen sizes
4. **PDF Ready** - Include PDF-specific styling when needed
5. **Consistent Styling** - Use the project's design system and Tailwind classes
6. **Performance** - Use React.memo if the template is complex

## Troubleshooting

### Template Not Appearing
- Check that it's properly imported and registered in `index.ts`
- Verify the template ID is unique
- Ensure the component is exported correctly

### PDF Generation Issues
- Ensure the `data-payslip-preview` element exists
- Use inline styles for PDF elements
- Check that fonts and colors are PDF-compatible

### Styling Issues
- Use Tailwind's design tokens from the project's design system
- Ensure responsive classes are applied
- Test in both light and dark modes if supported
