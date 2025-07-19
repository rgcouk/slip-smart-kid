// Template registry for all available payslip templates
import React from 'react';
import { DefaultTemplate } from './DefaultTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { CompactTemplate } from './CompactTemplate';

export interface TemplateProps {
  payslipData: any;
  currency: string;
  ytdValues: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  };
  totalDeductions: number;
  netPay: number;
  isParentMode?: boolean;
  selectedChild?: any;
  locale?: string;
}

export interface PayslipTemplate {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<TemplateProps>;
  preview: string; // URL or base64 image for template preview
}

export const AVAILABLE_TEMPLATES: PayslipTemplate[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'Clean and modern design perfect for most businesses',
    component: DefaultTemplate,
    preview: '/template-previews/default.png'
  },
  {
    id: 'professional',
    name: 'Professional Template',
    description: 'Traditional business format with detailed sections',
    component: ProfessionalTemplate,
    preview: '/template-previews/professional.png'
  },
  {
    id: 'compact',
    name: 'Compact Template',
    description: 'Space-efficient design for simple payslips',
    component: CompactTemplate,
    preview: '/template-previews/compact.png'
  }
];

export const getTemplate = (templateId: string): PayslipTemplate | null => {
  return AVAILABLE_TEMPLATES.find(template => template.id === templateId) || null;
};

export const getTemplateComponent = (templateId: string): React.ComponentType<TemplateProps> => {
  const template = getTemplate(templateId);
  return template?.component || DefaultTemplate;
};