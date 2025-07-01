import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Shield, Clock, Users, Check, ChevronDown, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
const Index = () => {
  const {
    user
  } = useAuth();
  const features = [{
    icon: FileText,
    title: 'Easy Payslip Creation',
    description: 'Create professional payslips in minutes with our intuitive step-by-step process.',
    color: 'bg-primary'
  }, {
    icon: FileText,
    title: 'Professional Templates',
    description: 'Choose from beautifully designed templates that look professional and comply with standards.',
    color: 'bg-secondary'
  }, {
    icon: Download,
    title: 'PDF Export',
    description: 'Export your payslips as high-quality PDF files for easy sharing and record-keeping.',
    color: 'bg-primary'
  }, {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your information with third parties.',
    color: 'bg-secondary'
  }, {
    icon: Clock,
    title: 'Save Time',
    description: 'No more manual calculations or formatting. Generate payslips in seconds, not hours.',
    color: 'bg-primary'
  }, {
    icon: Users,
    title: 'Parent Mode',
    description: 'Perfect for parents managing multiple children\'s allowances and teaching financial literacy.',
    color: 'bg-secondary'
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
  return <div className="min-h-screen bg-background animate-fade-in">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary">
        <Header />
        
        {/* Hero Section */}
        <section className="container mx-auto section-padding py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-2 touch-target-48" variant="secondary">
              ✨ Professional Payslip Generator
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Create Professional 
              <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Payslips in Minutes
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Whether you're running a business or teaching kids about money, Formaslips makes creating professional payslips simple and fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="formaslips-button text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl touch-target-48" asChild>
                <a href={user ? "/app" : "/auth"}>
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="formaslips-button text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50 touch-target-48" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <section className="bg-card border-b border-gray-200">
        <div className="container mx-auto section-padding py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-background py-20">
        <div className="container mx-auto section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make payslip creation effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="formaslips-card formaslips-button" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto section-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to streamline your payroll process?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses and individuals who trust Formaslips
            </p>
            <Button size="lg" className="formaslips-button text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl touch-target-48" asChild>
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