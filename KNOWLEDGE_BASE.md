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
