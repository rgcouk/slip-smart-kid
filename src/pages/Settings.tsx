
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSelector } from '@/components/LocaleSelector';
import { User, CreditCard, Mail, Settings as SettingsIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : 'User';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-6 py-8 flex-1 max-w-4xl">
        <div className="mb-8 animate-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and subscription preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-sm">
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Name</label>
                <p className="text-sm text-muted-foreground">{displayName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
              </div>
              <Button variant="outline" className="rounded-xl">Edit Profile</Button>
            </CardContent>
          </Card>

          {/* Subscription Settings */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription Plan
              </CardTitle>
              <CardDescription className="text-sm">
                Manage your current subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Current Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="rounded-lg">Free Trial</Badge>
                    <span className="text-sm text-muted-foreground">7 days remaining</span>
                  </div>
                </div>
                <Button className="rounded-xl">Upgrade Plan</Button>
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-2 text-foreground">Plan Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Up to 3 payslips per month</li>
                  <li>• Basic templates</li>
                  <li>• Email support</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl">View Billing History</Button>
                <Button variant="outline" className="rounded-xl">Manage Payment Methods</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription className="text-sm">
                Configure how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your payslips</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Configure</Button>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="border border-border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <SettingsIcon className="h-5 w-5 text-primary" />
                Application Settings
              </CardTitle>
              <CardDescription className="text-sm">
                Customize your Formaslips experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Regional Settings */}
              <div className="space-y-4">
                <LocaleSelector />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Default Currency</p>
                  <p className="text-sm text-muted-foreground">USD ($)</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Change</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Date Format</p>
                  <p className="text-sm text-muted-foreground">MM/DD/YYYY</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Change</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Settings;
