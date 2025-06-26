
import React, { useState } from 'react';
import { ParentModeToggle } from '@/components/ParentModeToggle';
import { PayslipCreator } from '@/components/PayslipCreator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChildProfiles } from '@/components/ChildProfiles';
import { LocaleSelector } from '@/components/LocaleSelector';

const App = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-sm sm:max-w-md lg:max-w-4xl flex-1">
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">SlipSim</h1>
          <p className="text-sm sm:text-base text-blue-600">Create professional payslips with ease</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <LocaleSelector />

          <ParentModeToggle 
            isParentMode={isParentMode} 
            onToggle={setIsParentMode} 
          />

          {isParentMode && (
            <ChildProfiles 
              selectedChild={selectedChild}
              onSelectChild={setSelectedChild}
            />
          )}

          <PayslipCreator 
            isParentMode={isParentMode}
            selectedChild={selectedChild}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
