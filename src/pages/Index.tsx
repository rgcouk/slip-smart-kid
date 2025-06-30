import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, Download, Shield, Clock, Users, Check, ChevronDown, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
const Index = () => {
  const {
    user
  } = useAuth();
  const features = [{
    icon: Calculator,
    title: 'Easy Payslip Creation',
    description: 'Create professional payslips in minutes with our intuitive step-by-step process.',
    color: 'bg-blue-500'
  }, {
    icon: FileText,
    title: 'Professional Templates',
    description: 'Choose from beautifully designed templates that look professional and comply with standards.',
    color: 'bg-purple-500'
  }, {
    icon: Download,
    title: 'PDF Export',
    description: 'Export your payslips as high-quality PDF files for easy sharing and record-keeping.',
    color: 'bg-green-500'
  }, {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your information with third parties.',
    color: 'bg-red-500'
  }, {
    icon: Clock,
    title: 'Save Time',
    description: 'No more manual calculations or formatting. Generate payslips in seconds, not hours.',
    color: 'bg-orange-500'
  }, {
    icon: Users,
    title: 'Parent Mode',
    description: 'Perfect for parents managing multiple children\'s allowances and teaching financial literacy.',
    color: 'bg-pink-500'
  }];
  const stats = [{
    label: 'Payslips Created',
    value: '10,000+',
    icon: FileText
  }, {
    label: 'Happy Users',
    value: '2,500+',
    icon: Users
  }, {
    label: 'Time Saved',
    value: '500+ hrs',
    icon: Clock
  }, {
    label: 'Satisfaction',
    value: '98%',
    icon: Star
  }];
  return <div className="min-h-screen bg-gray-50">
      {/* Dark Header/Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <Header />
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-2" variant="secondary">
              ✨ Professional Payslip Generator
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Create Professional 
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Payslips in Minutes
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Whether you're running a business or teaching kids about money, SlipSim makes creating professional payslips simple and fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <a href={user ? "/app" : "/auth"}>
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300" asChild>
                <a href="#features" className="text-black\n">Learn More</a>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make payslip creation effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to streamline your payroll process?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses and individuals who trust SlipSim
            </p>
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <a href={user ? "/app" : "/auth"}>
                {user ? "Go to Dashboard" : "Start Creating Payslips"}
                <TrendingUp className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Index;