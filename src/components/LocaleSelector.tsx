
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLocale, Locale } from '@/hooks/useLocale';
import { Globe } from 'lucide-react';

export const LocaleSelector = () => {
  const { locale, updateLocale } = useLocale();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Globe className="h-5 w-5 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900">Region Settings</h3>
          <p className="text-sm text-gray-500">Choose your payslip format</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="locale" className="text-sm font-medium text-gray-700">
          Country/Region
        </Label>
        <Select value={locale} onValueChange={(value: Locale) => updateLocale(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
            <SelectItem value="US">🇺🇸 United States</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
