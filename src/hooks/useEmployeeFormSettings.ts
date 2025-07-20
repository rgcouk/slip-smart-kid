import { useState, useEffect } from 'react';

export interface EmployeeFormSections {
  personal: boolean;
  employment: boolean;
  tax: boolean;
  additional: boolean;
}

export interface EmployeeFormPreset {
  id: string;
  name: string;
  description: string;
  sections: EmployeeFormSections;
}

const DEFAULT_SECTIONS: EmployeeFormSections = {
  personal: true,
  employment: true,
  tax: false,
  additional: false,
};

const PRESETS: EmployeeFormPreset[] = [
  {
    id: 'basic',
    name: 'Basic Info',
    description: 'Just essential personal and employment details',
    sections: {
      personal: true,
      employment: true,
      tax: false,
      additional: false,
    },
  },
  {
    id: 'full',
    name: 'Full Details',
    description: 'All available employee information',
    sections: {
      personal: true,
      employment: true,
      tax: true,
      additional: true,
    },
  },
  {
    id: 'tax-focused',
    name: 'Tax Information',
    description: 'Focus on tax and payroll essentials',
    sections: {
      personal: true,
      employment: false,
      tax: true,
      additional: false,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Only the most basic information',
    sections: {
      personal: true,
      employment: false,
      tax: false,
      additional: false,
    },
  },
];

const STORAGE_KEY = 'employeeFormSections';

export const useEmployeeFormSettings = () => {
  const [sections, setSections] = useState<EmployeeFormSections>(DEFAULT_SECTIONS);
  const [lastUsedPreset, setLastUsedPreset] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSections(parsed.sections || DEFAULT_SECTIONS);
        setLastUsedPreset(parsed.lastPreset || null);
      }
    } catch (error) {
      console.warn('Failed to load employee form settings:', error);
    }
  }, []);

  // Save settings to localStorage when sections change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sections,
        lastPreset: lastUsedPreset,
      }));
    } catch (error) {
      console.warn('Failed to save employee form settings:', error);
    }
  }, [sections, lastUsedPreset]);

  const toggleSection = (sectionKey: keyof EmployeeFormSections) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
    setLastUsedPreset(null); // Clear preset when manually toggling
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSections(preset.sections);
      setLastUsedPreset(presetId);
    }
  };

  const resetToDefault = () => {
    setSections(DEFAULT_SECTIONS);
    setLastUsedPreset(null);
  };

  const getActivePreset = (): EmployeeFormPreset | null => {
    return PRESETS.find(preset => 
      Object.keys(preset.sections).every(key => 
        preset.sections[key as keyof EmployeeFormSections] === sections[key as keyof EmployeeFormSections]
      )
    ) || null;
  };

  const getEnabledSectionsCount = (): number => {
    return Object.values(sections).filter(Boolean).length;
  };

  const getTotalSectionsCount = (): number => {
    return Object.keys(sections).length;
  };

  return {
    sections,
    presets: PRESETS,
    toggleSection,
    applyPreset,
    resetToDefault,
    getActivePreset,
    getEnabledSectionsCount,
    getTotalSectionsCount,
    lastUsedPreset,
  };
};