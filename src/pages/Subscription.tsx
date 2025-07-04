
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const Subscription = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-6 py-8 flex-1 max-w-4xl">
        <div className="mb-8 animate-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and usage</p>
        </div>

        <div className="grid gap-6">
          {/* Current Plan */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Current Plan
                </span>
                <Badge variant="secondary" className="rounded-lg">Free Trial</Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Your current subscription details and benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Plan Type</p>
                  <p className="text-lg font-semibold text-foreground">Free Trial</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Trial Ends</p>
                  <p className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    January 2, 2025
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Trial Period</span>
                  <span>7 days remaining</span>
                </div>
                <Progress value={30} className="h-3 bg-muted" />
              </div>
              
              <div className="flex gap-2">
                <Button className="rounded-xl">Upgrade to Premium</Button>
                <Button variant="outline" className="rounded-xl">View All Plans</Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
              <CardDescription className="text-sm">
                Track your payslip creation and remaining quota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-2xl font-bold text-primary">2</p>
                  <p className="text-sm text-muted-foreground">Payslips Created</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-2xl font-bold text-primary">1</p>
                  <p className="text-sm text-muted-foreground">Remaining This Month</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Monthly Limit</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Monthly Usage</span>
                  <span>2 of 3 used</span>
                </div>
                <Progress value={67} className="h-3 bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Plan Features</CardTitle>
              <CardDescription className="text-sm">
                What's included in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Up to 3 payslips per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Basic templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">PDF export</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Premium templates (Upgrade required)</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Custom branding (Upgrade required)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Billing History</CardTitle>
              <CardDescription className="text-sm">
                Your payment history and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No billing history available</p>
                <p className="text-sm">You're currently on a free trial</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Subscription;
