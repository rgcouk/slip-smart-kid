
import React, { useState } from 'react';
import { ParentModeToggle } from '@/components/ParentModeToggle';
import { PayslipCreator } from '@/components/PayslipCreator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChildProfiles } from '@/components/ChildProfiles';
import { LocaleSelector } from '@/components/LocaleSelector';

const Index = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-md flex-1">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">SlipSim</h1>
          <p className="text-blue-600">Create professional payslips with ease</p>
        </div>

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
      
      <Footer />
    </div>
  );
};

export default Index;
