
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Pricing = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 10 payslips per month',
        'Basic templates',
        'Email support',
        'PDF export',
        'Secure data storage'
      ],
      popular: false,
      color: 'border-gray-200',
      buttonColor: 'bg-gray-900 hover:bg-gray-800 text-white'
    },
    {
      name: 'Professional',
      price: '$19',
      period: '/month',
      description: 'Most popular for growing businesses',
      features: [
        'Unlimited payslips',
        'Premium templates',
        'Priority support',
        'PDF export',
        'Custom branding',
        'Advanced reporting',
        'Employee management'
      ],
      popular: true,
      color: 'border-blue-500 ring-2 ring-blue-100',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'Multi-user accounts',
        'Advanced security',
        'White-label solution'
      ],
      popular: false,
      color: 'border-gray-200',
      buttonColor: 'bg-gray-900 hover:bg-gray-800 text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary">
        <Header />
        
        {/* Page Header */}
        <div className="container mx-auto px-6 py-16 text-center">
          <Badge className="mb-6 bg-background/10 text-primary-foreground border-background/20 px-4 py-2 rounded-xl">
            💎 Simple Pricing
          </Badge>
          <h1 className="text-4xl font-bold text-primary-foreground mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Upgrade or downgrade at any time.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="flex-1 bg-background">
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className="relative bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-in">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-blue-600 text-white border-0 px-4 py-2 shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {plan.name === 'Starter' && <Zap className="h-6 w-6 text-gray-600" />}
                    {plan.name === 'Professional' && <Star className="h-6 w-6 text-blue-600" />}
                    {plan.name === 'Enterprise' && <Shield className="h-6 w-6 text-gray-600" />}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-lg">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full h-12 font-medium transition-all duration-300 ${plan.buttonColor}`}
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

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "Can I change my plan at any time?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                },
                {
                  question: "Is there a free trial available?",
                  answer: "Yes, all plans come with a 14-day free trial. No credit card required to start."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
                },
                {
                  question: "Can I cancel my subscription?",
                  answer: "Yes, you can cancel your subscription at any time. There are no cancellation fees."
                }
              ].map((faq, index) => (
                <Card key={index} className="shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
