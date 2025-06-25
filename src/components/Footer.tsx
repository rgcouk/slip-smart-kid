
import React from 'react';
import { Calculator } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Calculator className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-blue-900">SlipSim</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600">
            <span>&copy; 2025 SlipSim. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-blue-600">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-600">Terms of Service</a>
              <a href="/support" className="hover:text-blue-600">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
