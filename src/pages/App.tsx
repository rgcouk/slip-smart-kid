import React, { useState } from 'react';
import { ParentModeToggle } from '@/components/ParentModeToggle';
import { PayslipCreator } from '@/components/PayslipCreator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChildProfiles } from '@/components/ChildProfiles';
import { ProgressIndicator } from '@/components/payslip-steps/ProgressIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, TrendingUp } from 'lucide-react';
const App = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [{
    number: 1,
    title: 'Business Setup'
  }, {
    number: 2,
    title: 'Pay Period'
  }, {
    number: 3,
    title: 'Earnings'
  }, {
    number: 4,
    title: 'Deductions'
  }, {
    number: 5,
    title: 'Year to Date'
  }, {
    number: 6,
    title: 'Review & Export'
  }];
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dark Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800">
        <Header />
        
        {/* Page Header */}
        
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="shadow-sm border-0">
                
                
              </Card>

              {/* Progress Indicator for larger screens */}
              <div className="hidden lg:block">
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-gray-600" />
                      Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressIndicator steps={steps} currentStep={currentStep} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-9">
              <PayslipCreator isParentMode={isParentMode} selectedChild={selectedChild} onStepChange={setCurrentStep} />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>;
};
export default App;