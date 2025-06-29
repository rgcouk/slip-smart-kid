
import React from 'react';
import { Calculator } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">SlipSim</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
            <span>&copy; 2025 SlipSim. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="/support" className="hover:text-purple-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
