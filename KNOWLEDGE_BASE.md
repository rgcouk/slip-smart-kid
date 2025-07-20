# Formaslips Project Knowledge Base

## Project Overview
Formaslips is a professional payslip generator application built with React, TypeScript, and Vite. The application allows users to create, manage, and export professional payslips with a focus on ease of use and professional presentation.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn/UI components
- **Routing**: React Router DOM
- **State Management**: React hooks, Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: jsPDF, html2canvas, @pdfme/generator
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## Design System
### Color Scheme (Orange Theme)
- **Primary**: `hsl(22 96% 54%)` (orange-500 #f97316)
- **Primary Foreground**: `hsl(355.7 100% 97.3%)`
- **Secondary**: `hsl(240 4.8% 95.9%)`
- **Background**: `hsl(0 0% 100%)`
- **Foreground**: `hsl(240 10% 3.9%)`
- **Muted**: `hsl(240 4.8% 95.9%)`
- **Accent**: `hsl(240 4.8% 95.9%)`
- **Border**: `hsl(240 5.9% 90%)`

### Dark Mode
- **Background**: `hsl(20 14.3% 4.1%)`
- **Primary**: `hsl(22 86% 45%)`
- **Card**: `hsl(24 9.8% 10%)`

## Key Components
### PayslipCreator
- Main component for payslip creation
- Tab-based interface (Business, Period, Earnings, Deductions, Summary)
- Real-time calculation footer
- Step navigation with next/back buttons
- Progress indicators with badges

### Form Steps
1. **Business Setup**: Company and employee information
2. **Period Selection**: Pay period dates
3. **Basic Info/Earnings**: Payment entries and gross pay
4. **Deductions**: Tax and other deductions
5. **Preview/Summary**: Final payslip preview and export

### Employee Management
- **EmployeeForm**: Comprehensive employee data entry form with modular field components
- **PersonalInfoFields**: Name, email, phone, address
- **EmploymentInfoFields**: Payroll number, default gross salary
- **TaxInfoFields**: Tax code, NI number, tax allowance, NI category, student loan plan, pension scheme reference, starter declaration
- **NotesField**: Additional employee notes
- **EmployeeTable**: Displays employee list with search and actions
- **EmployeeActions**: Edit/delete operations for each employee

### UI Components
- Custom Button variants with orange theme
- Card-based layouts with headers/footers
- Accordion components for collapsible sections
- Skeleton loaders for async states
- HoverCard for field explanations
- Badge components for status indicators

## Database Schema (Supabase)
### Tables
- **profiles**: User profile information
- **child_profiles**: Parent-child relationships for family accounts
- **employees**: Employee master data with comprehensive tax and employment information
- **payslips**: Generated payslip records with JSON deductions
- **tax_codes**: Reference table for UK tax codes

### Employee Fields (All Dynamic in Form)
- **Personal Info**: `name` (required), `email`, `phone`, `address`
- **Employment Info**: `payroll_number`, `default_gross_salary`
- **Tax Information**: 
  - `tax_code`: UK tax code (e.g., 1257L)
  - `ni_number`: National Insurance number
  - `tax_allowance`: Tax-free allowance (default: £12,570)
  - `ni_category`: NI category (A-Z, default: A)
  - `student_loan_plan`: Plan 1/2/4/Postgraduate
  - `pension_scheme_reference`: Workplace pension reference
  - `starter_declaration`: A/B/C for new starters
- **Additional**: `notes` for free-form employee information

### Key Fields
- All tables include `created_at`, `updated_at` timestamps
- Foreign key relationships with proper constraints
- RLS (Row Level Security) policies for data isolation

## File Structure
```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── employees/       # Employee management
│   │   ├── form/        # Modular form field components
│   │   └── table/       # Employee table components
│   ├── payslip-steps/   # Form step components
│   ├── navigation/      # Navigation components
│   └── PayslipCreator.tsx
├── hooks/               # Custom React hooks
├── pages/               # Route components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── integrations/supabase/
```

## Development Guidelines
- Use semantic color tokens from design system
- Implement proper TypeScript typing
- Follow React best practices with hooks
- Use Tailwind utility classes
- Implement proper error handling
- Follow accessibility standards
- Keep components focused and reusable
- All employee form fields are dynamic and stored in database

## Key Features
- Multi-step payslip creation
- Real-time calculations
- PDF export functionality
- Parent mode for family accounts
- Comprehensive employee management with full UK tax compliance
- Employee search and filtering
- Responsive design
- Dark/light mode support
- Professional payslip templates

## Template System & Customization

### Available Templates
1. **Default Template**: Clean, minimalist design for basic payslips
2. **Professional Template**: Enhanced layout with comprehensive employee tax information

### Template Selection
Templates are selected in the Business Setup step via radio buttons. The selected template is stored in `payslipData.template` and determines which component renders the payslip.

### Template Structure
All templates follow a consistent data structure:
- **Header**: Company branding, payslip title, pay period
- **Employee Details**: Name, payroll number, tax code, NI number, NI category
- **Employer Details**: Company information, PAYE reference
- **Payments Table**: Earnings breakdown with YTD calculations
- **Deductions Table**: Tax and other deductions with YTD
- **Net Pay**: Final calculation prominently displayed
- **Footer**: Payment method, disclaimers, branding

### Customizing Templates
Templates are React components located in `src/components/payslip-steps/preview/`:
- `ProfessionalPayslipTemplate.tsx` - Professional template with full tax details
- Create new templates by copying existing ones and modifying the JSX structure
- All templates receive the same props: `payslipData`, `currency`, `ytdValues`, `totalDeductions`, `netPay`

### Template Data Mapping
Templates automatically use employee data from the form:
- `payslipData.taxCode` → Employee tax code (defaults to '1257L')
- `payslipData.niNumber` → NI number (defaults to 'AB123456C')
- `payslipData.niCategory` → NI category (defaults to 'A')
- `payslipData.studentLoanPlan` → Student loan plan if applicable
- `payslipData.pensionSchemeReference` → Workplace pension reference

### PDF Export Integration
Templates include hidden PDF-optimized versions with:
- Fixed dimensions (794px width for A4)
- Inline styles for consistent PDF rendering
- Print-friendly colors and fonts
- Proper table structures for complex layouts

### Adding New Templates
1. Create new template component in preview folder
2. Add template option to BusinessSetupStep radio group
3. Update template selection logic in preview components
4. Include both screen and PDF versions in the component

## Form Architecture & Data Flow

### Multi-Step Form Structure
1. **BusinessSetupStep**: Company details, employee selection, template choice
2. **PeriodSelectionStep**: Pay period dates
3. **BasicInfoStep**: Payment entries and earnings
4. **DeductionsStep**: Tax calculations and deductions
5. **PreviewStep**: Final payslip preview and export

### Employee Data Integration
The form automatically populates employee tax information when an employee is selected:
- Tax code, NI number, NI category are pulled from employee record
- Student loan plan and pension scheme reference are included if available
- All fields are dynamically rendered in the payslip templates

### Real-time Calculations
- Gross pay calculated from payment entries
- Tax deductions calculated based on employee tax code and allowances
- Net pay calculated as gross pay minus total deductions
- YTD values calculated based on pay period

### Export System
- PDF generation uses hidden template versions optimized for print
- Templates are captured as images then converted to PDF
- All employee tax information is included in exported payslips

## Code Standards
- Use HSL colors exclusively in design system
- Implement proper loading states
- Use semantic tokens instead of direct colors
- Follow component composition patterns
- Implement proper form validation
- Use TypeScript strict mode
- Modular component architecture for maintainability
- All form inputs are dynamic and connected to database
- Templates automatically use employee data with sensible defaults

## Comprehensive Form Attributes Reference

### Employee Information Fields

#### Personal Information Fields
Located in: `src/components/employees/form/PersonalInfoFields.tsx`

| Field | Type | Required | Database Column | Validation | Implementation |
|-------|------|----------|----------------|------------|----------------|
| **name** | `string` | Yes | `name` | Required, trimmed | `<Input>` component |
| **email** | `string` | No | `email` | Email format, trimmed | `<Input type="email">` |
| **phone** | `string` | No | `phone` | Free text, trimmed | `<Input>` |
| **address** | `string` | No | `address` | Free text, trimmed | `<Textarea rows={2}>` |

```typescript
// Implementation Example
<Input
  id="name"
  value={name}
  onChange={(e) => onFieldChange('name', e.target.value)}
  placeholder="Employee full name"
  required
/>
```

#### Employment Information Fields
Located in: `src/components/employees/form/EmploymentInfoFields.tsx`

| Field | Type | Required | Database Column | Validation | Implementation |
|-------|------|----------|----------------|------------|----------------|
| **payroll_number** | `string` | No | `payroll_number` | Trimmed | `<Input>` |
| **default_gross_salary** | `number` | No | `default_gross_salary` | Min: 0, Step: 0.01 | `<Input type="number">` |

```typescript
// Implementation Example
<Input
  id="default_gross_salary"
  type="number"
  step="0.01"
  min="0"
  value={defaultGrossSalary || ''}
  onChange={(e) => onFieldChange('default_gross_salary', e.target.value ? parseFloat(e.target.value) : undefined)}
  placeholder="3000.00"
/>
```

#### Tax Information Fields
Located in: `src/components/employees/form/TaxInfoFields.tsx`

| Field | Type | Required | Database Column | Validation | Implementation |
|-------|------|----------|----------------|------------|----------------|
| **tax_code** | `string` | No | `tax_code` | Trimmed | `<Input>` |
| **ni_number** | `string` | No | `ni_number` | Trimmed | `<Input>` |
| **tax_allowance** | `number` | No | `tax_allowance` | Min: 0, Step: 0.01, Default: 12570 | `<Input type="number">` |
| **ni_category** | `string` | No | `ni_category` | Enum values, Default: 'A' | `<Select>` |
| **student_loan_plan** | `string` | No | `student_loan_plan` | Enum values | `<Select>` |
| **pension_scheme_reference** | `string` | No | `pension_scheme_reference` | Trimmed | `<Input>` |
| **starter_declaration** | `'A'|'B'|'C'` | No | `starter_declaration` | Enum values | `<Select>` |

##### NI Category Options:
```typescript
const niCategoryOptions = [
  { value: "A", label: "A - Standard rate" },
  { value: "B", label: "B - Married women/widows (reduced rate)" },
  { value: "C", label: "C - Over state pension age" },
  { value: "H", label: "H - Apprentice under 25" },
  { value: "J", label: "J - No liability to pay" },
  { value: "L", label: "L - Deferred payment" },
  { value: "M", label: "M - Under 21" },
  { value: "S", label: "S - Contracted-out salary related" },
  { value: "X", label: "X - No National Insurance" },
  { value: "Z", label: "Z - No liability" }
];
```

##### Student Loan Plan Options:
```typescript
const studentLoanOptions = [
  { value: "none", label: "None" },
  { value: "Plan1", label: "Plan 1 (Before Sept 2012)" },
  { value: "Plan2", label: "Plan 2 (Sept 2012 onwards)" },
  { value: "Plan4", label: "Plan 4 (Scotland)" },
  { value: "Postgraduate", label: "Postgraduate Loan" }
];
```

##### Starter Declaration Options:
```typescript
const starterDeclarationOptions = [
  { value: "A", label: "A - First job since last 6 April" },
  { value: "B", label: "B - Second job or pension" },
  { value: "C", label: "C - Receives benefits/pension from previous job" }
];
```

#### Notes Field
Located in: `src/components/employees/form/NotesField.tsx`

| Field | Type | Required | Database Column | Validation | Implementation |
|-------|------|----------|----------------|------------|----------------|
| **notes** | `string` | No | `notes` | Trimmed | `<Textarea>` |

### PayslipData Interface
Located in: `src/types/payslip.ts`

```typescript
export interface PayslipData {
  // Employee Information
  name: string;
  employeeName?: string; // Keep for backward compatibility
  payrollNumber?: string;
  selectedEmployeeId?: string;
  
  // Employee Tax Information
  taxCode?: string;
  niNumber?: string;
  taxAllowance?: number;
  niCategory?: string;
  studentLoanPlan?: string;
  pensionSchemeReference?: string;
  starterDeclaration?: 'A' | 'B' | 'C';
  department?: string;
  
  // Pay Period Information
  period: string; // YYYY-MM format for backward compatibility
  payPeriodStart: string; // YYYY-MM-DD format
  payPeriodEnd: string; // YYYY-MM-DD format
  
  // Basic Pay Information
  grossPay: number;
  contractualHours?: number;
  hourlyRate?: number;
  
  // Additional Payment Entries
  paymentEntries: PaymentEntry[];
  
  // Company Information
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyRegistration?: string;
  companyLogo?: string;
  
  // Template Selection
  template?: 'default' | 'professional' | 'compact' | string;
  
  // Deductions
  deductions: DeductionEntry[];
  
  // Year to Date Override
  ytdOverride?: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
}
```

### Company Information Fields
Located in: `src/components/payslip-steps/BusinessSetupStep.tsx`

| Field | Type | Required | Form Implementation |
|-------|------|----------|-------------------|
| **companyName** | `string` | Yes | `<Input>` with validation |
| **companyAddress** | `string` | No | `<Input>` |
| **companyPhone** | `string` | No | `<Input>` |
| **companyEmail** | `string` | No | `<Input type="email">` |
| **companyRegistration** | `string` | No | `<Input>` |

```typescript
// Implementation Example
<Input 
  id="companyName" 
  value={payslipData.companyName || ''} 
  onChange={e => setPayslipData(prev => ({
    ...prev,
    companyName: e.target.value
  }))} 
  placeholder="Enter company name" 
  required 
  className="h-11 rounded-2xl border-border" 
/>
```

### Employee Details Fields (In Payslip Form)
Located in: `src/components/payslip-steps/BusinessSetupStep.tsx`

| Field | Type | Required | Form Implementation |
|-------|------|----------|-------------------|
| **employeeName** | `string` | Yes | `<Input>` with validation |
| **payrollNumber** | `string` | No | `<Input>` |
| **contractualHours** | `number` | No | `<Input type="number" step="0.5" min="0">` |
| **hourlyRate** | `number` | No | `<Input type="number" step="0.01" min="0">` |

### Pay Period Fields
Located in: `src/components/payslip-steps/PeriodSelectionStep.tsx`

| Field | Type | Required | Form Implementation |
|-------|------|----------|-------------------|
| **payPeriodStart** | `string` | Yes | Date picker (YYYY-MM-DD) |
| **payPeriodEnd** | `string` | Yes | Date picker (YYYY-MM-DD) |
| **period** | `string` | Yes | Derived from dates (YYYY-MM) |

```typescript
// Date Picker Implementation (using Shadcn)
<Popover>
  <PopoverTrigger asChild>
    <Button
      variant={"outline"}
      className={cn(
        "w-[240px] justify-start text-left font-normal",
        !date && "text-muted-foreground"
      )}
    >
      <CalendarIcon />
      {date ? format(date, "PPP") : <span>Pick a date</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
      className={cn("p-3 pointer-events-auto")}
    />
  </PopoverContent>
</Popover>
```

### Payment Entries
Located in: `src/types/payslip.ts`

```typescript
export interface PaymentEntry {
  id: string;
  description: string;
  type: 'hourly' | 'fixed' | 'overtime' | 'bonus';
  quantity?: number; // hours, days, etc.
  rate?: number; // rate per unit
  amount: number; // calculated or fixed amount
}
```

#### Payment Entry Form Implementation
Located in: `src/components/payslip-steps/PaymentEntriesSection.tsx`

| Field | Type | Required | Validation | Form Implementation |
|-------|------|----------|------------|-------------------|
| **description** | `string` | Yes | Non-empty | `<Input>` |
| **type** | `enum` | Yes | hourly/fixed/overtime/bonus | `<Select>` |
| **quantity** | `number` | Conditional | Min: 0 | `<Input type="number">` |
| **rate** | `number` | Conditional | Min: 0, Step: 0.01 | `<Input type="number">` |
| **amount** | `number` | Yes | Min: 0, Step: 0.01 | `<Input type="number">` or calculated |

### Deductions
Located in: `src/components/payslip-steps/deductions/types.ts`

```typescript
export interface DeductionEntry {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface DeductionFormData {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}
```

#### Deduction Form Implementation
Located in: `src/components/payslip-steps/deductions/CustomDeductionForm.tsx`

| Field | Type | Required | Validation | Form Implementation |
|-------|------|----------|------------|-------------------|
| **name** | `string` | Yes | Non-empty | `<Input>` |
| **type** | `enum` | Yes | percentage/fixed | `<Select>` |
| **value** | `number` | Yes | Min: 0 | `<Input type="number">` |

### Template Selection
Located in: `src/components/payslip-steps/BusinessSetupStep.tsx`

| Field | Type | Required | Options | Form Implementation |
|-------|------|----------|---------|-------------------|
| **template** | `string` | Yes | default/professional/compact | `<RadioGroup>` |

```typescript
// RadioGroup Implementation
<RadioGroup 
  value={payslipData.template || 'default'} 
  onValueChange={(value: 'default' | 'professional' | 'compact') => setPayslipData(prev => ({
    ...prev,
    template: value
  }))}
  className="grid grid-cols-3 gap-4"
>
  <Card className="border border-border p-4 cursor-pointer hover:border-primary transition-colors">
    <div className="flex items-center space-x-3 mb-2">
      <RadioGroupItem value="default" id="default" />
      <Label htmlFor="default" className="cursor-pointer font-medium">Default</Label>
    </div>
    <p className="text-xs text-muted-foreground">Clean and modern design</p>
  </Card>
</RadioGroup>
```

## Database Schema Mapping

### Employee Table (`employees`)
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  payroll_number TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  default_gross_salary NUMERIC,
  notes TEXT,
  tax_code TEXT,
  ni_number TEXT,
  tax_allowance NUMERIC DEFAULT 12570.00,
  ni_category CHAR(1) DEFAULT 'A',
  student_loan_plan TEXT,
  pension_scheme_reference TEXT,
  starter_declaration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Payslip Table (`payslips`)
```sql
CREATE TABLE payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  child_id UUID,
  employee_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  gross_salary NUMERIC NOT NULL,
  deductions JSONB NOT NULL DEFAULT '[]',
  net_salary NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Common Input Components Usage

### Standard Input
```typescript
<Input
  id="fieldName"
  value={value}
  onChange={(e) => handleChange('fieldName', e.target.value)}
  placeholder="Placeholder text"
  required={isRequired}
  type="text" // or "email", "number", etc.
/>
```

### Number Input
```typescript
<Input
  id="amount"
  type="number"
  step="0.01"
  min="0"
  value={amount || ''}
  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
  placeholder="0.00"
/>
```

### Select Dropdown
```typescript
<Select 
  value={selectedValue} 
  onValueChange={(value) => handleChange('field', value)}
>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Textarea
```typescript
<Textarea
  id="notes"
  value={notes}
  onChange={(e) => handleChange('notes', e.target.value)}
  placeholder="Additional notes"
  rows={3}
/>
```

This comprehensive reference covers all form attributes, their database mappings, implementations, and usage patterns throughout the Formaslips application.
