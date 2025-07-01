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
    title: 'Review & Export'
  }];
  return <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <Header />
        
        {/* Page Header */}
        <div className="container mx-auto section-padding py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Payslip</h1>
              <p className="text-white/90">Generate professional payslips in minutes</p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1">
              Step {currentStep} of 5
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background">
        <div className="container mx-auto section-padding py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="formaslips-card">
                
                
              </Card>

              {/* Progress Indicator for larger screens */}
              <div className="hidden lg:block">
                <Card className="formaslips-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
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