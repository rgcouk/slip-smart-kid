
import React, { useState } from 'react';
import { ParentModeToggle } from '@/components/ParentModeToggle';
import { PayslipCreator } from '@/components/PayslipCreator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChildProfiles } from '@/components/ChildProfiles';
import { ProgressIndicator } from '@/components/payslip-steps/ProgressIndicator';

const App = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Business Setup' },
    { number: 2, title: 'Pay Period' },
    { number: 3, title: 'Earnings' },
    { number: 4, title: 'Deductions' },
    { number: 5, title: 'Review & Export' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-sm sm:max-w-2xl lg:max-w-6xl xl:max-w-7xl flex-1">
        {/* Header Section */}
        <div className="mb-6 lg:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2 lg:mb-4">SlipSim</h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto">Create professional payslips with ease</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <div className="glass-card p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
              <div className="space-y-4">
                <ParentModeToggle 
                  isParentMode={isParentMode} 
                  onToggle={setIsParentMode} 
                />

                {isParentMode && (
                  <div className="pt-4 border-t border-white/10">
                    <ChildProfiles 
                      selectedChild={selectedChild}
                      onSelectChild={setSelectedChild}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Progress Indicator for larger screens */}
            <div className="hidden lg:block">
              <div className="glass-card p-4 lg:p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Progress</h2>
                <ProgressIndicator steps={steps} currentStep={currentStep} />
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-9">
            <PayslipCreator 
              isParentMode={isParentMode}
              selectedChild={selectedChild}
              onStepChange={setCurrentStep}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
