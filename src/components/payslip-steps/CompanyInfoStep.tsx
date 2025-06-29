
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, Building2, X, Palette } from 'lucide-react';

interface CompanyInfoStepProps {
  payslipData: any;
  setPayslipData: (data: any) => void;
  isParentMode: boolean;
  selectedChild: any;
}

export const CompanyInfoStep = ({ payslipData, setPayslipData, isParentMode }: CompanyInfoStepProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setPayslipData({
          ...payslipData,
          companyLogo: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setPayslipData({
      ...payslipData,
      companyLogo: null
    });
  };

  const updateCompanyInfo = (field: string, value: string) => {
    setPayslipData({
      ...payslipData,
      [field]: value
    });
  };

  const handleTemplateChange = (template: 'default' | 'professional') => {
    setPayslipData({
      ...payslipData,
      template
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Information</h2>
        <p className="text-gray-600">Add your company details, logo, and choose a template</p>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Payslip Template
          </CardTitle>
          <CardDescription>
            Choose the design style for your payslips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={payslipData.template || 'default'}
            onValueChange={handleTemplateChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="default" id="default" />
              <div className="flex-1">
                <Label htmlFor="default" className="font-medium cursor-pointer">
                  Default Theme
                </Label>
                <p className="text-sm text-gray-500">
                  Modern, colorful design with clear sections
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="professional" id="professional" />
              <div className="flex-1">
                <Label htmlFor="professional" className="font-medium cursor-pointer">
                  Professional Theme
                </Label>
                <p className="text-sm text-gray-500">
                  Clean, formal design for business use
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Company Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Logo
          </CardTitle>
          <CardDescription>
            Upload your company logo to appear on the payslip (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logoPreview || payslipData.companyLogo ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={logoPreview || payslipData.companyLogo}
                  alt="Company Logo"
                  className="h-20 w-auto border border-gray-200 rounded"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Logo
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload logo</p>
              <p className="text-xs text-gray-500">PNG, JPG or SVG up to 2MB</p>
            </div>
          )}
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </CardContent>
      </Card>

      {/* Company Details */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name *
          </Label>
          <Input
            id="companyName"
            value={payslipData.companyName || ''}
            onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
            placeholder="Enter company name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="companyAddress" className="text-sm font-medium text-gray-700">
            Company Address
          </Label>
          <Input
            id="companyAddress"
            value={payslipData.companyAddress || ''}
            onChange={(e) => updateCompanyInfo('companyAddress', e.target.value)}
            placeholder="Enter company address"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyPhone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="companyPhone"
              value={payslipData.companyPhone || ''}
              onChange={(e) => updateCompanyInfo('companyPhone', e.target.value)}
              placeholder="Enter phone number"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="companyEmail" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="companyEmail"
              type="email"
              value={payslipData.companyEmail || ''}
              onChange={(e) => updateCompanyInfo('companyEmail', e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="companyRegistration" className="text-sm font-medium text-gray-700">
            Company Registration Number
          </Label>
          <Input
            id="companyRegistration"
            value={payslipData.companyRegistration || ''}
            onChange={(e) => updateCompanyInfo('companyRegistration', e.target.value)}
            placeholder="Enter registration number"
            className="mt-1"
          />
        </div>
      </div>

      {isParentMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">💼 Learning Moment</h3>
          <p className="text-sm text-green-700">
            Company information and templates on payslips are important for record keeping and legal requirements. 
            Different templates can help match your company's branding and look more professional!
          </p>
        </div>
      )}
    </div>
  );
};
