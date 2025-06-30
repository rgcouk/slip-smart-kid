
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  Download, 
  Shield, 
  Clock, 
  Users,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calculator,
      title: 'Easy Payslip Creation',
      description: 'Create professional payslips in minutes with our intuitive step-by-step process.'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from beautifully designed templates that look professional and comply with standards.'
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Export your payslips as high-quality PDF files for easy sharing and record-keeping.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information with third parties.'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No more manual calculations or formatting. Generate payslips in seconds, not hours.'
    },
    {
      icon: Users,
      title: 'Parent Mode',
      description: 'Perfect for parents managing multiple children\'s allowances and teaching financial literacy.'
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: '$9',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 10 payslips per month',
        'Basic templates',
        'Email support',
        'PDF export'
      ],
      popular: false
    },
    {
      name: 'Premium',
      price: '$19',
      period: '/month',
      description: 'Most popular for growing businesses',
      features: [
        'Unlimited payslips',
        'Premium templates',
        'Priority support',
        'PDF export',
        'Custom branding',
        'Advanced reporting'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Everything in Premium',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'Multi-user accounts',
        'Advanced security'
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'How does SlipSim work?',
      answer: 'SlipSim is a simple 4-step process: enter basic information, add company details, specify deductions, and export your professional payslip as a PDF.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade encryption to protect your data. We never share your information with third parties and you can delete your data at any time.'
    },
    {
      question: 'Can I use this for teaching kids about money?',
      answer: 'Absolutely! Our Parent Mode is specifically designed for parents who want to teach their children about earning, deductions, and financial responsibility through allowances and chores.'
    },
    {
      question: 'What file formats can I export?',
      answer: 'Currently, we support PDF export, which is the most professional and widely accepted format for payslips.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we offer email support for all plans, with priority support for Premium and Enterprise users.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Dark Header/Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-400/30 hover:bg-purple-500/30" variant="secondary">
              Professional Payslip Generator
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Create Professional 
              <span className="block gradient-text">Payslips in Minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Whether you're running a business or teaching kids about money, SlipSim makes creating professional payslips simple and fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <a href={user ? "/app" : "/auth"}>
                  {user ? "Go to App" : "Get Started Free"}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300" asChild>
                <a href="/pricing">View Pricing</a>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* White Content Sections */}
      <div className="bg-white">
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Choose SlipSim?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to create professional payslips quickly and easily
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-slate-50 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Choose the perfect plan for your needs. Upgrade or downgrade at any time.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-600">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl lg:text-5xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-600 text-lg">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full h-12 font-medium transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                      variant={plan.popular ? 'default' : 'default'}
                      asChild
                    >
                      <a href={user ? "/subscription" : "/auth"}>
                        {user ? "Upgrade Now" : "Get Started"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between cursor-pointer">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-8">
                Join thousands of users who trust SlipSim for their payslip needs.
              </p>
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <a href={user ? "/app" : "/auth"}>
                  {user ? "Go to App" : "Start Creating Payslips"}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
