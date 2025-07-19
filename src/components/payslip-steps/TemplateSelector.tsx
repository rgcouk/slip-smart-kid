import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye } from 'lucide-react';
import { AVAILABLE_TEMPLATES, PayslipTemplate } from './templates';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onPreviewTemplate?: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onPreviewTemplate
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Template</h3>
        <p className="text-sm text-gray-600">
          Select a payslip template that best fits your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AVAILABLE_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => onTemplateSelect(template.id)}
            onPreview={() => onPreviewTemplate?.(template.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface TemplateCardProps {
  template: PayslipTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onPreview?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onPreview
}) => {
  return (
    <Card 
      className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-primary border-primary bg-primary/5' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center p-0">
            <Check className="h-3 w-3" />
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            {template.name}
          </CardTitle>
          {template.id === 'professional' && (
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Template Preview Placeholder */}
        <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Eye className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs">Template Preview</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={isSelected ? "default" : "outline"}
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
          {onPreview && (
            <Button 
              size="sm" 
              variant="ghost"
              className="px-3"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};