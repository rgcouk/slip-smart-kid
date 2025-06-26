
import React, { useState } from 'react';
import { ParentModeToggle } from '@/components/ParentModeToggle';
import { PayslipCreator } from '@/components/PayslipCreator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChildProfiles } from '@/components/ChildProfiles';

const App = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-sm sm:max-w-2xl lg:max-w-6xl xl:max-w-7xl flex-1">
        {/* Header Section */}
        <div className="mb-6 lg:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-2 lg:mb-4">SlipSim</h1>
          <p className="text-sm sm:text-base lg:text-lg text-blue-600 max-w-2xl mx-auto">Create professional payslips with ease</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <div className="space-y-4">
                <ParentModeToggle 
                  isParentMode={isParentMode} 
                  onToggle={setIsParentMode} 
                />

                {isParentMode && (
                  <div className="pt-4 border-t border-gray-100">
                    <ChildProfiles 
                      selectedChild={selectedChild}
                      onSelectChild={setSelectedChild}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional info panel for larger screens */}
            <div className="hidden lg:block bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Fill out each step completely</li>
                <li>• Review your payslip before saving</li>
                <li>• Export as PDF when finished</li>
                {isParentMode && <li>• Use this as a learning tool</li>}
              </ul>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-9">
            <PayslipCreator 
              isParentMode={isParentMode}
              selectedChild={selectedChild}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
