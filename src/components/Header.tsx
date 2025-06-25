
import React from 'react';
import { Calculator, Menu } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-blue-900">SlipSim</span>
        </div>
        <Menu className="h-6 w-6 text-blue-600" />
      </div>
    </header>
  );
};
