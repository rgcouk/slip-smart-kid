
import { useState, useEffect } from 'react';

export type Locale = 'UK' | 'US';

interface LocaleConfig {
  currency: string;
  dateFormat: string;
  taxYearStart: number; // Month (1-12)
}

const localeConfigs: Record<Locale, LocaleConfig> = {
  UK: {
    currency: '£',
    dateFormat: 'DD/MM/YYYY',
    taxYearStart: 4, // April
  },
  US: {
    currency: '$',
    dateFormat: 'MM/DD/YYYY',
    taxYearStart: 1, // January
  }
};

export const useLocale = () => {
  const [locale, setLocale] = useState<Locale>('UK'); // Default to UK as requested

  useEffect(() => {
    const saved = localStorage.getItem('payslip-locale') as Locale;
    if (saved && (saved === 'UK' || saved === 'US')) {
      setLocale(saved);
    }
  }, []);

  const updateLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('payslip-locale', newLocale);
  };

  return {
    locale,
    updateLocale,
    config: localeConfigs[locale]
  };
};
